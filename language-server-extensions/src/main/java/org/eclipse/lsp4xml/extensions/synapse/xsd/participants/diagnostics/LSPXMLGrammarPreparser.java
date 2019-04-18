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

import org.apache.xerces.impl.XMLErrorReporter;
import org.apache.xerces.parsers.XMLGrammarPreparser;
import org.apache.xerces.xni.XNIException;
import org.apache.xerces.xni.grammars.Grammar;
import org.apache.xerces.xni.grammars.XMLGrammarLoader;
import org.apache.xerces.xni.parser.XMLInputSource;

import java.io.IOException;

/**
 * Xerces {@link XMLGrammarPreparser} doesn't provide the capability to override
 * the {@link XMLErrorReporter} which is required to get XMLl This class
 * overrides {@link XMLGrammarPreparser#preparseGrammar(String, XMLInputSource)}
 * to use LSP error reporter.
 *
 */
public class LSPXMLGrammarPreparser extends XMLGrammarPreparser {

	private XMLErrorReporter errorReporter;

	@Override
	public Grammar preparseGrammar(String type, XMLInputSource is) throws XNIException, IOException {
		XMLGrammarLoader gl = getLoader(type);
		gl.setProperty(SYMBOL_TABLE, fSymbolTable);
		gl.setProperty(ENTITY_RESOLVER, fEntityResolver);
		gl.setProperty(ERROR_REPORTER, errorReporter);
		// potentially, not all will support this one...
		if (fGrammarPool != null) {
			try {
				gl.setProperty(GRAMMAR_POOL, fGrammarPool);
			} catch (Exception e) {
				// too bad...
			}
		}
		return gl.loadGrammar(is);
	}

	@Override
	public void setProperty(String propId, Object value) {
		if ("http://apache.org/xml/properties/internal/error-reporter".equals(propId)) {
			this.setErrorReporter((XMLErrorReporter) value);
		}
		super.setProperty(propId, value);
	}

	private void setErrorReporter(XMLErrorReporter errorReporter) {
		this.errorReporter = errorReporter;
	}

}
