'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import { ServerOptions, LanguageClientOptions, LanguageClient } from 'vscode-languageclient';

const main: string = 'org.eclipse.lsp4xml.XMLServerLauncher';

export function launch(context: vscode.ExtensionContext, directoryName: string) {
	const { JAVA_HOME } = process.env;

	console.log(`Using java from JAVA_HOME: ${JAVA_HOME}`);
	
	if (JAVA_HOME){
		console.log("directoryName");
		console.log(directoryName);
		let excecutable : string = path.join(JAVA_HOME, 'bin', 'java');
		let schemaPath = path.join(directoryName, "..", "synapse-schemas", "synapse_config.xsd");
		let classPath = path.join(directoryName, '..', 'launcher', 'org.eclipse.lsp4xml-uber.jar');
		let LSextensionPath = path.join(directoryName,  '..', 'lib', '*');
		// let LSextensionPath = path.join(directoryName, '..', 'launcher2');

		console.log("classPath");
		console.log(classPath);

		console.log(schemaPath);

		let schemaPathArg = '-DSCHEMA_PATH=' + schemaPath;
		//let LSextensionPathArg = '-Djava.ext.dirs=' + LSextensionPath;
		const args: string[] = [schemaPathArg, '-cp', LSextensionPath];

		// const args: string[] = [schemaPathArg,'-Djava.ext.dirs=/Users/sajinieranasinghe/Documents/WebBasedEIToolingVSCodeExtension/vscode-synapse-parent/vscode-synapse/language-server/extensions/org.eclipse.lsp4xml.extensions.synapse/target', '-cp', classPath];

		
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