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

package org.eclipse.lsp4xml.extensions.synapse.contentmodel.participants.diagnostics;

import org.apache.xerces.xni.parser.XMLEntityResolver;
import org.eclipse.lsp4j.Diagnostic;
import org.eclipse.lsp4j.jsonrpc.CancelChecker;
import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.extensions.synapse.contentmodel.SynapseContentModelPlugin;
import org.eclipse.lsp4xml.extensions.synapse.contentmodel.utils.SynapseDiagnosticException;
import org.eclipse.lsp4xml.services.extensions.diagnostics.IDiagnosticsParticipant;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Validate XML files with Xerces for general SYNTAX validation and XML Schema, DTD.
 */
public class SynapseContentModelDiagnosticsParticipant implements IDiagnosticsParticipant {

    private static final Logger LOGGER = Logger.getLogger(SynapseContentModelDiagnosticsParticipant.class.getName());

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
        try {
            SynapseXMLValidator.validate(xmlDocument, entityResolver, diagnostics,
                    synapseContentModelPlugin.getContentModelSettings(), monitor);
        } catch (SynapseDiagnosticException e) {
            LOGGER.log(Level.SEVERE, "Diagnostics failed due to validation error", e);
        }
    }

}
