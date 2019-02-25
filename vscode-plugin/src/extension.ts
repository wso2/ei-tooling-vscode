import * as vscode from 'vscode';
import { checkLanguage as checkSynapseDocument, checkNamespace} from './language';
import * as path from 'path';
import { ServerOptions, LanguageClientOptions, LanguageClient } from 'vscode-languageclient';

const main: string = 'org.eclipse.lsp4xml.XMLServerLauncher';

export function activate(context: vscode.ExtensionContext) {
	//launch server
	launch(context);

	const commandRegistration = vscode.commands.registerTextEditorCommand('extension.changeLanguage', (editor, edit) => {
		let rootElements = ["definitions", "api", "proxy", "endpoint", "inbound", "local_entry", "messagestore", 
		"messageprocessor","sequence", "task", "template", "registry"];

		let number = editor.document.lineCount;
		var num = 0;

		let count = 0;
		loop:
		while (num < number) {
			let currLine = editor.document.lineAt(num);

			if (count < 2 && !currLine.isEmptyOrWhitespace) {
				for (let element of rootElements) {
					if (checkNamespace(currLine.text, element) && !checkNamespace(currLine.text, "\"http:\/\/ws\.apache\.org\/ns\/synapse")){
						let endCharPosition = currLine.range.end.with(currLine.range.end.line, currLine.range.end.character-1);
						edit.insert(endCharPosition, " xmlns='http://ws.apache.org/ns/synapse'");
						break loop;
					}
				}
				count++;
			}
			num++;
		}
	});

	context.subscriptions.push(commandRegistration);

	//check currently active text editor
	if (vscode.window.activeTextEditor) {
		const currentDoc = vscode.window.activeTextEditor.document;
		checkSynapseDocument(currentDoc);
	}

	//listen to changing event of the active text editor
	vscode.window.onDidChangeActiveTextEditor(editor => {
		if(editor) {
			let x = editor.document;
			checkSynapseDocument(x);
		}
	});
	
	//listen to newly opened text documents
	vscode.workspace.onDidOpenTextDocument((document)=>{
		checkSynapseDocument(document);
	});

	vscode.workspace.onDidCloseTextDocument((document)=> {
		
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

		// let disposable = vscode.commands.registerCommand('extension.start', () => {
		// 	new LanguageClient('synapseXML', 'Synapse Language Server', serverOptions, clientOptions).start();
		// });
	
		// Push the disposable to the context's subscriptions so that the 
		// client can be deactivated on extension deactivation
		context.subscriptions.push(disposable);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
