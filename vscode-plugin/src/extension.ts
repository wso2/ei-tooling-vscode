import * as vscode from 'vscode';
import { checkSynapseLanguage as checkSynapseDocument, registerCommandToChangeLanguageToSyanpse} from './language';
import * as path from 'path';
import { ServerOptions, LanguageClientOptions, LanguageClient } from 'vscode-languageclient';

const main: string = 'org.eclipse.lsp4xml.XMLServerLauncher';

export function activate(context: vscode.ExtensionContext) {
	//launch server
	launch(context);

	//registering command to forcefully change the editing mode to synapse
	registerCommandToChangeLanguageToSyanpse(context);

	//check currently active text editor
	if (vscode.window.activeTextEditor) {
		const currentDoc = vscode.window.activeTextEditor.document;
		checkSynapseDocument(currentDoc);
	}

	//listen to changing event of the active text editor
	vscode.window.onDidChangeActiveTextEditor(editor => {
		if(editor) {
			checkSynapseDocument(editor.document);
		}
	});
	
	//listen to newly opened text documents
	vscode.workspace.onDidOpenTextDocument((document)=>{
		checkSynapseDocument(document);
	});
}

function launch(context: vscode.ExtensionContext) {
	const { JAVA_HOME } = process.env;
	console.log(`Using java from JAVA_HOME: ${JAVA_HOME}`);
	
	if (JAVA_HOME){
		let excecutable : string = path.join(JAVA_HOME, 'bin', 'java');
		let schemaPath = path.join(__dirname, "..", "synapse-schemas", "synapse_config.xsd");
		let classPath = path.join(__dirname, '..', 'target', 'launcher', 'org.eclipse.lsp4xml-uber.jar');

		console.log(schemaPath);

		let schemaPathArg = '-DSCHEMA_PATH='+schemaPath;
		// let workspaceUri = '-DWORKSPACE_DIRECTORY-PATH='+vscode.workspace.workspaceFolders;
		const args: string[] = [schemaPathArg, '-cp', classPath];
		
		if (process.env.LSDEBUG === "true") {
			console.log('LSDEBUG is set to "true". Services will run on debug mode');
			args.push('-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=5005,quiet=y');
		}
		
		let serverOptions: ServerOptions = {
			command: excecutable,
			args: [...args, main],
			options: {}
		};

		// Options to control the language client
		let clientOptions: LanguageClientOptions = {
			// Register the server for synapse xml documents
			documentSelector: [{scheme: 'file', language: 'SynapseXml'}]
		};

		// Create the language client and start the client.
		let disposable = new LanguageClient('synapseXML', 'Synapse Language Server', serverOptions, clientOptions).start();

		context.subscriptions.push(disposable);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
