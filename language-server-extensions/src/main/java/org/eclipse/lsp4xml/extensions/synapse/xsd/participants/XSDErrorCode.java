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

package org.eclipse.lsp4xml.extensions.synapse.xsd.participants;

import org.apache.xerces.xni.XMLLocator;
import org.eclipse.lsp4j.Range;
import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.services.extensions.diagnostics.IXMLErrorCode;
import org.eclipse.lsp4xml.utils.XMLPositionUtility;

import java.util.HashMap;
import java.util.Map;

/**
 * XSD error code.
 * 
 * see https://wiki.xmldation.com/Support/Validator
 *
 */
public enum XSDErrorCode implements IXMLErrorCode {

	S4S_ELT_INVALID_CONTENT_1("s4s-elt-invalid-content.1"), //
	S4S_ELT_MUST_MATCH_1("s4s-elt-must-match.1"), //
	S4S_ATT_MUST_APPEAR("s4s-att-must-appear"), //
	S4S_ELT_INVALID_CONTENT_2("s4s-elt-invalid-content.2"), //
	S4S_ATT_NOT_ALLOWED("s4s-att-not-allowed"), //
	S4S_ATT_INVALID_VALUE("s4s-att-invalid-value"), //
	S4S_ELT_CHARACTER("s4s-elt-character"), //
	SRC_RESOLVE_4_2("src-resolve.4.2"), //
	SRC_RESOLVE("src-resolve");

	private final String code;

	XSDErrorCode(String code) {
		this.code = code;
	}

	@Override
	public String getCode() {
		if (code == null) {
			return name();
		}
		return code;
	}

	private static final Map<String, XSDErrorCode> codes;

	static {
		codes = new HashMap<>();
		for (XSDErrorCode errorCode : values()) {
			codes.put(errorCode.getCode(), errorCode);
		}
	}

	public static XSDErrorCode get(String name) {
		return codes.get(name);
	}

	/**
	 * Create the LSP range from the SAX error.
	 * 
	 * @param location location
	 * @param code code
	 * @param arguments arguments
	 * @param document documents
	 * @return the LSP range from the SAX error.
	 */
	public static Range toLSPRange(XMLLocator location, XSDErrorCode code, Object[] arguments, DOMDocument document) {
		int offset = location.getCharacterOffset() - 1;
		// adjust positions
		switch (code) {
		case S4S_ELT_INVALID_CONTENT_1:
		case S4S_ELT_MUST_MATCH_1:
		case S4S_ATT_MUST_APPEAR:
		case S4S_ELT_INVALID_CONTENT_2:
			return XMLPositionUtility.selectStartTag(offset, document);
		case S4S_ATT_NOT_ALLOWED:
			return XMLPositionUtility.selectAttributeNameAt(offset, document);
		case S4S_ATT_INVALID_VALUE:
			return XMLPositionUtility.selectAttributeValueAt("", offset, document);
		case S4S_ELT_CHARACTER:
			return XMLPositionUtility.selectContent(offset, document);
		case SRC_RESOLVE_4_2:
		case SRC_RESOLVE:
			String attrValue = (String) arguments[2];
			return XMLPositionUtility.selectAttributeValueByGivenValueAt(attrValue, offset, document);
		}
		return null;
	}
}
