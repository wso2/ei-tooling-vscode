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

import {commands, ExtensionContext, RelativePattern, TextDocument, Uri, window, workspace} from 'vscode';
import {changeLanguageToSynapse, setLanguageToSynapse} from './language';
import {launch as launchServer} from './server';
import {ArchetypeModule} from "./archetype/ArchetypeModule";
import {DataServiceModule } from './dataService/DataServiceModule';
import { MediatorProjectModule } from './mediatorProject/MediatorProjectModule';
import { ConnectorModule } from './connector/ConnectorModule';
import {createArtifact, createESBProject, createCompositeProject, createRegistryResourcesProject} from "./artifacts/artifactResolver";
import {createDataServiceProject, createNewDataService} from "./dataService/dataServiceResolver";
import {createMediatorProject} from './mediatorProject/mediatorProjectResolver';
import { addNewConnector, addNewConnectorExporter } from './connector/connectorResolver';
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
    TaskArtifactInfo,
    TemplateArtifactInfo
} from "./artifacts/artifactUtils";

import {createDeployableArchive, createZipArchive, unzipArchive, createProjectFromCar} from "./archive/archiveResolver";
import {ArtifactModule} from "./artifacts/ArtifactModule";
import {SYNAPSE_LANGUAGE_ID, } from './language/languageUtils';
import * as path from 'path';

export let serverLaunched: boolean = false;
let fileWatcherCreated: boolean = false;
const chokidar = require('chokidar');


export function activate(context: ExtensionContext) {

    // register commands
    registerSynapseCommands(context);

    //check currently active text editor
    if (window.activeTextEditor) {
        const currentDoc = window.activeTextEditor.document;
        setLanguageAndLaunchServer(currentDoc);
        createDirectoryWatcher();
        createFileWatcher();

    }

    //listen to newly opened text documents
    workspace.onDidOpenTextDocument((document) => {
        setLanguageAndLaunchServer(document);
        createDirectoryWatcher();
        createFileWatcher();
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

    function createDirectoryWatcher() {

        if (workspace.workspaceFolders && !fileWatcherCreated) {
            //let uri = workspace.workspaceFolders[0].uri;
            // initialization code...
            let watcher = workspace.createFileSystemWatcher(
                new RelativePattern(
                    workspace.workspaceFolders[0],
                    '**/*'
                ),
                true,
                false,
                false
            );
            fileWatcherCreated = true;

            watcher.onDidChange((changedFile: Uri) => {
               
                if (workspace.workspaceFolders) {
                    //update metadata.yaml for API
                    const directoryPattern: string = path.join("src", "main", "synapse-config", "api");
                    
                    //check whether an api resource file is changed
                    if(isExistDirectoryPattern(changedFile.fsPath, directoryPattern)){
                        const esbConfigsDirectory: string = changedFile.fsPath.split(directoryPattern)[0];
                        ArtifactModule.updateMetadataforApi(esbConfigsDirectory, changedFile.fsPath);
                    }

                }
            });
            watcher.onDidDelete((deletedFile: Uri) => {
                DataServiceModule.safeDeteteProject(deletedFile.path);
            });       
        }
    }

    function createFileWatcher(){
        if(workspace.workspaceFolders){
            let rootDirectory: string = workspace.workspaceFolders[0].uri.fsPath;
            chokidar.watch(rootDirectory).on('unlink', (path: string) => {
                ArtifactModule.safeDeleteArtifact(path);
                DataServiceModule.safeDeleteDataService(path, rootDirectory);
                ConnectorModule.safeDeleteConnector(path, rootDirectory);
                MediatorProjectModule.safeDeleteMediatorProjectDetails(path, rootDirectory);
            });
    }
    }

    function isExistDirectoryPattern(filePath: string, dirPattern: string): boolean {
        let regExpForDirPattern = new RegExp(dirPattern);
        return regExpForDirPattern.test(filePath);
    }
}

function registerSynapseCommands(context: ExtensionContext) {
    context.subscriptions.push(commands.registerCommand("wso2ei.extension.activate", async () => {
        window.showInformationMessage('Synapse Extension activated!');
    }));

    context.subscriptions.push(commands.registerTextEditorCommand('wso2ei.language.change',
                                                                  (editor, edit) => {
                                                                      if (!setLanguageToSynapse(editor.document)) {
                                                                          changeLanguageToSynapse(editor, edit, context, __dirname);
                                                                      }
                                                                  }));

    context.subscriptions.push(commands.registerCommand("wso2ei.project.create", async () => {
        await ArchetypeModule.createESBProject();
    }));
    context.subscriptions.push(commands.registerCommand("wso2ei.project.build", async () => {
        createDeployableArchive();
    }));
    context.subscriptions.push(commands.registerCommand("wso2ei.project.create.esb", async () => {
        await createESBProject();
    }));
    context.subscriptions.push(commands.registerCommand("wso2ei.project.create.composite", async () => {
        await createCompositeProject();
    }));
    context.subscriptions.push(commands.registerCommand("wso2ei.project.create.registry", async () => {
        await createRegistryResourcesProject();
    }));
    context.subscriptions.push(commands.registerCommand("wso2ei.project.import", async () => {
        ArchetypeModule.importProject();
    }));
    context.subscriptions.push(commands.registerCommand("wso2ei.project.zip", async () => {
        createZipArchive();
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.project.unzip", async () => {
        unzipArchive();
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.api", async (Uri: Uri) => {
        await createArtifact(APIArtifactInfo.ARTIFACT_TYPE, Uri.fsPath);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.proxy", async (Uri: Uri) => {
        await createArtifact(ProxyArtifactInfo.ARTIFACT_TYPE, Uri.fsPath);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.endpoint", async (Uri: Uri) => {
        await createArtifact(EndpointArtifactInfo.ARTIFACT_TYPE, Uri.fsPath);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.inboundEndpoint",
                                                        async (Uri: Uri) => {
                                                            await createArtifact(InboundEndpointArtifactInfo.ARTIFACT_TYPE, Uri.fsPath);
                                                        }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.localEntry", async (Uri: Uri) => {
        await createArtifact(LocalEntryArtifactInfo.ARTIFACT_TYPE, Uri.fsPath);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.messageStore", async (Uri: Uri) => {
        await createArtifact(MessageStoreArtifactInfo.ARTIFACT_TYPE, Uri.fsPath);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.messageProcessor",
                                                        async (Uri: Uri) => {
                                                            await createArtifact(MessageProcessorArtifactInfo.ARTIFACT_TYPE, Uri.fsPath);
                                                        }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.template", async (Uri: Uri) => {
        await createArtifact(TemplateArtifactInfo.ARTIFACT_TYPE, Uri.fsPath);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.sequence", async (Uri: Uri) => {
        await createArtifact(SequenceArtifactInfo.ARTIFACT_TYPE, Uri.fsPath);
    }));

    context.subscriptions.push(commands.registerCommand("wso2ei.artifact.task", async (Uri: Uri) => {
        await createArtifact(TaskArtifactInfo.ARTIFACT_TYPE, Uri.fsPath);
    }));
    context.subscriptions.push(commands.registerCommand("wso2ei.resource.registry", async () => {
        await createArtifact(RegistryResourceInfo.ARTIFACT_TYPE, undefined);
    }));
    context.subscriptions.push(commands.registerCommand("wso2ei.dataservice.create.project", async () => {
        await createDataServiceProject();
    }));
    context.subscriptions.push(commands.registerCommand("wso2ei.dataservice.create.service", async (uri: Uri) => {
        await createNewDataService(uri.fsPath);
    }));
    context.subscriptions.push(commands.registerCommand("wso2ei.mediatorproject.create.project", async () => {
        await createMediatorProject();
    }));
    context.subscriptions.push(commands.registerCommand("wso2ei.connector.add", async () => {
        await addNewConnector();
    }));
    context.subscriptions.push(commands.registerCommand("wso2ei.connector.create.project", async () => {
        await addNewConnectorExporter();
    }));
    context.subscriptions.push(commands.registerCommand("wso2ei.car.create.zip", async () => {
        await createProjectFromCar();
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
}
