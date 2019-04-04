/**
 *  Copyright (c) 2018 Angelo ZERR
 *  All rights reserved. This program and the accompanying materials
 *  are made available under the terms of the Eclipse Public License v2.0
 *  which accompanies this distribution, and is available at
 *  http://www.eclipse.org/legal/epl-v20.html
 *
 *  Contributors:
 *  Angelo Zerr <angelo.zerr@gmail.com> - initial API and implementation
 */
package org.eclipse.lsp4xml.extensions.synapse.contentmodel.participants;

import org.apache.xerces.impl.xs.XSComplexTypeDecl;
import org.apache.xerces.impl.xs.XSElementDecl;
import org.apache.xerces.impl.xs.XSModelGroupImpl;
import org.apache.xerces.impl.xs.XSParticleDecl;
import org.apache.xerces.xs.XSElementDeclaration;
import org.apache.xerces.xs.XSParticle;
import org.apache.xerces.xs.XSTerm;
import org.apache.xerces.xs.XSTypeDefinition;
import org.eclipse.lsp4j.*;
import org.eclipse.lsp4xml.commons.BadLocationException;
import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.dom.DOMElement;
import org.eclipse.lsp4xml.dom.DOMNode;
import org.eclipse.lsp4xml.extensions.contentmodel.utils.XMLGenerator;
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

				// XML is empty, in case of XML file associations, a XMl Schema/DTD can be bound
				// check if it's root element (in the case of XML file associations, the link to
				// XML Schema is done with pattern and not with XML root element)
				CMDocument cmDocument = synapseContentModelManager.findCMDocument(document);

				CMElementDeclaration cmElement = ((SynapseCMXSDDocument) cmDocument).findElementDeclaration("definitions", "http://ws.apache.org/ns/synapse");
				Collection<CMElementDeclaration> cmElements = cmElement.getElements();

//				Collection<CMElementDeclaration> newCMElements = new ArrayList<>(cmElements);
//				newCMElements.add(cmElement);

				if (cmDocument != null) {
					fillWithChildrenElementDeclaration(parentElement, cmElements, null, false, true, request, response);
				}
				return;
			}
			// Try to retrieve XML Schema/DTD element declaration for the parent element
			// where completion was triggered.
			CMElementDeclaration cmElement = synapseContentModelManager.findCMElement(parentElement);
			String defaultPrefix = null;
			if (cmElement != null) {
				defaultPrefix = parentElement.getPrefix();

				fillWithChildrenElementDeclaration(parentElement, cmElement.getElements(), defaultPrefix, false, false,
						request, response);
			}
			if (parentElement.isDocumentElement()) {
				// root document element
				Collection<String> prefixes = parentElement.getAllPrefixes();
				for (String prefix : prefixes) {
					if (defaultPrefix != null && prefix.equals(defaultPrefix)) {
						continue;
					}
					String namespaceURI = parentElement.getNamespaceURI(prefix);
					CMDocument cmDocument = synapseContentModelManager.findCMDocument(parentElement);
					if (cmDocument != null) {
						fillWithChildrenElementDeclaration(parentElement, cmDocument.getElements(), prefix, true, false,
								request, response);
					}
				}
			}
			// Completion on tag based on internal content model (ex : internal DTD declared
			// in XML)
			CMElementDeclaration cmInternalElement = synapseContentModelManager.findInternalCMElement(parentElement);
			if (cmInternalElement != null) {
				defaultPrefix = parentElement.getPrefix();
				fillWithChildrenElementDeclaration(parentElement, cmInternalElement.getElements(), defaultPrefix, false, false,
						request, response);
			}
		} catch (CacheResourceDownloadingException e) {
			// XML Schema, DTD is loading, ignore this error
		}
	}

	private XSParticleDecl[] getXsParticleDecls(CMElementDeclaration cmElement) {
		XSElementDeclaration elementDeclaration = cmElement.getElementDeclaration();
		XSParticleDecl[] fParticles = null;
		if (elementDeclaration instanceof XSElementDecl) {
			XSElementDecl xsElementDecl = (XSElementDecl) elementDeclaration;
			XSTypeDefinition definition = xsElementDecl.fType;
			if (definition instanceof XSComplexTypeDecl) {
				XSComplexTypeDecl typeDecl = (XSComplexTypeDecl) definition;
				XSParticle particle = typeDecl.getParticle();
				if (particle instanceof XSParticleDecl) {
					XSParticleDecl particleDecl = (XSParticleDecl) particle;
					XSTerm fValue = particleDecl.fValue;
					if (particle instanceof XSParticleDecl) {
						XSModelGroupImpl modelGroup = (XSModelGroupImpl) fValue;
						fParticles = modelGroup.fParticles;
					} else if(particle instanceof XSModelGroupImpl) {

					}
				}
			}
		}
		return fParticles;
	}

	private void fillWithChildrenElementDeclaration(DOMElement element, Collection<CMElementDeclaration> cmElements,
													String p, boolean forceUseOfPrefix, boolean isRootElement, ICompletionRequest request, ICompletionResponse response)
			throws BadLocationException {

		XMLGenerator generator = request.getXMLGenerator();

		for (CMElementDeclaration child : cmElements) {
			String prefix = forceUseOfPrefix ? p : (element != null ? element.getPrefix(child.getNamespace()) : null);
			String label = child.getName(prefix);
			String documentation = child.getDocumentation();

			String xml = generateSnippet(child);
			if (xml != null) {
				createCompletionItem(child, label, xml, "Snippet: " + documentation, request, response);
				xml = null;
			}

			xml = generator.generate(child, prefix);
			if(xml != null) {
				createCompletionItem(child, label, xml, documentation, request, response);
			}


		}
	}

	public String generateSnippet(CMElementDeclaration elementDeclaration) {

		String keyword = elementDeclaration.getName();
		return SnippetProvider.snippets.get(keyword);

	}

	public void createCompletionItem(CMElementDeclaration child, String label, String xml, String documentation, ICompletionRequest request,
                                     ICompletionResponse response) throws BadLocationException {

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

	private Collection<CMElementDeclaration> filterRequiredCmElements(DOMElement element, Collection<CMElementDeclaration> cmElements,
																	  XSParticleDecl[] fParticles){
		if (element != null) {
			Map<String, CMElementDeclaration> cmElementsMap = null;
			if (cmElements.size() > 0) {
				cmElementsMap = new HashMap<>();
				for (CMElementDeclaration child : cmElements) {
					String name = child.getElementDeclaration().getName();
					cmElementsMap.put(name, child);
				}
			}

			//getting original children of the element
			Collection<CMElementDeclaration> resultantCMElements = new ArrayList<>();
			List<DOMNode> children = element.getChildren();
			List<String> namesOfChildren = new ArrayList<>();

			if (children.size() > 0) {
				for (DOMNode child : children) {
					namesOfChildren.add(child.getNodeName());
				}
			}
			int index = 0;

			begin:
			for (XSParticleDecl particleDecl : fParticles) {
				XSTerm fValue = particleDecl.fValue;
				int minOccurs = particleDecl.fMinOccurs;
				int maxOccurs = particleDecl.fMaxOccurs;

				if (fValue instanceof XSModelGroupImpl) {
					int fParticalCount = ((XSModelGroupImpl) fValue).fParticleCount;
					XSParticleDecl[] internalfParticles = ((XSModelGroupImpl) fValue).fParticles;

					for(int i = 0; i < fParticalCount; i++) {

					}



					XSModelGroupImpl modelGroup = (XSModelGroupImpl) fValue;
					fParticles = modelGroup.fParticles;
				}else if (fValue instanceof XSElementDecl) {
					String name = particleDecl.fValue.getName();
					if (namesOfChildren.size() > 0 && namesOfChildren.contains(name)) {
						int occurrence = Collections.frequency(namesOfChildren, name);

						if (occurrence < maxOccurs) {
							((ArrayList<CMElementDeclaration>) resultantCMElements).add(cmElementsMap.get(name));
						}
					}else {
						((ArrayList<CMElementDeclaration>) resultantCMElements).add(cmElementsMap.get(name));
					}
				}

			}


			for (CMElementDeclaration child : cmElements) {
				String name = child.getElementDeclaration().getName();
				if (namesOfChildren.size() > 0 && namesOfChildren.contains(child.getElementDeclaration().getName())) {
					int occurance = Collections.frequency(namesOfChildren, name);
					int maxOccurs = fParticles[index].fMaxOccurs;

					if (occurance < maxOccurs) {
						((ArrayList<CMElementDeclaration>) resultantCMElements).add(child);
					}
				}else {
					boolean status = ((ArrayList<CMElementDeclaration>) resultantCMElements).add(child);
				}
				index++;
			}
			return resultantCMElements;
		}
		return cmElements;
	}

	@Override
	public void onAttributeName(boolean generateValue, Range fullRange, ICompletionRequest request,
								ICompletionResponse response, SharedSettings settings) throws Exception {
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
														   CMElementDeclaration cmElement, boolean canSupportSnippet, boolean generateValue,
														   ICompletionResponse response, SharedSettings settings) {
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
								 ICompletionResponse response, SharedSettings settings) throws Exception {
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


//				cmAttribute.getEnumerationValues().f
			}
		}
	}

}
