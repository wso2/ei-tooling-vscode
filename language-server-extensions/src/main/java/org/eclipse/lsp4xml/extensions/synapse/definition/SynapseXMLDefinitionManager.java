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
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
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

    private DOMNode targetedElement = null;

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
                targetedElement = null;
                findDefinitionChild(children, nodeName, attrTo, attrValue);

                if (targetedElement != null) {
                    collector.accept(targetedElement);
                } else {
                    Collection<WorkspaceFolder> workspaceFolderList =
                            WorkspaceFolders.getInstance().getWorkspaceFolders();

                    //assumption: akk opened workspaceFolders are synapse workspaces (i.e:
                    // WSO2/EnterpriseIntegrator/6.4.0/repository/deployment/server/synapse-config/default)
                    if (!workspaceFolderList.isEmpty()) {
                        for (WorkspaceFolder workspaceFolder : workspaceFolderList) {
                            String uri = workspaceFolder.getUri();
                            String updatedUri = resolveUri(nodeName, uri);

                            try {
                                listAllFiles(updatedUri, nodeName, attrTo, attrValue, collector);
                            } catch (WorkspaceDocumentException e) {
                                LOGGER.log(Level.SEVERE, "Error occurred while listing files", e);
                            }
                        }
                    }
                    if (targetedElement != null) {
                        collector.accept(targetedElement);
                    }
                }
            }
        }
    }

    private DOMNode findDefinitionChild(NodeList children, String targetTagName, String attributeName,
                                        String attributeValue) {
        if (children != null && children.getLength() > 0) {
            for (int i = 0; i < children.getLength(); i++) {

                if (children.item(i) instanceof DOMElement) {
                    DOMElement child = (DOMElement) children.item(i);
                    String tagName = child.getTagName();

                    if (tagName.equals(targetTagName) && child.hasAttributes()) {
                        List<DOMAttr> attrList = child.getAttributeNodes();

                        if (attrList != null) {
                            for (DOMAttr domAttr : attrList) {
                                String key = domAttr.getName();
                                if (key.equals(attributeName) && domAttr.getValue().equals(attributeValue)) {
                                    targetedElement = child;
                                    return targetedElement;
                                }
                            }
                        }
                    }
                    findDefinitionChild(child.getChildNodes(), targetTagName, attributeName, attributeValue);
                }
            }
        }
        return targetedElement;
    }

    private String readFromFileSystem(Path filePath) throws WorkspaceDocumentException {
        try {
            if (Files.exists(filePath)) {
                byte[] encoded = Files.readAllBytes(filePath);
                return new String(encoded, Charset.defaultCharset());
            }
            throw new WorkspaceDocumentException("Error in reading non-existent file '" + filePath);
        } catch (IOException e) {
            throw new WorkspaceDocumentException("Error in reading file '" + filePath + "': " + e.getMessage(), e);
        }
    }

    private void listAllFiles(String path, String nodeName, String attrTo, String attrValue,
                              Consumer<DOMNode> collector) throws WorkspaceDocumentException {
        try (Stream<Path> paths = Files.walk(Paths.get(path))) {
            for (Path filePath : paths.collect(Collectors.toList())) {
                if (Files.isRegularFile(filePath)) {

                    String content = readFromFileSystem(filePath);
                    DOMDocument doc = DOMParser.getInstance().parse(content, "file://" + filePath.toString(), null);
                    findDefinitionChild(doc.getChildNodes(), nodeName, attrTo, attrValue);

                    if (targetedElement != null) {
                        break;
                    }
                }
            }
        } catch (IOException e) {
            throw new WorkspaceDocumentException("Error while listing file in path: " + path, e);
        }
    }

    private String resolveUri(String folderType, String uri) {
        //removing file:// form the path
        uri = uri.substring(7);

        if (isWindows()) {
            uri = uri + Constants.SYNAPSE_CONFIG_PROJECT_PATH.replace("/", "\\");
        } else {
            uri = uri + Constants.SYNAPSE_CONFIG_PROJECT_PATH;
        }
        switch (folderType) {
            case Constants.SEQUENCE:
                uri += Constants.SEQUENCE_FOLDER_NAME;
                break;
            case Constants.ENDPOINT:
                uri += Constants.INBOUND_ENDPOINT_FOLDER_NAME;
                break;
            default:
        }
        return uri;
    }

    private boolean isWindows() {
        return System.getProperty("os.name").startsWith("Windows");
    }

}
