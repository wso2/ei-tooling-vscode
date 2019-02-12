// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import { ServerOptions, LanguageClientOptions, LanguageClient } from 'vscode-languageclient';

const main: string = 'org.eclipse.lsp4xml.XMLServerLauncher';

var onceExecuted = false;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "synapse-language-support" is now active!');

	function startLanguageServer(): void{
		const { JAVA_HOME } = process.env;
		console.log(`Using java from JAVA_HOME: ${JAVA_HOME}`);
		
		if (JAVA_HOME){
			let excecutable : string = path.join(JAVA_HOME, 'bin', 'java');
	
			// let jarPath = path.join(__dirname, '..', 'launcher', 'org.eclipse.lsp4xml-uber.jar');
			let classPath = path.join(__dirname, '..', 'launcher', 'org.eclipse.lsp4xml-uber.jar');

			console.log(classPath);
	
			// setting classpath arguement
			const args: string[] = ['-cp', classPath];
			
			if (process.env.LSDEBUG === "true") {
				console.log('LSDEBUG is set to "true". Services will run on debug mode');
				args.push('-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=5008,quiet=y');
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
			
			// Push the disposable to the context's subscriptions so that the 
			// client can be deactivated on extension deactivation
			context.subscriptions.push(disposable);
		}
	}

	vscode.workspace.onDidOpenTextDocument((document)=>{
		//parsing the document	
		let xmlData = document.getText();

		//getting filename of the opened document
		let fileExtension = document.fileName;

		//checking for '.xml' extension
		let pattern = new RegExp("\.xml$");
		let res = pattern.test(fileExtension);
		
		if (res === true && !onceExecuted){
			onceExecuted = true;
			let synapseNSPttern = new RegExp("xmlns=\"http:\/\/ws\.apache\.org\/ns\/synapse");
			let response = synapseNSPttern.test(xmlData);

			vscode.languages.setTextDocumentLanguage(document, "SynapseXml");

			startLanguageServer();
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
