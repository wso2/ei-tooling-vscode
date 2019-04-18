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
package org.eclipse.lsp4xml.extensions.synapse.contentmodel.model;

import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.dom.DOMElement;
import org.eclipse.lsp4xml.extensions.contentmodel.model.CMDocument;
import org.eclipse.lsp4xml.extensions.contentmodel.model.CMElementDeclaration;
import org.eclipse.lsp4xml.extensions.contentmodel.model.ContentModelProvider;
import org.eclipse.lsp4xml.extensions.contentmodel.settings.XMLFileAssociation;
import org.eclipse.lsp4xml.extensions.contentmodel.uriresolver.XMLCacheResolverExtension;
import org.eclipse.lsp4xml.extensions.contentmodel.uriresolver.XMLCatalogResolverExtension;
import org.eclipse.lsp4xml.extensions.contentmodel.uriresolver.XMLFileAssociationResolverExtension;
import org.eclipse.lsp4xml.extensions.synapse.utils.Constants;
import org.eclipse.lsp4xml.utils.URIUtils;

import java.util.*;


/**
 * Content model manager used to load XML Schema, DTD.
 */
public class SynapseContentModelManager {

    private final Map<String, CMDocument> cmDocumentCache;
    private final List<ContentModelProvider> modelProviders;

    private final XMLCacheResolverExtension cacheResolverExtension;
    private final XMLCatalogResolverExtension catalogResolverExtension;
    private final XMLFileAssociationResolverExtension fileAssociationResolver;

    public SynapseContentModelManager() {
        modelProviders = new ArrayList<>();
        cmDocumentCache = Collections.synchronizedMap(new HashMap<>());
        fileAssociationResolver = new XMLFileAssociationResolverExtension();
        catalogResolverExtension = new XMLCatalogResolverExtension();
        cacheResolverExtension = new XMLCacheResolverExtension();
        // Use cache by default
        setUseCache(true);
    }

    public CMElementDeclaration findCMElement(DOMElement element) {
        return findCMElement(element, element.getNamespaceURI());
    }

    /**
     * Returns the declared element which matches the given XML element and null
     * otherwise.
     *
     * @param element the XML element
     * @return the declared element which matches the given XML element and null
     * otherwise.
     */
    private CMElementDeclaration findCMElement(DOMElement element, String namespaceURI) {
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
     * @param modelProvider modelProvider
     * @return the content model document loaded by the given uri and null
     * otherwise.
     */
    private CMDocument findCMDocument(ContentModelProvider modelProvider) {
        // Resolve the XML Schema/DTD uri (file, http, etc)
        String key = Constants.SCHEMA_LOCATION;

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

    public CMElementDeclaration findInternalCMElement(DOMElement element) {
        return findInternalCMElement(element, element.getNamespaceURI());
    }

    /**
     * Returns the declared element which matches the given XML element and null
     * otherwise.
     *
     * @param element the XML element
     * @return the declared element which matches the given XML element and null
     * otherwise.
     */
    private CMElementDeclaration findInternalCMElement(DOMElement element, String namespaceURI) {
        CMDocument cmDocument = findInternalCMDocument(element);
        return cmDocument != null ? cmDocument.findCMElement(element, namespaceURI) : null;
    }

    private CMDocument findInternalCMDocument(DOMElement element) {
        return findInternalCMDocument(element.getOwnerDocument());
    }

    private CMDocument findInternalCMDocument(DOMDocument xmlDocument) {
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
     * @param xmlDocument the xml DOM Document
     * @param internal    boolean value
     * @return the content model provider by using standard association
     * (xsi:schemaLocation, xsi:noNamespaceSchemaLocation, doctype) an null
     * otherwise.
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
     * @param fileAssociations fileAssociations
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
