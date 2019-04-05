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

package org.eclipse.lsp4xml.extensions.synapse.xsd.participants.diagnostics;

import org.apache.xerces.impl.Constants;
import org.apache.xerces.parsers.XMLGrammarPreparser;
import org.apache.xerces.util.XMLGrammarPoolImpl;
import org.apache.xerces.xni.grammars.XMLGrammarDescription;
import org.apache.xerces.xni.parser.XMLEntityResolver;
import org.apache.xerces.xni.parser.XMLInputSource;
import org.eclipse.lsp4j.Diagnostic;
import org.eclipse.lsp4j.jsonrpc.CancelChecker;
import org.eclipse.lsp4xml.dom.DOMDocument;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.logging.Logger;

/**
 * XSD validator utilities class.
 *
 */
public class XSDValidator {

	private static final Logger LOGGER = Logger.getLogger(XSDValidator.class.getName());

	public static void doDiagnostics(DOMDocument document, XMLEntityResolver entityResolver,
									 List<Diagnostic> diagnostics, CancelChecker monitor) {

		try {
			XMLGrammarPreparser grammarPreparser = new LSPXMLGrammarPreparser();
			grammarPreparser.registerPreparser(XMLGrammarDescription.XML_SCHEMA, null/* schemaLoader */);

			grammarPreparser.setProperty(Constants.XERCES_PROPERTY_PREFIX + Constants.XMLGRAMMAR_POOL_PROPERTY,
					new XMLGrammarPoolImpl());
			grammarPreparser.setFeature(Constants.XERCES_FEATURE_PREFIX + Constants.CONTINUE_AFTER_FATAL_ERROR_FEATURE,
					false);
			grammarPreparser.setFeature(Constants.XERCES_FEATURE_PREFIX + Constants.NAMESPACES_FEATURE, true);
			grammarPreparser.setFeature(Constants.XERCES_FEATURE_PREFIX + Constants.NAMESPACE_PREFIXES_FEATURE, true);
			grammarPreparser.setFeature(Constants.XERCES_FEATURE_PREFIX + Constants.VALIDATION_FEATURE, true);
			grammarPreparser.setFeature(Constants.XERCES_FEATURE_PREFIX + Constants.SCHEMA_VALIDATION_FEATURE, true);

			grammarPreparser.setFeature(Constants.XERCES_FEATURE_PREFIX + Constants.EXTERNAL_GENERAL_ENTITIES_FEATURE,
					true);
			grammarPreparser.setFeature(Constants.XERCES_FEATURE_PREFIX + Constants.EXTERNAL_PARAMETER_ENTITIES_FEATURE,
					true);
			grammarPreparser.setFeature(Constants.XERCES_FEATURE_PREFIX + Constants.WARN_ON_DUPLICATE_ATTDEF_FEATURE,
					true);

			/*
			 * if(configuration.getFeature(XSDValidationConfiguration.
			 * HONOUR_ALL_SCHEMA_LOCATIONS)) { try {
			 * grammarPreparser.setFeature(Constants.XERCES_FEATURE_PREFIX +
			 * "honour-all-schemaLocations", true); //$NON-NLS-1$ } catch (Exception e) { //
			 * catch the exception and ignore } }
			 *
			 * if(configuration.getFeature(XSDValidationConfiguration.
			 * FULL_SCHEMA_CONFORMANCE)) { try {
			 * grammarPreparser.setFeature(Constants.XERCES_FEATURE_PREFIX +
			 * Constants.SCHEMA_FULL_CHECKING, true); } catch (Exception e) { // ignore
			 * since we don't want to set it or can't. }
			 *
			 * }
			 */

			// Add LSP content handler to stop XML parsing if monitor is canceled.
			// grammarPreparser.setContentHandler(new LSPContentHandler(monitor));

			// Add LSP error reporter to fill LSP diagnostics from Xerces errors
			grammarPreparser.setProperty("http://apache.org/xml/properties/internal/error-reporter",
					new LSPErrorReporterForXSD(document, diagnostics));

			if (entityResolver != null) {
				grammarPreparser.setEntityResolver(entityResolver);
			}

			try {
				String content = document.getText();
				String uri = document.getDocumentURI();
				InputStream inputStream = new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8));
				XMLInputSource is = new XMLInputSource(null, uri, uri, inputStream, null);
				grammarPreparser.getLoader(XMLGrammarDescription.XML_SCHEMA);
				grammarPreparser.preparseGrammar(XMLGrammarDescription.XML_SCHEMA, is);
			} catch (Exception e) {
				// parser will return null pointer exception if the document is structurally
				// invalid
				LOGGER.warning(e.getMessage());
			}
		} catch (Exception e) {
			LOGGER.warning(e.getMessage());
		}
	}

}
