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

import org.apache.xerces.xni.parser.XMLEntityResolver;
import org.eclipse.lsp4j.Diagnostic;
import org.eclipse.lsp4j.jsonrpc.CancelChecker;
import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.extensions.synapse.contentmodel.SynapseContentModelPlugin;
import org.eclipse.lsp4xml.extensions.contentmodel.participants.diagnostics.XMLValidator;
import org.eclipse.lsp4xml.services.extensions.diagnostics.IDiagnosticsParticipant;

import java.util.List;

/**
 * Validate XML files with Xerces for general SYNTAX validation and XML Schema, DTD.
 *
 */
public class SynapseContentModelDiagnosticsParticipant implements IDiagnosticsParticipant {

	private final SynapseContentModelPlugin synapseContentModelPlugin;

	public SynapseContentModelDiagnosticsParticipant(SynapseContentModelPlugin synapseContentModelPlugin) {
		this.synapseContentModelPlugin = synapseContentModelPlugin;
	}

	@Override
	public void doDiagnostics(DOMDocument xmlDocument, List<Diagnostic> diagnostics, CancelChecker monitor) {
		if (xmlDocument.isDTD()) {
			// Don't validate DTD with XML validator
			return;
		}
		// Get entity resolver (XML catalog resolver, XML schema from the file
		// associations settings., ...)
		XMLEntityResolver entityResolver = xmlDocument.getResolverExtensionManager();
		// Process validation
		SynapseXMLValidator.doDiagnostics(xmlDocument, entityResolver, diagnostics,
				synapseContentModelPlugin.getContentModelSettings(), monitor);
	}

}
