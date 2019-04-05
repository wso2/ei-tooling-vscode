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

import org.apache.xerces.xni.XMLLocator;
import org.eclipse.lsp4j.Diagnostic;
import org.eclipse.lsp4j.Range;
import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.extensions.synapse.xsd.participants.XSDErrorCode;
import org.eclipse.lsp4xml.services.extensions.diagnostics.AbstractLSPErrorReporter;
import org.xml.sax.ErrorHandler;

import java.util.List;

/**
 * The SAX {@link ErrorHandler} gives just information of the offset where there
 * is an error. To improve highlight XML error, this class extends the Xerces
 * XML reporter to catch location, key, arguments which is helpful to adjust the
 * LSP range.
 *
 */
public class LSPErrorReporterForXSD extends AbstractLSPErrorReporter {

	private static final String XSD_DIAGNOSTIC_SOURCE = "xsd";

	LSPErrorReporterForXSD(DOMDocument xmlDocument, List<Diagnostic> diagnostics) {
		super(XSD_DIAGNOSTIC_SOURCE, xmlDocument, diagnostics);
	}

	/**
	 * Create the LSP range from the SAX error.
	 * 
	 * @param location location
	 * @param key key
	 * @param arguments arguments
	 * @param document document
	 * @return the LSP range from the SAX error.
	 */
	@Override
	protected Range toLSPRange(XMLLocator location, String key, Object[] arguments, DOMDocument document) {
		// try adjust positions for XSD error
		XSDErrorCode xsdCode = XSDErrorCode.get(key);
		if (xsdCode != null) {
			Range range = XSDErrorCode.toLSPRange(location, xsdCode, arguments, document);
			if (range != null) {
				return range;
			}
		}
		return null;
	}
}
