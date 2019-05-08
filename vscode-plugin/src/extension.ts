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

import {commands, ExtensionContext, Uri, window, workspace, RelativePattern, TextDocument} from 'vscode';
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
    SequenceArtifactInfo, TaskArtifactInfo,
    TemplateArtifactInfo
} from "./artifacts/artifactUtils";

import {createDeployableArchive} from "./archive/archiveResolver";
import {ArtifactModule} from "./artifacts/ArtifactModule";
import { SYNAPSE_LANGUAGE_ID } from './language/languageUtils';

let serverLaunched: boolean = false;
let fileWatcherCreated: boolean = false;

export function activate(context: ExtensionContext) {

    // register commands
    registerSynapseCommands(context);

    //check currently active text editor
    if (window.activeTextEditor) {
        const currentDoc = window.activeTextEditor.document;
        setLanguageAndLaunchServer(currentDoc);
        createFileWatcher();
    }

    //listen to changing event of the active text editor
    window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            setLanguageAndLaunchServer(editor.document);
        }
    });

    //listen to newly opened text documents
    workspace.onDidOpenTextDocument((document) => {
        setLanguageAndLaunchServer(document);
    });

    function setLanguageAndLaunchServer(document: TextDocument) {
        let setLanguage: boolean = false;
        if (document.languageId !== SYNAPSE_LANGUAGE_ID) {
            setLanguage = setLanguageToSynapse(document);
        }
        if (setLanguage && !serverLaunched) {
            //launch server
            serverLaunched = true;
            launchServer(context, __dirname);
        }
    }

    function createFileWatcher() {
        if (workspace.workspaceFolders && !fileWatcherCreated) {
            const uri = workspace.workspaceFolders[0].uri;
            // initialization code...
            let watcher = workspace.createFileSystemWatcher(
                new RelativePattern(
                    workspace.getWorkspaceFolder(uri)!,
                    '**/*.{xml,dmc}'
                ),
                true,
                true,
                false
            );
            fileWatcherCreated = true;
            watcher.onDidDelete((deletedFile: Uri) => {
                ArtifactModule.safeDeleteArtifact(deletedFile);
            });
        }
    }
}

function registerSynapseCommands(context: ExtensionContext) {
    context.subscriptions.push(commands.registerCommand("wso2ei.extension.activate", async () => {
        window.showInformationMessage('Synapse Extension activated!');
    }));

    context.subscriptions.push(commands.registerTextEditorCommand('wso2ei.language.change',
                                                                  (editor, edit) => {
        if (!setLanguageToSynapse(editor.document)) {
            changeLanguageToSynapse(editor, edit);
        }
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.project.create", async () => {
        await ArchetypeModule.createESBProject();
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.project.build", async () => {
        createDeployableArchive();
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.api", async () => {
        await createArtifact(APIArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.proxy", async () => {
        await createArtifact(ProxyArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.endpoint", async () => {
        await createArtifact(EndpointArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.inboundEndpoint",
                                                        async () => {
        await createArtifact(InboundEndpointArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.localEntry", async () => {
        await createArtifact(LocalEntryArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.messageStore", async () => {
        await createArtifact(MessageStoreArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.messageProcessor",
                                                        async () => {
        await createArtifact(MessageProcessorArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.template", async () => {
        await createArtifact(TemplateArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.sequence", async () => {
        await createArtifact(SequenceArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.task", async () => {
        await createArtifact(TaskArtifactInfo.ARTIFACT_TYPE);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.resource.registry", async () => {
        await createArtifact(RegistryResourceInfo.ARTIFACT_TYPE);
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
}
