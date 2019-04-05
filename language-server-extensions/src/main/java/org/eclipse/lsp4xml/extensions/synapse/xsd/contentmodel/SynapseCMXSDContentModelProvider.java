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

package org.eclipse.lsp4xml.extensions.synapse.xsd.contentmodel;

import org.apache.xerces.impl.Constants;
import org.apache.xerces.impl.xs.XSLoaderImpl;
import org.apache.xerces.xs.XSModel;
import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.dom.NoNamespaceSchemaLocation;
import org.eclipse.lsp4xml.dom.SchemaLocation;
import org.eclipse.lsp4xml.extensions.contentmodel.model.CMDocument;
import org.eclipse.lsp4xml.extensions.contentmodel.model.ContentModelProvider;
import org.eclipse.lsp4xml.uriresolver.CacheResourceDownloadingException;
import org.eclipse.lsp4xml.uriresolver.URIResolverExtensionManager;
import org.eclipse.lsp4xml.utils.DOMUtils;
import org.w3c.dom.DOMErrorHandler;

/**
 * XSD content model provider.
 */
public class SynapseCMXSDContentModelProvider implements ContentModelProvider {

	private final URIResolverExtensionManager resolverExtensionManager;

	private XSLoaderImpl loader;

	public SynapseCMXSDContentModelProvider(URIResolverExtensionManager resolverExtensionManager) {
		this.resolverExtensionManager = resolverExtensionManager;
	}

	@Override
	public boolean adaptFor(DOMDocument document, boolean internal) {
		if (internal) {
			return false;
		}
		return document.hasSchemaLocation() || document.hasNoNamespaceSchemaLocation();
	}

	@Override
	public boolean adaptFor(String uri) {
		return DOMUtils.isXSD(uri);
	}

	@Override
	public String getSystemId(DOMDocument xmlDocument, String namespaceURI) {
		SchemaLocation schemaLocation = xmlDocument.getSchemaLocation();
		if (schemaLocation != null) {
			return schemaLocation.getLocationHint(namespaceURI);
		} else {
			NoNamespaceSchemaLocation noNamespaceSchemaLocation = xmlDocument.getNoNamespaceSchemaLocation();
			if (noNamespaceSchemaLocation != null) {
				if (namespaceURI != null) {
					// xsi:noNamespaceSchemaLocation doesn't define namespaces
					return null;
				}
				return noNamespaceSchemaLocation.getLocation();
			}
		}
		return null;
	}

	@Override
	public CMDocument createCMDocument(String key) {
		XSModel model = getLoader().loadURI(key);
		if (model != null) {
			// XML Schema can be loaded
			return new SynapseCMXSDDocument(model);
		}
		return null;
	}

	@Override
	public CMDocument createInternalCMDocument(DOMDocument xmlDocument) {
		return null;
	}

	private XSLoaderImpl getLoader() {
		if (loader == null) {
			loader = getSynchLoader();
		}
		return loader;
	}

	private synchronized XSLoaderImpl getSynchLoader() {
		if (loader != null) {
			return loader;
		}
		XSLoaderImpl xsLoader = new XSLoaderImpl();
		xsLoader.setParameter("http://apache.org/xml/properties/internal/entity-resolver", resolverExtensionManager);
		xsLoader.setParameter(Constants.DOM_ERROR_HANDLER, (DOMErrorHandler) error -> {
			if (error.getRelatedException() instanceof CacheResourceDownloadingException) {
				throw ((CacheResourceDownloadingException) error.getRelatedException());
			}
			return false;
		});
		return xsLoader;
	}

}
