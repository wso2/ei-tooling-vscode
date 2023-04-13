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

import org.apache.xerces.impl.dv.xs.XSSimpleTypeDecl;
import org.apache.xerces.impl.xs.XSComplexTypeDecl;
import org.apache.xerces.xs.XSAttributeUse;
import org.apache.xerces.xs.XSComplexTypeDefinition;
import org.apache.xerces.xs.XSConstants;
import org.apache.xerces.xs.XSElementDeclaration;
import org.apache.xerces.xs.XSModelGroup;
import org.apache.xerces.xs.XSObject;
import org.apache.xerces.xs.XSObjectList;
import org.apache.xerces.xs.XSParticle;
import org.apache.xerces.xs.XSSimpleTypeDefinition;
import org.apache.xerces.xs.XSTerm;
import org.apache.xerces.xs.XSTypeDefinition;
import org.eclipse.lemminx.dom.DOMElement;
import org.eclipse.lemminx.extensions.contentmodel.model.CMAttributeDeclaration;
import org.eclipse.lemminx.extensions.contentmodel.model.CMElementDeclaration;
import org.eclipse.lemminx.extensions.xsd.contentmodel.CMXSDAttributeDeclaration;
import org.eclipse.lemminx.extensions.xsd.contentmodel.CMXSDDocument;
import org.eclipse.lemminx.extensions.xsd.contentmodel.CMXSDElementDeclaration;
import org.eclipse.lemminx.services.extensions.ISharedSettingsRequest;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

/**
 * XSD element declaration implementation.
 */
public class SynapseCMXSDElementDeclaration extends CMXSDElementDeclaration {

    SynapseCMXSDElementDeclaration(SynapseCMXSDDocument document, XSElementDeclaration elementDeclaration) {
        super(document, elementDeclaration);
    }

    @Override
    public void collectAttributesDeclaration(XSComplexTypeDefinition typeDefinition,
                                              Collection<CMAttributeDeclaration> attributes) {
        XSObjectList list = typeDefinition.getAttributeUses();
        if (list != null) {
            for (int i = 0; i < list.getLength(); i++) {
                XSObject object = list.item(i);
                if (object.getType() == XSConstants.ATTRIBUTE_USE) {
                    XSAttributeUse attributeUse = (XSAttributeUse) object;
                    attributes.add(new SynapseCMXSDAttributeDeclaration(this, attributeUse));
                }
            }
        }
    }

}
