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

package org.eclipse.lemminx.extensions.synapse.definition;

import org.eclipse.lemminx.commons.WorkspaceFolders;
import org.eclipse.lemminx.dom.DOMDocument;
import org.eclipse.lemminx.extensions.references.settings.XMLReferencesSettings;
import org.eclipse.lemminx.extensions.synapse.definition.pariticipants.SynapseReferencesDefinitionParticipant;
import org.eclipse.lemminx.services.extensions.IDefinitionParticipant;
import org.eclipse.lemminx.services.extensions.IXMLExtension;
import org.eclipse.lemminx.services.extensions.XMLExtensionsRegistry;
import org.eclipse.lemminx.services.extensions.save.ISaveContext;
import org.eclipse.lemminx.utils.DOMUtils;
import org.eclipse.lsp4j.InitializeParams;
import org.eclipse.lsp4j.WorkspaceFolder;

import java.util.List;

/**
 * Definition model plugin extension to provide.
 *
 * <ul>
 * <li>gotoDefinition based on pre-defined reference key set for Synapse XML...</li>
 * </ul>
 */
public class SynapseXMLDefinitionPlugin implements IXMLExtension {

    private final IDefinitionParticipant definitionParticipant;
    private WorkspaceFolders workspaceFolders;

    private XMLReferencesSettings referencesSettings;

    public SynapseXMLDefinitionPlugin() {
        definitionParticipant = new SynapseReferencesDefinitionParticipant(this);
        workspaceFolders = WorkspaceFolders.getInstance();
    }

    @Override
    public void start(InitializeParams params, XMLExtensionsRegistry registry) {
        registry.registerDefinitionParticipant(definitionParticipant);

        List<WorkspaceFolder> workspaceFolderList = params.getWorkspaceFolders();
        for (WorkspaceFolder workspaceFolder : workspaceFolderList) {
            workspaceFolders.addWorkspaceFolder(workspaceFolder);
        }
    }

    @Override
    public void stop(XMLExtensionsRegistry registry) {
        registry.unregisterDefinitionParticipant(definitionParticipant);
    }

//    @Override
//    public void doSave(ISaveContext context) {
//        String documentURI = context.getUri();
//        DOMDocument document = context.getDocument(documentURI);
//        if (DOMUtils.isXSD(document)) {
//            context.collectDocumentToValidate(d -> {
//                DOMDocument xml = context.getDocument(d.getDocumentURI());
//                return xml.usesSchema(context.getUri());
//            });
//        }
//    }

    @Override
    public void doSave(ISaveContext context) {
        if (context.getType() != ISaveContext.SaveContextType.DOCUMENT) {
            // Settings
            updateSettings(context);
        }
    }

    private void updateSettings(ISaveContext saveContext) {
        Object initializationOptionsSettings = saveContext.getSettings();
        XMLReferencesSettings referencesSettings = XMLReferencesSettings
                .getXMLReferencesSettings(initializationOptionsSettings);
        updateSettings(referencesSettings, saveContext);
    }

    private void updateSettings(XMLReferencesSettings settings, ISaveContext context) {
        this.referencesSettings = settings;
    }

    public XMLReferencesSettings getReferencesSettings() {
        return referencesSettings;
    }
}
