import * as vscode from 'vscode';
import { setLanguageToSynapse as setLanguageToSynapse, registerCommandToChangeLanguageToSyanpse} from './language';
import { launch as launchServer } from './server';
import { Uri} from "vscode";
import { ArchetypeModule } from "./archetype/ArchetypeModule";

export function activate(context: vscode.ExtensionContext) {

	console.log("hellooooo");

	doActivate(context);

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

// function registerCommand(context: vscode.ExtensionContext, commandName: string, func: (...args: any[]) => any, withOperationIdAhead?: boolean): void {
	
// 	const commandHandler = (name: string = 'world') => {
// 		console.log(`Hello ${name}!!!`);
// 	  };

//     context.subscriptions.push(vscode.commands.registerCommand("maven.archetype.generate", async (entry: Uri | undefined) => {
//         await ArchetypeModule.generateFromArchetype(entry);
// 	}));
// }

async function doActivate(context: vscode.ExtensionContext): Promise<void> {
	console.log("inside doActivate method");
	// registerCommand(context, "maven.archetype.generate", async (entry: Uri | undefined) => {
    //     await ArchetypeModule.generateFromArchetype(entry);
	// }, true);

	context.subscriptions.push(vscode.commands.registerCommand("maven.archetype.generate", async (entry: Uri | undefined) => {
        await ArchetypeModule.generateFromArchetype(entry);
	}));

	context.subscriptions.push(vscode.commands.registerCommand("wso2esb.project.create", async (entry: Uri | undefined) => {
        await ArchetypeModule.createESBProject(entry);
	}));

}


