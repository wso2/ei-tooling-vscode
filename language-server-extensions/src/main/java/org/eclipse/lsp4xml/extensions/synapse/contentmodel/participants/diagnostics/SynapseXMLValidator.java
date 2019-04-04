/**
 *  Copyright (c) 2018 Angelo ZERR
 *  All rights reserved. This program and the accompanying materials
 *  are made available under the terms of the Eclipse Public License v2.0
 *  which accompanies this distribution, and is available at
 *  http://www.eclipse.org/legal/epl-v20.html
 *
 *  Contributors:
 *  Angelo Zerr <angelo.zerr@gmail.com> - initial API and implementation
 */
package org.eclipse.lsp4xml.extensions.synapse.contentmodel.participants.diagnostics;

import org.apache.xerces.parsers.SAXParser;
import org.apache.xerces.xni.parser.XMLEntityResolver;
import org.eclipse.lsp4j.Diagnostic;
import org.eclipse.lsp4j.jsonrpc.CancelChecker;
import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.extensions.contentmodel.participants.diagnostics.LSPErrorReporterForXML;
import org.eclipse.lsp4xml.extensions.contentmodel.settings.ContentModelSettings;
import org.eclipse.lsp4xml.extensions.contentmodel.settings.XMLValidationSettings;
import org.eclipse.lsp4xml.services.extensions.diagnostics.LSPContentHandler;
import org.eclipse.lsp4xml.uriresolver.IExternalSchemaLocationProvider;
import org.eclipse.lsp4xml.utils.SynapseSchemaUtils;
import org.xml.sax.*;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParserFactory;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

/**
 * XML validator utilities class.
 *
 */
public class SynapseXMLValidator {

	private static final Logger LOGGER = Logger.getLogger(SynapseXMLValidator.class.getName());

	public static void doDiagnostics(DOMDocument document, XMLEntityResolver entityResolver,
									 List<Diagnostic> diagnostics, ContentModelSettings contentModelSettings, CancelChecker monitor){

		SAXParserFactory factory = SAXParserFactory.newInstance();
		factory.setNamespaceAware(true);
		factory.setValidating(true);
		javax.xml.parsers.SAXParser parser = null;

		try {
			parser = factory.newSAXParser();

			parser.setProperty("http://java.sun.com/xml/jaxp/properties/schemaLanguage", "http://www.w3.org/2001/XMLSchema");
			parser.setProperty("http://java.sun.com/xml/jaxp/properties/schemaSource",
					SynapseSchemaUtils.schemaLocation);

			parser.setProperty("http://apache.org/xml/properties/internal/error-reporter",
					new LSPErrorReporterForXML(document, diagnostics));

			XMLReader reader = parser.getXMLReader();

			reader.setFeature("http://apache.org/xml/features/continue-after-fatal-error", false); //$NON-NLS-1$
			reader.setFeature("http://xml.org/sax/features/namespace-prefixes", true /* document.hasNamespaces() */); //$NON-NLS-1$
			reader.setFeature("http://xml.org/sax/features/namespaces", true /* document.hasNamespaces() */); //$NON-NLS-1$

			reader.setContentHandler(new LSPContentHandler(monitor));

			if (entityResolver != null) {
				reader.setProperty("http://apache.org/xml/properties/internal/entity-resolver", entityResolver); //$NON-NLS-1$
			}

			// If diagnostics for Schema preference is enabled
			XMLValidationSettings validationSettings = contentModelSettings != null ? contentModelSettings.getValidation() : null;
			if((validationSettings == null) || validationSettings.isSchema()) {
				checkExternalSchema(document.getExternalSchemaLocation(), (SAXParser) reader);
			}

			String content = document.getText();
			String uri = document.getDocumentURI();
			InputSource inputSource = new InputSource();
			inputSource.setByteStream(new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8)));
			inputSource.setSystemId(uri);

			reader.parse(inputSource);

		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private static void checkExternalSchema(Map<String, String> result, SAXParser reader)
			throws SAXNotRecognizedException, SAXNotSupportedException {
		if (result != null) {
			String noNamespaceSchemaLocation = result.get(IExternalSchemaLocationProvider.NO_NAMESPACE_SCHEMA_LOCATION);
			if (noNamespaceSchemaLocation != null) {
				reader.setProperty(IExternalSchemaLocationProvider.NO_NAMESPACE_SCHEMA_LOCATION,
						noNamespaceSchemaLocation);
			}
		}
	}
}
