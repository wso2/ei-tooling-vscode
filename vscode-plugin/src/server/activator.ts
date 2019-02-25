import * as vscode from 'vscode';
import * as path from 'path';
import { ServerOptions, LanguageClientOptions, LanguageClient } from 'vscode-languageclient';

const main: string = 'org.eclipse.lsp4xml.XMLServerLauncher';

export function launch(context: vscode.ExtensionContext) {
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
		// let disposable = new LanguageClient('synapseXML', 'Synapse Language Server', serverOptions, clientOptions).start();

		let disposable = vscode.commands.registerCommand('extension.start', () => {
			// The code you place here will be executed every time your command is executed
	
			// Display a message box to the user
			new LanguageClient('synapseXML', 'Synapse Language Server', serverOptions, clientOptions).start();
		});
	
		// Push the disposable to the context's subscriptions so that the 
		// client can be deactivated on extension deactivation
		context.subscriptions.push(disposable);
	}
}