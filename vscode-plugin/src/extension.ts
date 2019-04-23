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

import {window, workspace, commands, ExtensionContext} from 'vscode';
import {changeLanguageToSynapse, setLanguageToSynapse} from './language';
import {launch as launchServer} from './server';
import {ArchetypeModule} from "./archetype/ArchetypeModule";
import {createArtifact} from "./artifacts/artifactResolver";
import {
    APIArtifactInfo,
    EndpointArtifactInfo,
    InboundEndpointArtifactInfo,
    LocalEntryArtifactInfo,
    MessageProcessorArtifactInfo,
    MessageStoreArtifactInfo,
    ProxyArtifactInfo,
    RegistryResourceInfo,
    SequenceArtifactInfo,
    TemplateArtifactInfo
} from "./artifacts/artifactUtils";

import {createCApp} from "./archive/archiveResolver";

export function activate(context: ExtensionContext) {

    // register commands
    registerSynapseCommands(context);

    //launch server
    launchServer(context, __dirname);

    //check currently active text editor
    if (window.activeTextEditor) {
        const currentDoc = window.activeTextEditor.document;
        setLanguageToSynapse(currentDoc);
    }

    //listen to changing event of the active text editor
    window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            setLanguageToSynapse(editor.document);
        }
    });

    //listen to newly opened text documents
    workspace.onDidOpenTextDocument((document) => {
        setLanguageToSynapse(document);
    });
}

function registerSynapseCommands(context: ExtensionContext) {
    context.subscriptions.push(commands.registerCommand("extension.activateExtension", async () => {

    }));

    context.subscriptions.push(commands.registerTextEditorCommand('extension.changeLanguage', (editor, edit) => {
        if (!setLanguageToSynapse(editor.document)) {
            changeLanguageToSynapse(editor, edit);
        }
    }));

    context.subscriptions.push(commands.registerCommand("wso2esb.project.create", async () => {
        await ArchetypeModule.createESBProject();
    }));

    context.subscriptions.push(commands.registerCommand("wso2esb.project.build", async () => {
        await createCApp();
    }));

    context.subscriptions.push(commands.registerCommand("wso2esb.artifact.api", async () => {
        await createArtifact(APIArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2esb.artifact.proxy", async () => {
        await createArtifact(ProxyArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2esb.artifact.endpoint", async () => {
        await createArtifact(EndpointArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2esb.artifact.inboundEndpoint", async () => {
        await createArtifact(InboundEndpointArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2esb.artifact.localEntry", async () => {
        await createArtifact(LocalEntryArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2esb.artifact.messageStore", async () => {
        await createArtifact(MessageStoreArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2esb.artifact.messageProcessor", async () => {
        await createArtifact(MessageProcessorArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2esb.artifact.template", async () => {
        await createArtifact(TemplateArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2esb.artifact.sequence", async () => {
        await createArtifact(SequenceArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2esb.resource.registry", async () => {
        await createArtifact(RegistryResourceInfo.ARTIFACT_TYPE);
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
}






