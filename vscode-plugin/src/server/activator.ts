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

'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import {LanguageClient, LanguageClientOptions, ServerOptions} from 'vscode-languageclient';
import * as os from 'os';

const main: string = 'org.eclipse.lsp4xml.XMLServerLauncher';

export function launch(context: vscode.ExtensionContext, directoryName: string) {
    const {JAVA_HOME} = process.env;

    console.log(`Using java from JAVA_HOME: ${JAVA_HOME}`);

    let storagePath = context.storagePath;
    if (!storagePath) {
        storagePath = os.homedir() + "/.lsp4xml";
    }
    let logfile = path.resolve(storagePath + '/lsp4xml.log');

    if (JAVA_HOME) {
        console.log("directoryName");
        console.log(directoryName);
        let executable: string = path.join(JAVA_HOME, 'bin', 'java');
        let schemaPath = path.join(directoryName, "..", "synapse-schemas", "synapse_config.xsd");
        let LSExtensionPath = path.join(directoryName, '..', 'lib', '*');

        let schemaPathArg = '-DSCHEMA_PATH=' + schemaPath;
        const args: string[] = [schemaPathArg, '-cp', LSExtensionPath];

        if (process.env.LSDEBUG === "true") {
            console.log('LSDEBUG is set to "true". Services will run on debug mode');
            args.push('-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=5005,quiet=y');
        }

        let serverOptions: ServerOptions = {
            command: executable,
            args: [...args, main],
            options: {}
        };

        // Options to control the language client
        let clientOptions: LanguageClientOptions = {
            initializationOptions: {"settings": getXMLSettings()},
            synchronize: {
                //preferences starting with these will trigger didChangeConfiguration
                configurationSection: ['xml', '[xml]']
            },
            // Register the server for synapse xml documents
            documentSelector: [{scheme: 'file', language: 'SynapseXml'}]
        };

        // Create the language client and start the client.
        let disposable = new LanguageClient('synapseXML', 'Synapse Language Server', serverOptions, clientOptions).start();

        context.subscriptions.push(disposable);
    }

    function getXMLSettings(): JSON {
        let configXML = vscode.workspace.getConfiguration().get('xml');
        let xml: any;
        if (!configXML) { //Set default preferences if not provided
            const defaultValue: any =
                {
                    xml: {
                        trace: {
                            server: 'verbose'
                        },
                        logs: {
                            client: true,
                            file: storagePath + '/lsp4xml.log'
                        },
                        format: {
                            enabled: true,
                            splitAttributes: false
                        },
                        completion: {
                            autoCloseTags: false
                        }
                    }
                };
            xml = defaultValue;
        } else {
            let x: string = JSON.stringify(configXML); //configXML is not a JSON type
            JSON.parse(x);
            xml = {xml: JSON.parse(x)};

        }
        xml['xml']['logs']['file'] = logfile;
        xml['xml']['useCache'] = true;
        return xml;
    }
}

