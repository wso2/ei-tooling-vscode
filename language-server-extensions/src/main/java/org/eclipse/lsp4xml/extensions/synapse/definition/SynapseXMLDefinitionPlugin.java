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

package org.eclipse.lsp4xml.extensions.synapse.definition;

import org.eclipse.lsp4j.InitializeParams;
import org.eclipse.lsp4j.WorkspaceFolder;
import org.eclipse.lsp4xml.commons.WorkspaceFolders;
import org.eclipse.lsp4xml.extensions.synapse.definition.pariticipants.SynapseReferencesDefinitionParticipant;
import org.eclipse.lsp4xml.services.extensions.IDefinitionParticipant;
import org.eclipse.lsp4xml.services.extensions.IXMLExtension;
import org.eclipse.lsp4xml.services.extensions.XMLExtensionsRegistry;
import org.eclipse.lsp4xml.services.extensions.save.ISaveContext;

import java.util.List;


public class SynapseXMLDefinitionPlugin implements IXMLExtension {

    private final IDefinitionParticipant definitionParticipant;
    private WorkspaceFolders workspaceFolders;

    public SynapseXMLDefinitionPlugin() {
        definitionParticipant = new SynapseReferencesDefinitionParticipant();
        workspaceFolders = WorkspaceFolders.getInstance();
    }

    @Override
    public void start(InitializeParams params, XMLExtensionsRegistry registry) {
        registry.registerDefinitionParticipant(definitionParticipant);

        List<WorkspaceFolder> workspaceFolderList = params.getWorkspaceFolders();
        for (int i = 0; i < workspaceFolderList.size(); i++) {
            workspaceFolders.addWorkspaceFolder(workspaceFolderList.get(i));
        }
    }

    @Override
    public void stop(XMLExtensionsRegistry registry) {
        registry.unregisterDefinitionParticipant(definitionParticipant);
    }

    @Override
    public void doSave(ISaveContext context) {

    }
}
