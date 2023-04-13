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

package org.eclipse.lemminx.extensions.synapse.xsd.contentmodel;

import org.apache.xerces.impl.Constants;
import org.apache.xerces.impl.xs.XMLSchemaLoader;
import org.apache.xerces.impl.xs.XSLoaderImpl;
import org.apache.xerces.xs.XSModel;
import org.eclipse.lemminx.dom.DOMDocument;
import org.eclipse.lemminx.dom.NoNamespaceSchemaLocation;
import org.eclipse.lemminx.dom.SchemaLocation;
import org.eclipse.lemminx.dom.SchemaLocationHint;
import org.eclipse.lemminx.extensions.contentmodel.model.CMDocument;
import org.eclipse.lemminx.extensions.contentmodel.model.ContentModelProvider;
import org.eclipse.lemminx.extensions.xerces.AbstractLSPErrorReporter;
import org.eclipse.lemminx.extensions.xerces.LSPXMLEntityManager;
import org.eclipse.lemminx.extensions.xerces.ReflectionUtils;
import org.eclipse.lemminx.extensions.xsd.contentmodel.CMXSDContentModelProvider;
import org.eclipse.lemminx.extensions.xsd.contentmodel.CMXSDDocument;
import org.eclipse.lemminx.uriresolver.CacheResourceDownloadingException;
import org.eclipse.lemminx.uriresolver.URIResolverExtensionManager;
import org.eclipse.lemminx.utils.DOMUtils;
import org.eclipse.lemminx.utils.StringUtils;
import org.w3c.dom.DOMError;
import org.w3c.dom.DOMErrorHandler;

import java.util.ArrayList;
import java.util.Collection;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * XSD content model provider.
 */
public class SynapseCMXSDContentModelProvider extends CMXSDContentModelProvider {

    private static final Logger LOGGER = Logger.getLogger(SynapseCMXSDContentModelProvider.class.getName());

    public SynapseCMXSDContentModelProvider(URIResolverExtensionManager resolverExtensionManager) {
        super(resolverExtensionManager);
    }

    @Override
    public CMDocument createCMDocument(String key, boolean resolveExternalEntities) {
        XSLoaderImpl loader = getLoader();
        XSModel model = loader.loadURI(key);
        if (model != null) {
            // XML Schema can be loaded
            return new SynapseCMXSDDocument(model, loader);
        }
        return null;
    }

}
