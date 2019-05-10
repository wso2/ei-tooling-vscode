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

package org.wso2.maven.Model;

import org.apache.axiom.om.OMAbstractFactory;
import org.apache.axiom.om.OMDocument;
import org.apache.axiom.om.OMElement;
import org.apache.axiom.om.OMFactory;
import org.apache.axiom.om.util.AXIOMUtil;
import org.apache.maven.plugin.MojoExecutionException;
import org.wso2.maven.Constants;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import javax.xml.namespace.QName;
import javax.xml.stream.XMLStreamException;
import javax.xml.transform.Source;
import javax.xml.transform.Templates;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

public abstract class AbstractXmlDoc {
    private static OMFactory factory = OMAbstractFactory.getOMFactory();

    protected List<OMElement> getChildElements(OMElement parentElement, String tagName) {
        List<OMElement> elements = new ArrayList<>();
        Iterator children = parentElement.getChildren();
        while (children.hasNext()) {
            Object child = children.next();
            if (child instanceof OMElement) {
                OMElement childOMElement = (OMElement) child;
                if (tagName == null || tagName.trim().equals("") || childOMElement.getLocalName().equals(tagName)) {
                    elements.add(childOMElement);
                }
            }
        }
        return elements;
    }

    protected String getAttribute(OMElement element, String attributeName) {
        return element.getAttributeValue(new QName(attributeName));
    }

    protected OMElement getElement(String localName, String text) {
        OMElement element = factory.createOMElement(new QName(localName));
        element.setText(text);
        return element;
    }

    protected OMElement getElement(String xmlString) throws XMLStreamException {
        return AXIOMUtil.stringToOM(xmlString);
    }

    protected OMElement getFirstChildWithName(OMElement element, String localName) {
        return element.getFirstChildWithName(new QName(localName));
    }

    protected OMElement addAttribute(OMElement element, String attributeName, String attributeValue) {
        element.addAttribute(attributeName, attributeValue, null);
        return element;
    }

    private static void prettify(OMElement wsdlElement, OutputStream out) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        wsdlElement.serialize(baos);

        Source stylesheetSource =
                new StreamSource(
                        new ByteArrayInputStream(
                                Constants.PRETTY_PRINT_STYLESHEET
                                        .getBytes()));
        Source xmlSource = new StreamSource(new ByteArrayInputStream(baos.toByteArray()));

        TransformerFactory tf = TransformerFactory.newInstance();
        Templates templates = tf.newTemplates(stylesheetSource);
        Transformer transformer = templates.newTransformer();
        transformer.transform(xmlSource, new StreamResult(out));
    }

    protected String serialize(OMElement element) throws MojoExecutionException {
        OMDocument document = factory.createOMDocument();
        document.addChild(element);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            prettify(element, outputStream);
        } catch (Exception e) {
            throw new MojoExecutionException("Error serializing", e);
        }
        return outputStream.toString();
    }

    protected String getPretifiedString(OMElement documentElement) throws Exception {
        String result;
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        prettify(documentElement, outputStream);
        result = outputStream.toString();
        return result;
    }
}
