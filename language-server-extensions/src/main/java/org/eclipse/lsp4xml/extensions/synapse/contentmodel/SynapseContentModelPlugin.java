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

package org.eclipse.lsp4xml.extensions.synapse.contentmodel;

import org.eclipse.lsp4j.InitializeParams;
import org.eclipse.lsp4xml.dom.DOMDocument;
import org.eclipse.lsp4xml.extensions.contentmodel.settings.ContentModelSettings;
import org.eclipse.lsp4xml.extensions.synapse.contentmodel.model.SynapseContentModelManager;
import org.eclipse.lsp4xml.extensions.synapse.contentmodel.participants.SynapseContentModelCompletionParticipant;
import org.eclipse.lsp4xml.extensions.synapse.contentmodel.participants.diagnostics.SynapseContentModelDiagnosticsParticipant;
import org.eclipse.lsp4xml.services.extensions.ICompletionParticipant;
import org.eclipse.lsp4xml.services.extensions.IXMLExtension;
import org.eclipse.lsp4xml.services.extensions.XMLExtensionsRegistry;
import org.eclipse.lsp4xml.services.extensions.save.ISaveContext;
import org.eclipse.lsp4xml.utils.DOMUtils;


/**
 * Content model plugin extension to provide.
 *
 * <ul>
 * <li>completion based on XML Schema, DTD...</li>
 * <li>hover based on XML Schema</li>
 * <li>diagnostics based on on XML Schema, DTD...</li>
 * </ul>
 */
public class SynapseContentModelPlugin implements IXMLExtension {

    private final ICompletionParticipant completionParticipant;

    private final SynapseContentModelDiagnosticsParticipant diagnosticsParticipant;

    private SynapseContentModelManager synapseContentModelManager;

    private ContentModelSettings cmSettings;

    public SynapseContentModelPlugin() {
        completionParticipant = new SynapseContentModelCompletionParticipant();
        diagnosticsParticipant = new SynapseContentModelDiagnosticsParticipant(this);
    }

    @Override
    public void doSave(ISaveContext context) {
        if (context.getType() == ISaveContext.SaveContextType.DOCUMENT) {
            // The save is done for a given XML file
            String documentURI = context.getUri();
            DOMDocument document = context.getDocument(documentURI);
            if (DOMUtils.isCatalog(document)) {
                // the XML document which has changed is a XML catalog.
                // 1) refresh catalogs
                synapseContentModelManager.refreshCatalogs();
                // 2) Validate all opened XML files except the catalog which have changed
                context.collectDocumentToValidate(d -> {
                    DOMDocument xml = context.getDocument(d.getDocumentURI());
                    xml.resetGrammar();
                    return !documentURI.equals(d.getDocumentURI());
                });
            }
        } else {
            // Settings
            updateSettings(context);
        }
    }

    private void updateSettings(ISaveContext saveContext) {
        Object initializationOptionsSettings = saveContext.getSettings();
        cmSettings = ContentModelSettings.getContentModelXMLSettings(initializationOptionsSettings);
        if (cmSettings != null) {
            updateSettings(cmSettings, saveContext);
        }
    }

    private void updateSettings(ContentModelSettings settings, ISaveContext context) {
        if (settings.getCatalogs() != null) {
            // Update XML catalog settings
            boolean catalogPathsChanged = synapseContentModelManager.setCatalogs(settings.getCatalogs());
            if (catalogPathsChanged) {
                // Validate all opened XML files
                context.collectDocumentToValidate(d -> {
                    DOMDocument xml = context.getDocument(d.getDocumentURI());
                    xml.resetGrammar();
                    return true;
                });
            }
        }
        if (settings.getFileAssociations() != null) {
            // Update XML file associations
            boolean fileAssociationsChanged = synapseContentModelManager
                    .setFileAssociations(settings.getFileAssociations());
            if (fileAssociationsChanged) {
                // Validate all opened XML files
                context.collectDocumentToValidate(d -> {
                    DOMDocument xml = context.getDocument(d.getDocumentURI());
                    xml.resetGrammar();
                    return true;
                });
            }
        }
        // Update use cache, only if it is set in the settings.
        Boolean useCache = settings.isUseCache();
        if (useCache != null) {
            synapseContentModelManager.setUseCache(useCache);
        }
    }

    @Override
    public void start(InitializeParams params, XMLExtensionsRegistry registry) {
        synapseContentModelManager = new SynapseContentModelManager();
        registry.registerComponent(synapseContentModelManager);
        if (params != null) {
            synapseContentModelManager.setRootURI(params.getRootUri());
        }
        registry.registerCompletionParticipant(completionParticipant);
        registry.registerDiagnosticsParticipant(diagnosticsParticipant);
    }

    @Override
    public void stop(XMLExtensionsRegistry registry) {
        registry.unregisterCompletionParticipant(completionParticipant);
        registry.unregisterDiagnosticsParticipant(diagnosticsParticipant);
    }

    public ContentModelSettings getContentModelSettings() {
        return cmSettings;
    }
}
