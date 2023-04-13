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

import org.apache.xerces.impl.dv.ValidatedInfo;
import org.apache.xerces.xs.XSAnnotation;
import org.apache.xerces.xs.XSMultiValueFacet;
import org.apache.xerces.xs.XSObject;
import org.apache.xerces.xs.XSObjectList;
import org.apache.xerces.xs.datatypes.ObjectList;
import org.eclipse.lemminx.extensions.synapse.xsd.utils.SynapseDocumentationLoadException;
//import org.eclipse.lemminx.extensions.xsd.contentmodel.XSDAnnotationModel;
import org.eclipse.lemminx.utils.DOMUtils;
import org.eclipse.lemminx.utils.StringUtils;
import org.xml.sax.Attributes;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import static org.eclipse.lemminx.dom.parser.Constants.DOCUMENTATION_CONTENT;
import static org.eclipse.lemminx.utils.StringUtils.isEmpty;
import static org.eclipse.lemminx.utils.StringUtils.normalizeSpace;

/**
 * Extract xs:document & xs:appinfo from the xs:annotation.
 */
class SynapseXSDAnnotationModel {

    private static final Logger LOGGER = Logger.getLogger(SynapseXSDAnnotationModel.class.getName());

    private final List<String> appInfo;

    private final List<String> documentation;

    private SynapseXSDAnnotationModel() {
        this.appInfo = new ArrayList<>();
        this.documentation = new ArrayList<>();
    }

    /**
     * Returns content from appinfo element(s)
     *
     * @return content from appinfo element(s)
     */
    public List<String> getAppInfo() {
        return appInfo;
    }

    /**
     * Returns content from documentation elements(s)
     *
     * @return content from documentation elements(s)
     */
    public List<String> getDocumentation() {
        return documentation;
    }

    /**
     * Returns documentation content from the provided collection of annotations
     *
     * @param annotations the collection of annotations
     * @return documentation content from the provided collection of annotations
     */
    public static List<String> getDocumentation(XSObjectList annotations) {
        return getDocumentation(annotations, null);
    }

    /**
     * Returns documentation content from the provided collection of annotations
     *
     * @param annotations the collection of attribute value annotations
     * @param value       the attribute value to find documentation content for
     * @return documentation content from the provided collection of annotations
     */
    public static List<String> getDocumentation(XSObjectList annotations, String value) {
        if (annotations == null) {
            return Collections.emptyList();
        }
        List<String> result = new ArrayList<>();
        for (Object object : annotations) {
            XSAnnotation annotation = getXSAnnotation((XSObject) object, value);
            if (annotation != null) {
                SynapseXSDAnnotationModel annotationModel = SynapseXSDAnnotationModel.load(annotation);
                if (annotationModel != null) {
                    List<String> documentation = annotationModel.getDocumentation();
                    if (documentation.size() > 0) {
                        result.addAll(documentation);
                    } else {
                        String annotationString = annotation.getAnnotationString();
                        if (!isEmpty(annotationString)) {
                            String docFromPattern = getDocumentation(annotationString);
                            if (!isEmpty(docFromPattern)) {
                                result.add(docFromPattern);
                            }
                        }
                    }
                }
            }
        }
        return result;
    }

    /**
     * Returns appinfo content from the provided collection of annotations
     *
     * @param annotations the collection of annotations
     * @return appinfo content from the provided collection of annotations
     */
    public static List<String> getAppInfo(XSObjectList annotations) {
        return getAppInfo(annotations, null);
    }

    /**
     * Returns appinfo content from the provided collection of annotations
     *
     * @param annotations the collection of attribute value annotations
     * @param value       the attribute value to find appinfo content for
     * @return appinfo content from the provided collection of annotations
     */
    public static List<String> getAppInfo(XSObjectList annotations, String value) {
        if (annotations == null) {
            return Collections.emptyList();
        }
        List<String> appinfo = new ArrayList<>();
        for (Object object : annotations) {
            XSAnnotation annotation = getXSAnnotation((XSObject) object, value);
            if (annotation != null) {
                SynapseXSDAnnotationModel annotationModel = SynapseXSDAnnotationModel.load(annotation);
                if (annotationModel != null) {
                    appinfo.addAll(annotationModel.getAppInfo());
                }
            }
        }
        return appinfo;
    }

    /**
     * Returns the prefix (ie. xs) from the provided collection of annotations
     *
     * @param annotations the collection of annotations
     * @return the prefix (ie. xs) from the provided collection of annotations
     */
    public static String getPrefix(XSObjectList annotations) {
        return getPrefix(annotations, null);
    }

    /**
     * Returns the prefix (ie. xs) from the provided collection of annotations
     *
     * Prerequisite: <code>value</code> should be provided if
     * <code>annotations</code> is a collection of attribute value annotations
     *
     * @param annotations the collection of annotations
     * @param value       the attribute value
     * @return the prefix (ie. xs) from the provided collection of annotations
     */
    public static String getPrefix(XSObjectList annotations, String value) {
        if (annotations == null) {
            return "";
        }
        for (Object object : annotations) {
            XSAnnotation annotation = getXSAnnotation((XSObject) object, value);
            if (annotation != null) {
                String content = annotation.getAnnotationString();
                int index = content.indexOf(":");
                if (index != -1) {
                    return content.substring(1, index);
                }
            }
        }
        return "";
    }

    public static SynapseXSDAnnotationModel load(XSAnnotation annotation) {
        try {
            SAXParserFactory factory = DOMUtils.newSAXParserFactory();
            SAXParser saxParser = factory.newSAXParser();
            SynapseXSDAnnotationModel.XSAnnotationHandler handler = new SynapseXSDAnnotationModel.XSAnnotationHandler();
            saxParser.parse(new InputSource(new StringReader(annotation.getAnnotationString())), handler);
            return handler.getModel();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Returns the <code>XSAnnotation</code> instance for the provided
     * <code>annotation</code>
     *
     * If <code>value</code> is provided, the <code>XSAnnotation</code> for an
     * attribute value will be searched for
     *
     * If not provided, the <code>XSAnnotation</code> for an attribute or element
     * will be searched for
     *
     * @param annotation the annotation object
     * @param value      the attribute value
     * @return the <code>XSAnnotation</code> instance for the provided
     *         <code>annotation</code>
     */
    private static XSAnnotation getXSAnnotation(XSObject annotation, String value) {
        if (annotation instanceof XSMultiValueFacet && value != null) {
            XSMultiValueFacet multiValueFacet = (XSMultiValueFacet) annotation;
            ObjectList enumerationValues = multiValueFacet.getEnumerationValues();
            XSObjectList annotationValues = multiValueFacet.getAnnotations();
            for (int i = 0; i < enumerationValues.getLength(); i++) {
                Object enumValue = enumerationValues.get(i);

                // Assuming always ValidatedInfo
                String enumString = ((ValidatedInfo) enumValue).stringValue();

                if (value.equals(enumString)) {
                    return (XSAnnotation) annotationValues.get(i);
                }
            }
        } else if (annotation instanceof XSAnnotation) {
            return (XSAnnotation) annotation;
        }
        return null;
    }

    private static class XSAnnotationHandler extends DefaultHandler {

        private static final String APPINFO_ELEMENT = "appinfo";
        private static final String DOCUMENTATION_ELEMENT = "documentation";

        private StringBuilder current;
        private final SynapseXSDAnnotationModel model;

        public XSAnnotationHandler() {
            model = new SynapseXSDAnnotationModel();
        }

        public SynapseXSDAnnotationModel getModel() {
            return model;
        }

        @Override
        public void startElement(String uri, String localName, String qName, Attributes attributes)
                throws SAXException {
            super.startElement(uri, localName, qName, attributes);
            if (qName.endsWith(DOCUMENTATION_ELEMENT) || qName.endsWith(APPINFO_ELEMENT)) {
                current = new StringBuilder();
            }
        }

        @Override
        public void endElement(String uri, String localName, String qName) throws SAXException {
            super.endElement(uri, localName, qName);
            if (current != null) {
                if (qName.endsWith(APPINFO_ELEMENT)) {
                    addIfNonEmptyString(model.appInfo, normalizeSpace(current.toString()));
                } else if (qName.endsWith(DOCUMENTATION_ELEMENT)) {
                    addIfNonEmptyString(model.documentation, normalizeSpace(current.toString()));
                }
                current = null;
            }
        }

        @Override
        public void characters(char[] ch, int start, int length) throws SAXException {
            if (current != null) {
                current.append(ch, start, length);
            }
            super.characters(ch, start, length);
        }

        private static void addIfNonEmptyString(List<String> list, String str) {
            if (!StringUtils.isEmpty(str)) {
                list.add(str);
            }
        }

    }

    public static String getDocumentation(String xml) {
        Matcher m = DOCUMENTATION_CONTENT.matcher(xml);
        if (m.find()) {
            return m.group(1);
        }
        return null;
    }
}
