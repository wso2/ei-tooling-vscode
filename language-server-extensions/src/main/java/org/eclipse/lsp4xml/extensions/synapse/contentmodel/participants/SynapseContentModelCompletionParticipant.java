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

package org.eclipse.lsp4xml.extensions.synapse.contentmodel.participants;

import org.eclipse.lsp4j.CompletionItem;
import org.eclipse.lsp4j.CompletionItemKind;
import org.eclipse.lsp4j.InsertTextFormat;
import org.eclipse.lsp4j.Range;
import org.eclipse.lsp4j.TextEdit;
import org.eclipse.lsp4xml.commons.BadLocationException;
import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.dom.DOMElement;
import org.eclipse.lsp4xml.extensions.contentmodel.model.CMAttributeDeclaration;
import org.eclipse.lsp4xml.extensions.contentmodel.model.CMDocument;
import org.eclipse.lsp4xml.extensions.contentmodel.model.CMElementDeclaration;
import org.eclipse.lsp4xml.extensions.contentmodel.utils.XMLGenerator;
import org.eclipse.lsp4xml.extensions.synapse.contentmodel.completions.SnippetProvider;
import org.eclipse.lsp4xml.extensions.synapse.contentmodel.model.SynapseContentModelManager;
import org.eclipse.lsp4xml.extensions.synapse.utils.Constants;
import org.eclipse.lsp4xml.extensions.synapse.xsd.contentmodel.SynapseCMXSDDocument;
import org.eclipse.lsp4xml.services.AttributeCompletionItem;
import org.eclipse.lsp4xml.services.extensions.CompletionParticipantAdapter;
import org.eclipse.lsp4xml.services.extensions.ICompletionRequest;
import org.eclipse.lsp4xml.services.extensions.ICompletionResponse;
import org.eclipse.lsp4xml.settings.SharedSettings;
import org.eclipse.lsp4xml.uriresolver.CacheResourceDownloadingException;

import java.util.Collection;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Extension to support XML completion based on content model (XML Schema completion, etc)
 */
public class SynapseContentModelCompletionParticipant extends CompletionParticipantAdapter {

    private static final Logger LOGGER = Logger.getLogger(SynapseContentModelCompletionParticipant.class.getName());

    @Override
    public void onTagOpen(ICompletionRequest request, ICompletionResponse response) throws Exception {
        try {
            DOMDocument document = request.getXMLDocument();
            SynapseContentModelManager synapseContentModelManager = request.getComponent(
                    SynapseContentModelManager.class);

            DOMElement parentElement = request.getParentElement();

            CMDocument cmDocument = synapseContentModelManager.findCMDocument(document);
            if (parentElement == null && cmDocument != null) {
                CMElementDeclaration cmElement = ((SynapseCMXSDDocument) cmDocument).
                        findElementDeclaration("definitions", Constants.SYNAPSE_NAMESPACE);
                Collection<CMElementDeclaration> cmElements = cmElement.getElements();

                fillWithChildrenElementDeclaration(null, cmElements, null, false,
                                                   request, response);

            } else if (parentElement != null) {
                // Try to retrieve XML Schema/DTD element declaration for the parent element
                // where completion was triggered.
                CMElementDeclaration cmElement = synapseContentModelManager.findCMElement(parentElement);
                if (cmElement != null) {
                    String defaultPrefix = parentElement.getPrefix();

                    fillWithChildrenElementDeclaration(parentElement, cmElement.getElements(), defaultPrefix,
                                                       false, request, response);
                }
            }

        } catch (CacheResourceDownloadingException e) {
            // XML Schema, DTD is loading, ignore this error
            LOGGER.log(Level.SEVERE, "Cannot download XML Schema: ", e);
        }
    }

    private void fillWithChildrenElementDeclaration(DOMElement element, Collection<CMElementDeclaration> cmElements,
                                                    String p, boolean forceUseOfPrefix, ICompletionRequest request,
                                                    ICompletionResponse response) throws BadLocationException {

        XMLGenerator generator = request.getXMLGenerator();

        for (CMElementDeclaration child : cmElements) {
            String prefix;
            if (forceUseOfPrefix) {
                prefix = p;
            } else {
                prefix = element != null ? element.getPrefix(child.getNamespace()) : null;
            }
            String label = child.getName(prefix);
            String documentation = child.getDocumentation();

            String predefinedSnippet = generateSnippet(child);
            if (predefinedSnippet != null) {
                createCompletionItem(label, predefinedSnippet, "Snippet: " + documentation, request, response);
            }

            String completionFromSchema = generator.generate(child, prefix);
            if (completionFromSchema != null) {
                createCompletionItem(label, completionFromSchema, documentation, request, response);
            }
        }
    }

    private String generateSnippet(CMElementDeclaration elementDeclaration) {
        String keyword = elementDeclaration.getName();
        return SnippetProvider.getSnippets().get(keyword);
    }

    private void createCompletionItem(String label, String xml, String documentation, ICompletionRequest request,
                                      ICompletionResponse response) {

        CompletionItem item = new CompletionItem(label);
        item.setFilterText(request.getFilterForStartTagName(label));
        item.setKind(CompletionItemKind.Property);
        if (documentation != null) {
            item.setDetail(documentation);
        }
        item.setTextEdit(new TextEdit(request.getReplaceRange(), xml));
        item.setInsertTextFormat(InsertTextFormat.Snippet);
        response.addCompletionItem(item, true);
    }

    @Override
    public void onAttributeName(boolean generateValue, Range fullRange, ICompletionRequest request,
                                ICompletionResponse response, SharedSettings settings) {
        // otherwise, manage completion based on XML Schema, DTD.
        if (!request.getNode().isElement()) {
            return;
        }
        DOMElement parentElement = (DOMElement) request.getNode();

        try {
            boolean canSupportSnippet = request.getCompletionSettings().isCompletionSnippetsSupported();
            SynapseContentModelManager synapseContentModelManager = request.getComponent(
                    SynapseContentModelManager.class);
            // Completion on attribute based on external grammar
            CMElementDeclaration cmElement = synapseContentModelManager.findCMElement(parentElement);
            fillAttributesWithCMAttributeDeclarations(parentElement, fullRange, cmElement, canSupportSnippet,
                                                      generateValue, response, settings);
            // Completion on attribute based on internal grammar
            cmElement = synapseContentModelManager.findInternalCMElement(parentElement);
            fillAttributesWithCMAttributeDeclarations(parentElement, fullRange, cmElement, canSupportSnippet,
                                                      generateValue, response, settings);
        } catch (CacheResourceDownloadingException e) {
            // XML Schema, DTD is loading, ignore this error
            LOGGER.log(Level.SEVERE, "Cannot download XML Schema: ", e);
        }
    }

    private void fillAttributesWithCMAttributeDeclarations(DOMElement parentElement, Range fullRange,
                                                           CMElementDeclaration cmElement, boolean canSupportSnippet,
                                                           boolean generateValue, ICompletionResponse response,
                                                           SharedSettings settings) {
        if (cmElement == null || cmElement.getElements() == null) {
            return;
        }
        Collection<CMAttributeDeclaration> attributes = cmElement.getAttributes();
        for (CMAttributeDeclaration cmAttribute : attributes) {
            String attrName = cmAttribute.getName();
            if (!parentElement.hasAttribute(attrName)) {
                CompletionItem item = new AttributeCompletionItem(attrName, canSupportSnippet, fullRange, generateValue,
                                                                  cmAttribute.getDefaultValue(),
                                                                  cmAttribute.getEnumerationValues(), settings);
                String documentation = cmAttribute.getDocumentation();
                if (documentation != null) {
                    item.setDetail(documentation);
                }
                response.addCompletionAttribute(item);
            }
        }
    }


    @Override
    public void onAttributeValue(String valuePrefix, Range fullRange, boolean addQuotes, ICompletionRequest request,
                                 ICompletionResponse response, SharedSettings settings) {

        if (!request.getNode().isElement()) {
            return;
        }
        DOMElement parentElement = (DOMElement) request.getNode();

        try {
            SynapseContentModelManager synapseContentModelManager = request.getComponent(
                    SynapseContentModelManager.class);
            // Completion on attribute values based on external grammar
            CMElementDeclaration cmElement = synapseContentModelManager.findCMElement(parentElement);
            fillAttributeValuesWithCMAttributeDeclarations(cmElement, request, response);
            // Completion on attribute values based on internal grammar
            cmElement = synapseContentModelManager.findInternalCMElement(parentElement);
            fillAttributeValuesWithCMAttributeDeclarations(cmElement, request, response);
        } catch (CacheResourceDownloadingException e) {
            // XML Schema, DTD is loading, ignore this error
            LOGGER.log(Level.SEVERE, "Cannot download XML Schema: ", e);
        }
    }

    private void fillAttributeValuesWithCMAttributeDeclarations(CMElementDeclaration cmElement,
                                                                ICompletionRequest request,
                                                                ICompletionResponse response) {

        if (cmElement == null) {
            return;
        }
        String attributeName = request.getCurrentAttributeName();
        CMAttributeDeclaration cmAttribute = cmElement.findCMAttribute(attributeName);
        if (cmAttribute != null) {
            cmAttribute.getEnumerationValues().forEach(value -> {
                CompletionItem item = new CompletionItem();
                item.setLabel(value);
                item.setKind(CompletionItemKind.Value);
                response.addCompletionAttribute(item);
            });
        }
    }

}
