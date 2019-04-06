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

import org.eclipse.lsp4j.*;
import org.eclipse.lsp4xml.commons.BadLocationException;
import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.dom.DOMElement;
import org.eclipse.lsp4xml.extensions.contentmodel.utils.XMLGenerator;
import org.eclipse.lsp4xml.extensions.synapse.utils.Constants;
import org.eclipse.lsp4xml.extensions.synapse.contentmodel.completions.SnippetProvider;
import org.eclipse.lsp4xml.extensions.contentmodel.model.CMAttributeDeclaration;
import org.eclipse.lsp4xml.extensions.contentmodel.model.CMDocument;
import org.eclipse.lsp4xml.extensions.contentmodel.model.CMElementDeclaration;
import org.eclipse.lsp4xml.extensions.synapse.contentmodel.model.SynapseContentModelManager;
import org.eclipse.lsp4xml.services.AttributeCompletionItem;
import org.eclipse.lsp4xml.services.extensions.CompletionParticipantAdapter;
import org.eclipse.lsp4xml.services.extensions.ICompletionRequest;
import org.eclipse.lsp4xml.services.extensions.ICompletionResponse;
import org.eclipse.lsp4xml.settings.SharedSettings;
import org.eclipse.lsp4xml.extensions.synapse.xsd.contentmodel.SynapseCMXSDDocument;
import org.eclipse.lsp4xml.uriresolver.CacheResourceDownloadingException;

import java.util.*;

/**
 * Extension to support XML completion based on content model (XML Schema
 * completion, etc)
 */
public class SynapseContentModelCompletionParticipant extends CompletionParticipantAdapter {

	@Override
	public void onTagOpen(ICompletionRequest request, ICompletionResponse response) throws Exception {
		try {
			DOMDocument document = request.getXMLDocument();
			SynapseContentModelManager synapseContentModelManager = request.getComponent(SynapseContentModelManager.class);

			DOMElement parentElement = request.getParentElement();
			if (parentElement == null) {
				CMDocument cmDocument = synapseContentModelManager.findCMDocument(document);

				CMElementDeclaration cmElement = ((SynapseCMXSDDocument) cmDocument).
						findElementDeclaration("definitions", Constants.SYNAPSE_NAMESPACE);
				Collection<CMElementDeclaration> cmElements = cmElement.getElements();

				if (cmDocument != null) {
					fillWithChildrenElementDeclaration(parentElement, cmElements, null, false, request, response);
				}
				return;
			}
			// Try to retrieve XML Schema/DTD element declaration for the parent element
			// where completion was triggered.
			CMElementDeclaration cmElement = synapseContentModelManager.findCMElement(parentElement);
			String defaultPrefix = null;
			if (cmElement != null) {
				defaultPrefix = parentElement.getPrefix();

				fillWithChildrenElementDeclaration(parentElement, cmElement.getElements(), defaultPrefix, false,
						request, response);
			}
			if (parentElement.isDocumentElement()) {
				// root document element
				Collection<String> prefixes = parentElement.getAllPrefixes();
				for (String prefix : prefixes) {
					if (defaultPrefix != null && prefix.equals(defaultPrefix)) {
						continue;
					}
					CMDocument cmDocument = synapseContentModelManager.findCMDocument(parentElement);
					if (cmDocument != null) {
						fillWithChildrenElementDeclaration(parentElement, cmDocument.getElements(), prefix,
								true, request, response);
					}
				}
			}
			// Completion on tag based on internal content model (ex : internal DTD declared
			// in XML)
			CMElementDeclaration cmInternalElement = synapseContentModelManager.findInternalCMElement(parentElement);
			if (cmInternalElement != null) {
				defaultPrefix = parentElement.getPrefix();
				fillWithChildrenElementDeclaration(parentElement, cmInternalElement.getElements(), defaultPrefix,
						false, request, response);
			}
		} catch (CacheResourceDownloadingException e) {
			// XML Schema, DTD is loading, ignore this error
		}
	}

	private void fillWithChildrenElementDeclaration(DOMElement element, Collection<CMElementDeclaration> cmElements,
													String p, boolean forceUseOfPrefix, ICompletionRequest request,
													ICompletionResponse response) throws BadLocationException {

		XMLGenerator generator = request.getXMLGenerator();

		for (CMElementDeclaration child : cmElements) {
			String prefix = forceUseOfPrefix ? p : (element != null ? element.getPrefix(child.getNamespace()) : null);
			String label = child.getName(prefix);
			String documentation = child.getDocumentation();

			String xml = generateSnippet(child);
			if (xml != null) {
				createCompletionItem(label, xml, "Snippet: " + documentation, request, response);
				xml = null;
			}

			xml = generator.generate(child, prefix);
			if(xml != null) {
				createCompletionItem(label, xml, documentation, request, response);
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
		DOMElement parentElement = request.getNode().isElement() ? (DOMElement) request.getNode() : null;
		if (parentElement == null) {
			return;
		}
		try {
			boolean canSupportSnippet = request.getCompletionSettings().isCompletionSnippetsSupported();
			SynapseContentModelManager synapseContentModelManager = request.getComponent(SynapseContentModelManager.class);
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
		}
	}

	private void fillAttributesWithCMAttributeDeclarations(DOMElement parentElement, Range fullRange,
														   CMElementDeclaration cmElement, boolean canSupportSnippet,
														   boolean generateValue, ICompletionResponse response,
														   SharedSettings settings) {
		if (cmElement == null) {
			return;
		}
		Collection<CMAttributeDeclaration> attributes = cmElement.getAttributes();
		if (attributes == null) {
			return;
		}
		for (CMAttributeDeclaration cmAttribute : attributes) {
			String attrName = cmAttribute.getName();
			if (!parentElement.hasAttribute(attrName)) {
				CompletionItem item = new AttributeCompletionItem(attrName, canSupportSnippet, fullRange, generateValue,
						cmAttribute.getDefaultValue(), cmAttribute.getEnumerationValues(), settings);
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
		DOMElement parentElement = request.getNode().isElement() ? (DOMElement) request.getNode() : null;
		if (parentElement == null) {
			return;
		}
		try {
			SynapseContentModelManager synapseContentModelManager = request.getComponent(SynapseContentModelManager.class);
			// Completion on attribute values based on external grammar
			CMElementDeclaration cmElement = synapseContentModelManager.findCMElement(parentElement);
			fillAttributeValuesWithCMAttributeDeclarations(cmElement, request, response);
			// Completion on attribute values based on internal grammar
			cmElement = synapseContentModelManager.findInternalCMElement(parentElement);
			fillAttributeValuesWithCMAttributeDeclarations(cmElement, request, response);
		} catch (CacheResourceDownloadingException e) {
			// XML Schema, DTD is loading, ignore this error
		}
	}

	private void fillAttributeValuesWithCMAttributeDeclarations(CMElementDeclaration cmElement,
			ICompletionRequest request, ICompletionResponse response) {
		if (cmElement != null) {
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

}
