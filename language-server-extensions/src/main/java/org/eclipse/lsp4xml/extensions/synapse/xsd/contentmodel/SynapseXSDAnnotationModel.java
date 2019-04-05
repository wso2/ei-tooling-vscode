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

import org.apache.xerces.xs.XSAnnotation;
import org.apache.xerces.xs.XSObjectList;
import org.xml.sax.Attributes;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import java.io.StringReader;

import static org.eclipse.lsp4xml.utils.StringUtils.normalizeSpace;

/**
 * Extract xs:document & xs:appinfo from the xs:annotation.
 *
 */
class SynapseXSDAnnotationModel {

	private String appInfo;
	private String documentation;

	private SynapseXSDAnnotationModel() {}

	private String getAppInfo() {
		return appInfo;
	}

	private String getDocumentation() {
		return documentation;
	}

	static String getDocumentation(XSObjectList annotations) {
		if (annotations == null) {
			return "";
		}
		StringBuilder doc = new StringBuilder();
		for (Object object : annotations) {
			XSAnnotation annotation = (XSAnnotation) object;
			SynapseXSDAnnotationModel annotationModel = SynapseXSDAnnotationModel.load(annotation);
			if (annotationModel != null) {
				if (annotationModel.getAppInfo() != null) {
					doc.append(annotationModel.getAppInfo());
				}
				if (annotationModel.getDocumentation() != null) {
					doc.append(annotationModel.getDocumentation());
				}
			}
		}
		return doc.toString();
	}

	private static SynapseXSDAnnotationModel load(XSAnnotation annotation) {
		try {
			SAXParserFactory factory = SAXParserFactory.newInstance();
			SAXParser saxParser = factory.newSAXParser();
			XSAnnotationHandler handler = new XSAnnotationHandler();
			saxParser.parse(new InputSource(new StringReader(annotation.getAnnotationString())), handler);
			return handler.getModel();
		} catch (Exception e) {
			return null;
		}
	}

	private static class XSAnnotationHandler extends DefaultHandler {

		private static final String APPINFO_ELEMENT = "appinfo";
		private static final String DOCUMENTATION_ELEMENT = "documentation";

		private StringBuilder current;
		private final SynapseXSDAnnotationModel model;

		XSAnnotationHandler() {
			model = new SynapseXSDAnnotationModel();
		}

		SynapseXSDAnnotationModel getModel() {
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
					model.appInfo = normalizeSpace(current.toString());
				} else if (qName.endsWith(DOCUMENTATION_ELEMENT)) {
					model.documentation = normalizeSpace(current.toString());
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
	}
}
