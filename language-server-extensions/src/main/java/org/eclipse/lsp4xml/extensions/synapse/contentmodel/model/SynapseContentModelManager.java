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
package org.eclipse.lsp4xml.extensions.synapse.contentmodel.model;

import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.dom.DOMElement;
import org.eclipse.lsp4xml.extensions.contentmodel.settings.XMLFileAssociation;
import org.eclipse.lsp4xml.extensions.contentmodel.uriresolver.XMLCacheResolverExtension;
import org.eclipse.lsp4xml.extensions.contentmodel.uriresolver.XMLCatalogResolverExtension;
import org.eclipse.lsp4xml.extensions.contentmodel.uriresolver.XMLFileAssociationResolverExtension;
import org.eclipse.lsp4xml.extensions.synapse.contentmodel.utils.SynapseSchemaUtils;
import org.eclipse.lsp4xml.uriresolver.URIResolverExtensionManager;
import org.eclipse.lsp4xml.utils.URIUtils;
import org.eclipse.lsp4xml.extensions.contentmodel.model.CMDocument;
import org.eclipse.lsp4xml.extensions.contentmodel.model.CMElementDeclaration;
import org.eclipse.lsp4xml.extensions.contentmodel.model.ContentModelProvider;

import java.util.*;

/**
 * Content model manager used to load XML Schema, DTD.
 *
 */
public class SynapseContentModelManager {

	private final Map<String, CMDocument> cmDocumentCache;

	private final URIResolverExtensionManager resolverManager;
	private final List<ContentModelProvider> modelProviders;

	private final XMLCacheResolverExtension cacheResolverExtension;
	private final XMLCatalogResolverExtension catalogResolverExtension;
	private final XMLFileAssociationResolverExtension fileAssociationResolver;

	public SynapseContentModelManager(URIResolverExtensionManager resolverManager) {
		this.resolverManager = resolverManager;
		modelProviders = new ArrayList<>();
		cmDocumentCache = Collections.synchronizedMap(new HashMap<>());
		fileAssociationResolver = new XMLFileAssociationResolverExtension();
		resolverManager.registerResolver(fileAssociationResolver);
		catalogResolverExtension = new XMLCatalogResolverExtension();
		resolverManager.registerResolver(catalogResolverExtension);
		cacheResolverExtension = new XMLCacheResolverExtension();
		resolverManager.registerResolver(cacheResolverExtension);
		// Use cache by default
		setUseCache(true);
	}

	public CMElementDeclaration findCMElement(DOMElement element) throws Exception {
		return findCMElement(element, element.getNamespaceURI());
	}

	/**
	 * Returns the declared element which matches the given XML element and null
	 * otherwise.
	 * 
	 * @param element the XML element
	 * @return the declared element which matches the given XML element and null
	 *         otherwise.
	 */
	public CMElementDeclaration findCMElement(DOMElement element, String namespaceURI) throws Exception {
		CMDocument cmDocument = findCMDocument(element);
		return cmDocument != null ? cmDocument.findCMElement(element, namespaceURI) : null;
	}

	public CMDocument findCMDocument(DOMElement element) {
		return findCMDocument(element.getOwnerDocument());
	}

	public CMDocument findCMDocument(DOMDocument xmlDocument) {
		ContentModelProvider modelProvider = getModelProviderByStandardAssociation(xmlDocument, false);
		return findCMDocument(modelProvider);
	}

	/**
	 * Returns the content model document loaded by the given uri and null
	 * otherwise.
	 *
	 * @param modelProvider
	 * @return the content model document loaded by the given uri and null
	 *         otherwise.
	 */
	private CMDocument findCMDocument(ContentModelProvider modelProvider) {
		// Resolve the XML Schema/DTD uri (file, http, etc)
		String key = SynapseSchemaUtils.schemaLocation;

		if (key == null) {
			return null;
		}
		// the XML Schema, DTD can be resolved
		if (modelProvider == null) {
			// the model provider cannot be get with standard mean (xsi:schemaLocation,
			// xsi:noNamespaceSchemaLocation, doctype)
			// try to get it by using extension (ex: .xsd, .dtd)
			modelProvider = getModelProviderByURI(key);
		}
		if (modelProvider == null) {
			return null;
		}
		CMDocument cmDocument = null;
		boolean isCacheable = isCacheable(key);
		if (isCacheable) {
			cmDocument = cmDocumentCache.get(key);
		}
		if (cmDocument == null) {
			cmDocument = modelProvider.createCMDocument(key);
			if (isCacheable && cmDocument != null) {
				cmDocumentCache.put(key, cmDocument);
			}
		}
		return cmDocument;
	}

	public CMElementDeclaration findInternalCMElement(DOMElement element) throws Exception {
		return findInternalCMElement(element, element.getNamespaceURI());
	}

	/**
	 * Returns the declared element which matches the given XML element and null
	 * otherwise.
	 * 
	 * @param element the XML element
	 * @return the declared element which matches the given XML element and null
	 *         otherwise.
	 */
	public CMElementDeclaration findInternalCMElement(DOMElement element, String namespaceURI) throws Exception {
		CMDocument cmDocument = findInternalCMDocument(element, namespaceURI);
		return cmDocument != null ? cmDocument.findCMElement(element, namespaceURI) : null;
	}

	public CMDocument findInternalCMDocument(DOMElement element, String namespaceURI) {
		return findInternalCMDocument(element.getOwnerDocument(), namespaceURI);
	}

	public CMDocument findInternalCMDocument(DOMDocument xmlDocument, String namespaceURI) {
		ContentModelProvider modelProvider = getModelProviderByStandardAssociation(xmlDocument, true);
		if (modelProvider != null) {
			return modelProvider.createInternalCMDocument(xmlDocument);
		}
		return null;
	}

	/**
	 * Returns the content model provider by using standard association
	 * (xsi:schemaLocation, xsi:noNamespaceSchemaLocation, doctype) an dnull
	 * otherwise.
	 * 
	 * @param xmlDocument
	 * @return the content model provider by using standard association
	 *         (xsi:schemaLocation, xsi:noNamespaceSchemaLocation, doctype) an dnull
	 *         otherwise.
	 */
	private ContentModelProvider getModelProviderByStandardAssociation(DOMDocument xmlDocument, boolean internal) {
		for (ContentModelProvider modelProvider : modelProviders) {
			if (modelProvider.adaptFor(xmlDocument, internal)) {
				return modelProvider;
			}
		}
		return null;
	}

	private ContentModelProvider getModelProviderByURI(String uri) {
		for (ContentModelProvider modelProvider : modelProviders) {
			if (modelProvider.adaptFor(uri)) {
				return modelProvider;
			}
		}
		return null;
	}

	private boolean isCacheable(String uri) {
		return !URIUtils.isFileResource(uri);
	}

	/**
	 * Set up XML catalogs.
	 * 
	 * @param catalogs list of XML catalog files.
	 * @return true if catalogs changed and false otherwise
	 */
	public boolean setCatalogs(String[] catalogs) {
		return catalogResolverExtension.setCatalogs(catalogs);
	}

	/**
	 * Refresh the XML catalogs.
	 */
	public void refreshCatalogs() {
		catalogResolverExtension.refreshCatalogs();
	}

	/**
	 * Set file associations.
	 * 
	 * @param fileAssociations
	 * @return true if file associations changed and false otherwise
	 */
	public boolean setFileAssociations(XMLFileAssociation[] fileAssociations) {
		return this.fileAssociationResolver.setFileAssociations(fileAssociations);
	}

	public void setRootURI(String rootUri) {
		rootUri = URIUtils.sanitizingUri(rootUri);
		fileAssociationResolver.setRootUri(rootUri);
		catalogResolverExtension.setRootUri(rootUri);
	}

	public void setUseCache(boolean useCache) {
		cacheResolverExtension.setUseCache(useCache);
	}

	public void registerModelProvider(ContentModelProvider modelProvider) {
		modelProviders.add(modelProvider);
	}

	public void unregisterModelProvider(ContentModelProvider modelProvider) {
		modelProviders.remove(modelProvider);
	}

}