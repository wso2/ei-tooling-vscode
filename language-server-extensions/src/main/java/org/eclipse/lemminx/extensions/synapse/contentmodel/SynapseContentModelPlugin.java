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

package org.eclipse.lemminx.extensions.synapse.contentmodel;

import org.eclipse.lemminx.XMLTextDocumentService;
import org.eclipse.lemminx.dom.DOMDocument;
import org.eclipse.lemminx.extensions.contentmodel.model.ContentModelManager;
import org.eclipse.lemminx.extensions.contentmodel.settings.ContentModelSettings;
import org.eclipse.lemminx.extensions.contentmodel.settings.XMLDownloadExternalResourcesSettings;
import org.eclipse.lemminx.extensions.contentmodel.settings.XMLValidationSettings;
import org.eclipse.lemminx.extensions.synapse.contentmodel.model.SynapseContentModelManager;
import org.eclipse.lemminx.extensions.synapse.contentmodel.participants.SynapseContentModelCompletionParticipant;
import org.eclipse.lemminx.extensions.synapse.contentmodel.participants.SynapseContentModelHoverParticipant;
import org.eclipse.lemminx.extensions.synapse.contentmodel.participants.diagnostics.SynapseContentModelDiagnosticsParticipant;
import org.eclipse.lemminx.extensions.xsd.XSDURIResolverExtension;
import org.eclipse.lemminx.services.extensions.completion.ICompletionParticipant;
import org.eclipse.lemminx.services.extensions.IHoverParticipant;
import org.eclipse.lemminx.services.extensions.IXMLExtension;
import org.eclipse.lemminx.services.extensions.XMLExtensionsRegistry;
import org.eclipse.lemminx.services.extensions.save.ISaveContext;
import org.eclipse.lemminx.uriresolver.URIResolverExtensionManager;
import org.eclipse.lemminx.utils.DOMUtils;
import org.eclipse.lsp4j.InitializeParams;

import java.util.Objects;

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

    private final IHoverParticipant hoverParticipant;

    private SynapseContentModelManager synapseContentModelManager;

    private ContentModelSettings cmSettings;

    private XSDURIResolverExtension uiResolver;

    private XMLValidationSettings currentValidationSettings;

    public SynapseContentModelPlugin() {
        completionParticipant = new SynapseContentModelCompletionParticipant();
        diagnosticsParticipant = new SynapseContentModelDiagnosticsParticipant(this);
        hoverParticipant = new SynapseContentModelHoverParticipant();
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
        } else {
            currentValidationSettings = null;
        }
    }

    private void updateSettings(ContentModelSettings settings, ISaveContext context) {
        if (settings.getCatalogs() != null) {
            // Update XML catalog settings
            boolean catalogPathsChanged = synapseContentModelManager.setCatalogs(settings.getCatalogs());
            if (catalogPathsChanged) {
                // Validate all opened XML files
                validateAllOpenedDocument(context);
                if (context instanceof XMLTextDocumentService.SaveContext) {
                    ((XMLTextDocumentService.SaveContext) context).setRefreshCodeLenses(true);
                }
            }
        }
        if (settings.getFileAssociations() != null) {
            // Update XML file associations
            boolean fileAssociationsChanged = synapseContentModelManager.setFileAssociations(settings.getFileAssociations());
            if (fileAssociationsChanged) {
                // Validate all opened XML files
                validateAllOpenedDocument(context);
            }
        }
        // Update use cache, only if it is set in the settings.
        Boolean useCache = settings.isUseCache();
        if (useCache != null) {
            synapseContentModelManager.setUseCache(useCache);
        }

        // Download external resources
        XMLDownloadExternalResourcesSettings downloadExternalResources = settings.getDownloadExternalResources();
        boolean downloadExternalResourcesEnabled = downloadExternalResources == null
                || downloadExternalResources.isEnabled();
        if (synapseContentModelManager.isDownloadExternalResources() != downloadExternalResourcesEnabled) {
            synapseContentModelManager.setDownloadExternalResources(downloadExternalResourcesEnabled);
            // Validate all opened XML files
            validateAllOpenedDocument(context);
        }

//        // Update symbols
//        boolean showReferencedGrammars = settings.isShowReferencedGrammars();
//        symbolsProviderParticipant.setEnabled(showReferencedGrammars);
        // Track if validation settings has changed
        XMLValidationSettings oldValidationSettings = currentValidationSettings;
        currentValidationSettings = cmSettings.getValidation();
        if (oldValidationSettings != null && !Objects.equals(oldValidationSettings, currentValidationSettings)) {
            context.collectDocumentToValidate(d -> true);
        }
        if (currentValidationSettings != null) {
            synapseContentModelManager.setResolveExternalEntities(currentValidationSettings.isResolveExternalEntities());
        }
    }

    private void validateAllOpenedDocument(ISaveContext context) {
        // Validate all opened XML files
        context.collectDocumentToValidate(d -> {
            DOMDocument xml = context.getDocument(d.getDocumentURI());
            if (xml == null) {
                return false;
            }
            xml.resetGrammar();
            return true;
        });
    }

    @Override
    public void start(InitializeParams params, XMLExtensionsRegistry registry) {
        URIResolverExtensionManager resolverManager = registry.getComponent(URIResolverExtensionManager.class);
        synapseContentModelManager = new SynapseContentModelManager(resolverManager);
        registry.registerComponent(synapseContentModelManager);
        if (params != null) {
            synapseContentModelManager.setRootURI(params.getRootUri());
        }
        registry.registerCompletionParticipant(completionParticipant);
        registry.registerDiagnosticsParticipant(diagnosticsParticipant);
        registry.registerHoverParticipant(hoverParticipant);
    }

    @Override
    public void stop(XMLExtensionsRegistry registry) {
        registry.unregisterCompletionParticipant(completionParticipant);
        registry.unregisterDiagnosticsParticipant(diagnosticsParticipant);
        registry.unregisterHoverParticipant(hoverParticipant);
    }

    /**
     * Returns content model settings.
     *
     * @return content model settings.
     */
    public ContentModelSettings getContentModelSettings() {
        return cmSettings;
    }

    public SynapseContentModelManager getContentModelManager() {
        return synapseContentModelManager;
    }
}
