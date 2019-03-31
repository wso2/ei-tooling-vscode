import * as vscode from 'vscode';
import { setLanguageToSynapse as setLanguageToSynapse, registerCommandToChangeLanguageToSyanpse} from './language';
import { launch as launchServer } from './server';
import { Uri} from "vscode";
import { ArchetypeModule } from "./archetype/ArchetypeModule";
import { createArtifact } from "./artifacts/apiArtifact/artifactResolver";


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

// const exec = require('child_process').exec; 


function registerSynapseCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand("wso2esb.project.create", async (entry: Uri | undefined) => {
		await ArchetypeModule.createESBProject(entry);

		// fse.writeFile('/Users/sajinieranasinghe/Documents/WebBasedEIToolingVSCodeExtension/vscode-synapse-parent/vscode-synapse/vscode-plugin/test.sh', "echo 'hello sajinie';\necho 'hi menu';");

		// let testRunner: newRunner = new newRunner();
		// testRunner.runCommand("cd /Users/sajinieranasinghe/deleteThis; ls", []);
		// let args = ["archetype:generate", '-DarchetypeArtifactId=wso2ei-tooling', '-DarchetypeGroupId=wso2ei.vscode.tooling', '-DgroupId=com.example.jsd', '-DartifactId=budfgcssdies', '-DnewVersion=ds', "-DinteractiveMode=false"];
		// testRunner.runCommand("mvn", args);
		// testRunner.runCommand("ls", []);

		// let cmd = "cd /Users/sajinieranasinghe/deleteThis && mvn archetype:generate -DarchetypeArtifactId=wso2ei-tooling -DarchetypeGroupId=wso2ei.vscode.tooling -DgroupId=com.example.jsd -DartifactId=budfgc -DnewVersion=ds -DinteractiveMode=false"
		// testRunner.runCommand(cmd, []);


	}));

	context.subscriptions.push(vscode.commands.registerCommand("wso2esb.artifact.api", async (entry: Uri | undefined) => {
        await createArtifact("api");
	}));

	context.subscriptions.push(vscode.commands.registerCommand("wso2esb.artifact.proxy", async (entry: Uri | undefined) => {
		await createArtifact("proxy");
	}));
}






