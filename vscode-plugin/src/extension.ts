import * as vscode from 'vscode';
import { setLanguageToSynapse as setLanguageToSynapse, registerCommandToChangeLanguageToSyanpse} from './language';
import { launch as launchServer } from './server';
import { Uri} from "vscode";
import { ArchetypeModule } from "./archetype/ArchetypeModule";
import { ArtifactModule } from "./artifacts/ArtifactModule";
import { createArtifact } from "./artifacts/artifactResolver";


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

	context.subscriptions.push(vscode.commands.registerCommand("wso2esb.project.create", async (entry: Uri | undefined) => {
		await ArchetypeModule.createESBProject(entry);
	}));

	context.subscriptions.push(vscode.commands.registerCommand("wso2esb.artifact.api", async () => {
        await createArtifact("api");
	}));

	context.subscriptions.push(vscode.commands.registerCommand("wso2esb.artifact.proxy", async () => {
		await createArtifact("proxy");
	}));
}

function checkSynapseWorkspace() {
	if(vscode.workspace.workspaceFolders) {
		const noOfWorkspaceFolders: number = vscode.workspace.workspaceFolders.length;

		let index = 0;
		while(index < noOfWorkspaceFolders) {
			let workspaceFolder = vscode.workspace.workspaceFolders[index];
			let path1 = workspaceFolder.uri.path + "/src/main/synapse-config";
			let path2 = workspaceFolder.uri.path + "/synapse-config";

			ArtifactModule.checkPathExistence(path1).then(result => {
				if(result) {
					//proceed
				}else {
					
					ArtifactModule.checkPathExistence(path2).then(result => {
						if(result) {
							//proceed
						}else {
							vscode.window.showErrorMessage("Please open a Synapse Project!");
						}
					});
				}
			});
			
			index++;
		}
	}
}






