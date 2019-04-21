/*
Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the "License"); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

package org.eclipse.lsp4xml.extensions.synapse.definition;

import org.eclipse.lsp4j.WorkspaceFolder;
import org.eclipse.lsp4xml.commons.WorkspaceFolders;
import org.eclipse.lsp4xml.dom.DOMAttr;
import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.dom.DOMElement;
import org.eclipse.lsp4xml.dom.DOMNode;
import org.eclipse.lsp4xml.dom.DOMParser;
import org.eclipse.lsp4xml.extensions.synapse.definition.utils.DefinitionSource;
import org.eclipse.lsp4xml.extensions.synapse.definition.utils.WorkspaceDocumentException;
import org.eclipse.lsp4xml.extensions.synapse.utils.Constants;
import org.w3c.dom.NodeList;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Definition model manager used to load WorkspaceFolders, reference key set needed for gotoDef.
 */
public class SynapseXMLDefinitionManager {

    private static final Logger LOGGER = Logger.getLogger(SynapseXMLDefinitionManager.class.getName());

    private static final SynapseXMLDefinitionManager INSTANCE = new SynapseXMLDefinitionManager();

    public static SynapseXMLDefinitionManager getInstance() {
        return INSTANCE;
    }

    private final Map<String, Map<String, String>> gotoDefReferences;

    private final Set<String> referenceKeySet;

    private SynapseXMLDefinitionManager() {
        gotoDefReferences = new HashMap<>();

        for (DefinitionSource definitionSource : DefinitionSource.values()) {
            gotoDefReferences.put(definitionSource.getKey(), new HashMap<String, String>() {{
                put("from", definitionSource.getFrom());
                put("to", definitionSource.getTo());
            }});
        }
        referenceKeySet = gotoDefReferences.keySet();
    }

    public void collect(DOMNode node, Consumer<DOMNode> collector) {

        String nodeName = node.getNodeName();

        if (referenceKeySet.contains(nodeName)) {
            String attrFrom = gotoDefReferences.get(nodeName).get("from");
            String attrTo = gotoDefReferences.get(nodeName).get("to");

            if (node.hasAttribute(attrFrom)) {

                DOMDocument ownerDocument = node.getOwnerDocument();
                NodeList children = ownerDocument.getChildNodes();

                String attrValue = node.getAttribute(attrFrom);
                DOMNode targetedElement = findTargetDefinitionNode(children, nodeName, attrTo, attrValue);

                if (targetedElement != null) {
                    collector.accept(targetedElement);
                } else {
                    findDefinitionInWorkspaceFolders(nodeName, attrTo, attrValue, collector);
                }
            }
        }
    }

    private void findDefinitionInWorkspaceFolders(String nodeName, String attrTo, String attrValue,
                                                  Consumer<DOMNode> collector) {
        Collection<WorkspaceFolder> workspaceFolderList =
                WorkspaceFolders.getInstance().getWorkspaceFolders();

        //assumption: only synapse workspaces are opened
        if (!workspaceFolderList.isEmpty()) {
            for (WorkspaceFolder workspaceFolder : workspaceFolderList) {
                String workspaceFolderUri = workspaceFolder.getUri();
                Path pathToTargetArtifactFolder = resolveUri(nodeName, workspaceFolderUri);

                try {
                    listAllFiles(pathToTargetArtifactFolder, nodeName, attrTo, attrValue, collector);
                } catch (WorkspaceDocumentException e) {
                    LOGGER.log(Level.SEVERE, "Error occurred while listing files", e);
                }
            }
        }
    }

    private DOMNode findTargetDefinitionNode(NodeList children, String targetTagName,
                                             String attributeName,
                                             String attributeValue) {

        DOMNode newTargetedElement = null;
        if (children != null && children.getLength() > 0) {

            for (int i = 0; i < children.getLength(); i++) {
                if (children.item(i) instanceof DOMElement) {
                    DOMElement child = (DOMElement) children.item(i);
                    String tagName = child.getTagName();

                    DOMNode matchingDomNode = findDefinitionInDOMElement(child, tagName, targetTagName, attributeName,
                                                                         attributeValue);
                    if (matchingDomNode != null) {
                        return matchingDomNode;
                    }
                    newTargetedElement = findTargetDefinitionNode(child.getChildNodes(), targetTagName,
                                                                  attributeName, attributeValue);
                }
            }
        }
        return newTargetedElement;
    }

    private DOMNode findDefinitionInDOMElement(DOMElement domElement, String tagName, String targetTagName,
                                               String attributeName, String attributeValue) {

        if (tagName.equals(targetTagName) && domElement.hasAttributes() && domElement.getAttributeNodes() != null) {

            for (DOMAttr domAttr : domElement.getAttributeNodes()) {
                String key = domAttr.getName();
                if (key.equals(attributeName) && domAttr.getValue().equals(attributeValue)) {
                    return domElement;
                }
            }
        }
        return null;
    }

    private String readFromFileSystem(Path filePath) throws WorkspaceDocumentException {
        try {
            if (filePath.toFile().exists()) {
                byte[] encoded = Files.readAllBytes(filePath);
                return new String(encoded, Charset.defaultCharset());
            }
            throw new WorkspaceDocumentException("Error in reading non-existent file '" + filePath);
        } catch (IOException e) {
            throw new WorkspaceDocumentException("Error in reading file '" + filePath + "': " + e.getMessage(), e);
        }
    }

    private void listAllFiles(Path path, String nodeName, String attrTo, String attrValue,
                              Consumer<DOMNode> collector) throws WorkspaceDocumentException {
        try (Stream<Path> paths = Files.walk(path)) {
            for (Path filePath : paths.collect(Collectors.toList())) {
                if (filePath.toFile().isFile()) {

                    String content = readFromFileSystem(filePath);
                    DOMDocument doc = DOMParser.getInstance().parse(content, "file://" + filePath.toString(), null);
                    DOMNode targetedElement = findTargetDefinitionNode(doc.getChildNodes(), nodeName, attrTo,
                                                                       attrValue);

                    if (targetedElement != null) {
                        collector.accept(targetedElement);
                        break;
                    }
                }
            }
        } catch (IOException e) {
            throw new WorkspaceDocumentException("Error while listing file in path: " + path, e);
        }
    }

    private Path resolveUri(String folderType, String uri) {
        Path path = Paths.get(URI.create(uri).getPath(), "src", "main", "synapse-config");

        switch (folderType) {
            case Constants.SEQUENCE:
                path = Paths.get(path.toString(), Constants.SEQUENCE_FOLDER_NAME);
                break;
            case Constants.ENDPOINT:
                path = Paths.get(path.toString(), Constants.INBOUND_ENDPOINT_FOLDER_NAME);
                break;
            default:
        }
        return path;
    }
}
