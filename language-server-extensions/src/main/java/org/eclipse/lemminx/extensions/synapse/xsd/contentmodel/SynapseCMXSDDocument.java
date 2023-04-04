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

import org.apache.xerces.impl.dv.XSSimpleType;
import org.apache.xerces.impl.xs.XSLoaderImpl;
import org.apache.xerces.xs.StringList;
import org.apache.xerces.xs.XSConstants;
import org.apache.xerces.xs.XSElementDeclaration;
import org.apache.xerces.xs.XSModel;
import org.apache.xerces.xs.XSNamedMap;
import org.apache.xerces.xs.XSObject;
import org.apache.xerces.xs.XSObjectList;
import org.apache.xerces.xs.XSSimpleTypeDefinition;
import org.eclipse.lemminx.dom.DOMElement;
import org.eclipse.lemminx.dom.DOMNode;
import org.eclipse.lemminx.extensions.contentmodel.model.CMDocument;
import org.eclipse.lemminx.extensions.contentmodel.model.CMElementDeclaration;
import org.eclipse.lemminx.extensions.xsd.contentmodel.CMXSDDocument;
import org.eclipse.lemminx.extensions.xsd.contentmodel.CMXSDElementDeclaration;
import org.eclipse.lemminx.utils.StringUtils;
import org.eclipse.lsp4j.LocationLink;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * XSD document implementation.
 */
public class SynapseCMXSDDocument extends CMXSDDocument {

    SynapseCMXSDDocument(XSModel model, XSLoaderImpl xsLoaderImpl) {

        super(model, xsLoaderImpl);
    }

    @Override
    public CMElementDeclaration getXSDElement(XSElementDeclaration elementDeclaration) {
        SynapseCMXSDElementDeclaration element = (SynapseCMXSDElementDeclaration) elementMappings.get(elementDeclaration);
        if (element == null) {
            element = new SynapseCMXSDElementDeclaration(this, elementDeclaration);
            elementMappings.put(elementDeclaration, element);
        }
        return element;
    }
}
