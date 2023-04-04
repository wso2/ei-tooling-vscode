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

package org.eclipse.lemminx.extensions.synapse.contentmodel.participants;

import org.eclipse.lemminx.dom.DOMAttr;
import org.eclipse.lemminx.dom.DOMElement;
import org.eclipse.lemminx.dom.DOMText;
import org.eclipse.lemminx.extensions.contentmodel.model.CMDocument;
import org.eclipse.lemminx.extensions.contentmodel.utils.XMLGenerator;
import org.eclipse.lemminx.extensions.synapse.contentmodel.model.SynapseContentModelManager;
import org.eclipse.lemminx.extensions.contentmodel.model. CMAttributeDeclaration;
import org.eclipse.lemminx.extensions.contentmodel.model.CMElementDeclaration;
import org.eclipse.lemminx.extensions.xsi.XSISchemaModel;
import org.eclipse.lemminx.services.extensions.HoverParticipantAdapter;
import org.eclipse.lemminx.services.extensions.IHoverRequest;
import org.eclipse.lemminx.services.extensions.ISharedSettingsRequest;
import org.eclipse.lemminx.uriresolver.CacheResourceDownloadingException;
import org.eclipse.lemminx.utils.MarkupContentFactory;
import org.eclipse.lemminx.utils.StringUtils;
import org.eclipse.lsp4j.Hover;
import org.eclipse.lsp4j.MarkupContent;
import org.eclipse.lsp4j.MarkupKind;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static org.eclipse.lemminx.utils.MarkupContentFactory.createHover;

/**
 * Extension to support XML hover based on content model (XML Schema completion etc).
 *
 */
public class SynapseContentModelHoverParticipant extends HoverParticipantAdapter {
    @Override
    public Hover onTag(IHoverRequest hoverRequest) throws Exception {
        try {
            SynapseContentModelManager contentModelManager = hoverRequest.getComponent(SynapseContentModelManager.class);
            DOMElement element = (DOMElement) hoverRequest.getNode();
            Collection<CMDocument> cmDocuments = contentModelManager.findCMDocument(element);
            if (cmDocuments.isEmpty()) {
                // no bound grammar -> no documentation
                return null;
            }
            // Compute element declaration documentation from bound grammars
            List<MarkupContent> contentValues = new ArrayList<>();
            for (CMDocument cmDocument : cmDocuments) {
                CMElementDeclaration cmElement = cmDocument.findCMElement(element);
                if (cmElement != null) {
                    MarkupContent content = XMLGenerator.createMarkupContent(cmElement, hoverRequest);
                    fillHoverContent(content, contentValues);
                }
            }
            return createHover(contentValues);
        } catch (CacheResourceDownloadingException e) {
            return getCacheWarningHover(e, hoverRequest);
        }
    }

    @Override
    public Hover onAttributeName(IHoverRequest hoverRequest) throws Exception {
        DOMAttr attribute = (DOMAttr) hoverRequest.getNode();
        DOMElement element = attribute.getOwnerElement();
        try {
            SynapseContentModelManager contentModelManager = hoverRequest.getComponent(SynapseContentModelManager.class);
            Collection<CMDocument> cmDocuments = contentModelManager.findCMDocument(element);
            if (cmDocuments.isEmpty()) {
                // no bound grammar -> no documentation
                return null;
            }
            // Compute attribute name declaration documentation from bound grammars
            List<MarkupContent> contentValues = new ArrayList<>();
            for (CMDocument cmDocument : cmDocuments) {
                CMElementDeclaration cmElement = cmDocument.findCMElement(element);
                if (cmElement != null) {
                    CMAttributeDeclaration cmAttribute = cmElement.findCMAttribute(attribute);
                    if (cmAttribute != null) {
                        MarkupContent content = XMLGenerator.createMarkupContent(cmAttribute, cmElement, hoverRequest);
                        fillHoverContent(content, contentValues);
                    }
                }
            }
            return createHover(contentValues);
        } catch (CacheResourceDownloadingException e) {
            return getCacheWarningHover(e, hoverRequest);
        }
    }

    @Override
    public Hover onAttributeValue(IHoverRequest hoverRequest) throws Exception {
        DOMAttr attribute = (DOMAttr) hoverRequest.getNode();

        // Attempts to compute specifically for XSI related attributes since
        // the XSD itself does not have enough information. Should create a mock XSD
        // eventually.
        Hover temp = XSISchemaModel.computeHoverResponse(attribute, hoverRequest);
        if (temp != null) {
            return temp;
        }

        DOMElement element = attribute.getOwnerElement();
        try {
            SynapseContentModelManager contentModelManager = hoverRequest.getComponent(SynapseContentModelManager.class);
            Collection<CMDocument> cmDocuments = contentModelManager.findCMDocument(element);
            if (cmDocuments.isEmpty()) {
                // no bound grammar -> no documentation
                return null;
            }
            String attributeValue = attribute.getValue();
            // Compute attribute value declaration documentation from bound grammars
            List<MarkupContent> contentValues = new ArrayList<>();
            for (CMDocument cmDocument : cmDocuments) {
                CMElementDeclaration cmElement = cmDocument.findCMElement(element);
                if (cmElement != null) {
                    CMAttributeDeclaration cmAttribute = cmElement.findCMAttribute(attribute);
                    if (cmAttribute != null) {
                        MarkupContent content = XMLGenerator.createMarkupContent(cmAttribute, attributeValue, cmElement,
                                hoverRequest);
                        fillHoverContent(content, contentValues);
                    }
                }
            }
            return createHover(contentValues);
        } catch (CacheResourceDownloadingException e) {
            return getCacheWarningHover(e, hoverRequest);
        }
    }

    @Override
    public Hover onText(IHoverRequest hoverRequest) throws Exception {
        DOMText text = (DOMText) hoverRequest.getNode();
        DOMElement element = text.getParentElement();
        if (element == null) {
            return null;
        }
        try {
            SynapseContentModelManager contentModelManager = hoverRequest.getComponent(SynapseContentModelManager.class);
            Collection<CMDocument> cmDocuments = contentModelManager.findCMDocument(element);
            if (cmDocuments.isEmpty()) {
                // no bound grammar -> no documentation
                return null;
            }
            String textContent = text.getTextContent();
            if (textContent != null) {
                textContent = textContent.trim();
            }
            // Compute attribute name declaration documentation from bound grammars
            List<MarkupContent> contentValues = new ArrayList<>();
            for (CMDocument cmDocument : cmDocuments) {
                CMElementDeclaration cmElement = cmDocument.findCMElement(element);
                if (cmElement != null) {
                    MarkupContent content = XMLGenerator.createMarkupContent(cmElement, textContent, hoverRequest);
                    fillHoverContent(content, contentValues);
                }
            }
            return createHover(contentValues);
        } catch (CacheResourceDownloadingException e) {
            return getCacheWarningHover(e, hoverRequest);
        }
    }

    private static Hover getCacheWarningHover(CacheResourceDownloadingException e, ISharedSettingsRequest support) {
        // Here cache is enabled and some XML Schema, DTD, etc are loading
        MarkupContent content = MarkupContentFactory.createMarkupContent(
                "Cannot process " + (e.isDTD() ? "DTD" : "XML Schema") + " hover: " + e.getMessage(),
                MarkupKind.MARKDOWN, support);
        return new Hover(content);
    }

    private static void fillHoverContent(MarkupContent content, List<MarkupContent> contents) {
        if (content != null && !StringUtils.isEmpty(content.getValue())) {
            contents.add(content);
        }
    }
}
