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

package org.eclipse.lemminx.extensions.synapse.xsd;

import org.apache.xerces.xni.XMLResourceIdentifier;
import org.apache.xerces.xni.XNIException;
import org.apache.xerces.xni.parser.XMLInputSource;
import org.eclipse.lemminx.uriresolver.CacheResourcesManager;
import org.eclipse.lemminx.uriresolver.CacheResourcesManager.ResourceToDeploy;
import org.eclipse.lemminx.uriresolver.URIResolverExtension;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Resolve the XSD XML Schema and DTD dependencies.
 */
public class SynapseXSDURIResolverExtension implements URIResolverExtension {

    private static final Logger LOGGER = Logger.getLogger(SynapseXSDURIResolverExtension.class.getName());

    /**
     * The XMLSchema namespace URI (= http://www.w3.org/2001/XMLSchema).
     */
    private static final String SCHEMA_FOR_SCHEMA_URI_2001 = "http://www.w3.org/2001/XMLSchema"; //$NON-NLS-1$

    private static final List<ResourceToDeploy> SCHEMA_URI_2001_RESOURCES = Arrays.asList(
            new ResourceToDeploy("http://www.w3.org/2001/XMLSchema.xsd", "schemas/xsd/XMLSchema.xsd"),
            new ResourceToDeploy("http://www.w3.org/2001/XMLSchema.dtd", "schemas/xsd/XMLSchema.dtd"),
            new ResourceToDeploy("http://www.w3.org/2001/datatypes.dtd", "schemas/xsd/datatypes.dtd"));

    /**
     * The Namespace namespace URI (= http://www.w3.org/XML/1998/namespace).
     */
    private static final String SCHEMA_FOR_NAMESPACE_URI_1998 = "http://www.w3.org/XML/1998/namespace"; //$NON-NLS-1$

    private static final ResourceToDeploy NAMESPACE_URI_1998_RESOURCE = new ResourceToDeploy(
            "https://www.w3.org/2001/xml.xsd", "schemas/xsd/xml.xsd");

    @Override
    public String resolve(String baseLocation, String publicId, String systemId) {
        Path resourceToDeploy = null;
        try {
            if (SCHEMA_FOR_SCHEMA_URI_2001.equals(publicId)) {
                // Returns the patch of "http://www.w3.org/2001/XMLSchema.xsd" file system
                resourceToDeploy = SCHEMA_URI_2001_RESOURCES.get(0).getDeployedPath();
                return resourceToDeploy.toFile().toURI().toString();

            } else if (SCHEMA_FOR_NAMESPACE_URI_1998.equals(publicId)) {
                resourceToDeploy = CacheResourcesManager.getResourceCachePath(NAMESPACE_URI_1998_RESOURCE);
                return resourceToDeploy.toFile().toURI().toString();
            }
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Cannot access resource from path: " + resourceToDeploy, e);
        }
        return null;
    }

    @Override
    public XMLInputSource resolveEntity(XMLResourceIdentifier resourceIdentifier) throws XNIException, IOException {
        String publicId = resourceIdentifier.getNamespace();
        if (SCHEMA_FOR_SCHEMA_URI_2001.equals(publicId) || SCHEMA_FOR_NAMESPACE_URI_1998.equals(publicId)) {
            String baseLocation = resourceIdentifier.getBaseSystemId();
            String xslFilePath = resolve(baseLocation, publicId, null);
            if (xslFilePath != null) {
                return new XMLInputSource(publicId, xslFilePath, xslFilePath);
            }
        }
        return null;
    }
}
