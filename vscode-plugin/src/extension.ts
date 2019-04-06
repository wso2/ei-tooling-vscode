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

import * as vscode from 'vscode';
import { setLanguageToSynapse as setLanguageToSynapse, registerCommandToChangeLanguageToSyanpse} from './language';
import { launch as launchServer } from './server';
import { ArchetypeModule } from "./archetype/ArchetypeModule";
import { createArtifact } from "./artifacts/artifactResolver";
import { APIArtifactInfo, ProxyArtifactInfo, EndpointArtifactInfo, InboundEndpointArtifactInfo } from "./artifacts/artifactUtils";


export function activate(context: vscode.ExtensionContext) {

	// register commands
	registerSynapseCommands(context);

	//launch server
	launchServer(context, __dirname);

	//registering command to forcefully change the editing mode to synapse
	registerCommandToChangeLanguageToSyanpse(context);

	//check currently active text editor
	if (vscode.window.activeTextEditor) {
		const currentDoc = vscode.window.activeTextEditor.document;
		setLanguageToSynapse(currentDoc);
	}

	//listen to changing event of the active text editor
	vscode.window.onDidChangeActiveTextEditor(editor => {
		if(editor) {
			setLanguageToSynapse(editor.document);
		}
	});
	
	//listen to newly opened text documents
	vscode.workspace.onDidOpenTextDocument((document)=>{
		setLanguageToSynapse(document);
	});	
}

// this method is called when your extension is deactivated
export function deactivate() {}

function registerSynapseCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand("extension.activateExtension", async () => {
		
	}));

	context.subscriptions.push(vscode.commands.registerCommand("wso2esb.project.create", async () => {
		await ArchetypeModule.createESBProject();
	}));

	context.subscriptions.push(vscode.commands.registerCommand("wso2esb.artifact.api", async () => {
        await createArtifact(APIArtifactInfo.ARTIFACT_TYPE);
	}));

	context.subscriptions.push(vscode.commands.registerCommand("wso2esb.artifact.proxy", async () => {
		await createArtifact(ProxyArtifactInfo.ARTIFACT_TYPE);
	}));

	context.subscriptions.push(vscode.commands.registerCommand("wso2esb.artifact.endpoint", async () => {
		await createArtifact(EndpointArtifactInfo.ARTIFACT_TYPE);
	}));

	context.subscriptions.push(vscode.commands.registerCommand("wso2esb.artifact.inboundEndpoint", async () => {
		await createArtifact(InboundEndpointArtifactInfo.ARTIFACT_TYPE);
	}));
}







