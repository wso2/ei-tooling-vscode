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

import org.eclipse.lsp4j.Hover;
import org.eclipse.lsp4j.MarkupContent;
import org.eclipse.lsp4j.MarkupKind;
import org.eclipse.lsp4xml.dom.DOMAttr;
import org.eclipse.lsp4xml.dom.DOMElement;
import org.eclipse.lsp4xml.extensions.contentmodel.model.CMAttributeDeclaration;
import org.eclipse.lsp4xml.extensions.contentmodel.model.CMElementDeclaration;
import org.eclipse.lsp4xml.extensions.synapse.contentmodel.model.SynapseContentModelManager;
import org.eclipse.lsp4xml.services.XSISchemaModel;
import org.eclipse.lsp4xml.services.extensions.HoverParticipantAdapter;
import org.eclipse.lsp4xml.services.extensions.IHoverRequest;
import org.eclipse.lsp4xml.uriresolver.CacheResourceDownloadingException;

/**
 * Extension to support XML hover based on content model (XML Schema completion,
 * etc)
 */
public class SynapseContentModelHoverParticipant extends HoverParticipantAdapter {
    @Override
    public Hover onTag(IHoverRequest hoverRequest) throws Exception {
        try {
            SynapseContentModelManager contentModelManager = hoverRequest.getComponent(
                    SynapseContentModelManager.class);
            DOMElement node = (DOMElement) hoverRequest.getNode();
            CMElementDeclaration cmElement = contentModelManager.findCMElement(node);
            if (cmElement != null) {
                String doc = cmElement.getDocumentation();
                if (doc != null && doc.length() > 0) {
                    MarkupContent content = new MarkupContent();
                    content.setKind(MarkupKind.PLAINTEXT);
                    content.setValue(doc);
                    return new Hover(content, hoverRequest.getTagRange());
                }
            }
        } catch (CacheResourceDownloadingException e) {
            return getCacheWarningHover(e);
        }
        return null;
    }

    @Override
    public Hover onAttributeName(IHoverRequest hoverRequest) throws Exception {

        DOMAttr attribute = (DOMAttr) hoverRequest.getNode();

        //Attempts to compute specifically for XSI related attributes since
        //the XSD itself does not have enough information. Should create a mock XSD eventually.
        Hover temp = XSISchemaModel.computeHoverResponse(attribute, hoverRequest);
        if (temp != null) {
            return temp;
        }

        try {
            SynapseContentModelManager contentModelManager = hoverRequest.getComponent(
                    SynapseContentModelManager.class);

            CMElementDeclaration cmElement = contentModelManager.findCMElement(attribute.getOwnerElement());
            if (cmElement != null) {
                String attributeName = attribute.getName();
                CMAttributeDeclaration cmAttribute = cmElement.findCMAttribute(attributeName);
                if (cmAttribute != null) {
                    String doc = cmAttribute.getDocumentation();
                    if (doc != null && doc.length() > 0) {
                        MarkupContent content = new MarkupContent();
                        content.setKind(MarkupKind.PLAINTEXT);
                        content.setValue(doc);
                        return new Hover(content);
                    }
                }
            }
        } catch (CacheResourceDownloadingException e) {
            return getCacheWarningHover(e);
        }
        return null;
    }

    private Hover getCacheWarningHover(CacheResourceDownloadingException e) {
        // Here cache is enabled and some XML Schema, DTD, etc are loading
        MarkupContent content = new MarkupContent();
        content.setKind(MarkupKind.PLAINTEXT);
        content.setValue("Cannot process " + (e.isDTD() ? "DTD" : "XML Schema") + " hover: " + e.getMessage());
        return new Hover(content);
    }
}
