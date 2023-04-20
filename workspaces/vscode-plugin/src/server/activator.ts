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

import {
    commands,
    ExtensionContext,
    IndentAction,
    LanguageConfiguration,
    languages,
    Position,
    TextDocument, Uri, ViewColumn,
    window,
    workspace
} from 'vscode';
import * as path from 'path';
import {
    DidChangeConfigurationNotification, Hover,
    LanguageClient,
    LanguageClientOptions,
    RequestType,
    ServerOptions, TextDocumentIdentifier,
    TextDocumentPositionParams
} from 'vscode-languageclient';
import { activateTagClosing, AutoCloseResult } from './tagClosing';
import {SyntaxTreeResponse} from "./SyntaxTreeResponse";
import { activate as activateDiagram } from '../diagram';
import {ExtendedLangClient} from "../extended-language.client";

export interface ScopeInfo {
    scope: "default" | "global" | "workspace" | "folder";
    configurationTarget: boolean | undefined;
}

namespace TagCloseRequest {
    export const type: RequestType<TextDocumentPositionParams, AutoCloseResult, any> =
        new RequestType('xml/closeTag');
}

// namespace DiagramHoverRequest {
//     export const type: RequestType<TextDocumentPositionParams, AutoCloseResult, any> =
//         new RequestType('xml/hoverDiagram');
// }

namespace SyntaxTreeRequest {
    export const type: RequestType<TextDocumentIdentifier, SyntaxTreeResponse, any> =
        new RequestType('xml/getSynapseSyntaxTree');
}

let ignoreAutoCloseTags = false;
let vmArgsCache: any;
let ignoreVMArgs = false;
const main: string = 'org.eclipse.lemminx.XMLServerLauncher';

export function launch(context: ExtensionContext, directoryName: string) {
    const { JAVA_HOME } = process.env;

    if (JAVA_HOME) {
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
            initializationOptions: { "settings": getXMLSettings() },
            synchronize: {
                //preferences starting with these will trigger didChangeConfiguration
                configurationSection: ['xml', '[SynapseXml]']
            },
            // Register the server for synapse xml documents
            documentSelector: [{ scheme: 'file', language: 'SynapseXml' }],
            middleware: {
                workspace: {
                    didChangeConfiguration: () => {
                        languageClient.sendNotification(DidChangeConfigurationNotification.type,
                            { settings: getXMLSettings() });
                        if (!ignoreAutoCloseTags) {
                            verifyAutoClosing();
                        }
                        !ignoreVMArgs ? verifyVMArgs() : undefined;
                    }
                }
            }
        };

        // Create the language client and start the client.
        let languageClient = new ExtendedLangClient('synapseXML', 'Synapse Language Server',
            serverOptions, clientOptions);
        let disposable = languageClient.start();

        context.subscriptions.push(disposable);

        languageClient.onReady().then(() => {
            //Setup autoCloseTags
            let tagProvider = (document: TextDocument, position: Position) => {
                let param = languageClient.code2ProtocolConverter.asTextDocumentPositionParams(document, position);
                return languageClient.sendRequest(TagCloseRequest.type, param);
            };

            // let DiagramHoverProvider = (document: TextDocument, position: Position) => {
            //     let param = languageClient.code2ProtocolConverter.asTextDocumentPositionParams(document, position);
            //     return languageClient.sendRequest(HoverRequest.type, param);
            // };

            let syntaxTreeProvider = (document: TextDocument) => {
                let param = languageClient.code2ProtocolConverter.asTextDocumentIdentifier(document);
                return languageClient.sendRequest(SyntaxTreeRequest.type, param);
            };

            disposable = activateTagClosing(tagProvider, { SynapseXml: true, xsl: true },
                'xml.completion.autoCloseTags');
            context.subscriptions.push(disposable);


            // context.subscriptions.push(HoverProvider);
        });
        activateDiagram(languageClient, context);
        languages.setLanguageConfiguration('SynapseXml', getIndentationRules());
    }

    function getXMLSettings(): JSON {
        let configXML = workspace.getConfiguration().get('xml');
        let xml: any;
        if (!configXML) { //Set default preferences if not provided
            xml =
            {
                xml: {
                    trace: {
                        server: 'verbose'
                    },
                    logs: {
                        client: true
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
        } else {
            let x: string = JSON.stringify(configXML); //configXML is not a JSON type
            JSON.parse(x);
            xml = { xml: JSON.parse(x) };

        }
        xml['xml']['useCache'] = true;
        return xml;
    }

    function verifyAutoClosing() {
        let configXML = workspace.getConfiguration();
        let closeTags = configXML.get("xml.completion.autoCloseTags");
        let x: any = configXML.get("[SynapseXml]");
        if (x) {
            let closeBrackets: any = x["editor.autoClosingBrackets"];
            if (closeTags && closeBrackets !== "never") {
                window.showWarningMessage(
                    "The [SynapseXml].editor.autoClosingBrackets setting conflicts with " +
                    "xml.completion.autoCloseTags. It's recommended to disable it.",
                    "Disable", "Ignore")
                    .then((selection) => {
                        if (selection === "Disable") {
                            let scopeInfo: ScopeInfo = getScopeLevel("", "[SynapseXml]");
                            workspace.getConfiguration().update("[SynapseXml]",
                                { "editor.autoClosingBrackets": "never" },
                                scopeInfo.configurationTarget).then(
                                    () => console.log('[SynapseXml].editor.autoClosingBrackets globally set to never'),
                                    (error) => console.log(error)
                                );
                        } else if (selection === "Ignore") {
                            ignoreAutoCloseTags = true;
                        }
                    });
            }
        }
    }

    function verifyVMArgs() {
        let currentVMArgs = workspace.getConfiguration("xml.server").get("vmargs");
        if (vmArgsCache !== undefined) {
            if (vmArgsCache !== currentVMArgs) {
                window.showWarningMessage(
                    "XML Language Server configuration changed, please restart VS Code.",
                    "Restart",
                    "Ignore").then((selection: string | undefined) => {
                        if (selection === "Restart") {
                            commands.executeCommand("workbench.action.reloadWindow");
                        } else if (selection === "Ignore") {
                            ignoreVMArgs = true;
                        }
                    });
            }
        } else {
            vmArgsCache = currentVMArgs;
        }
    }

    function getScopeLevel(configurationKey: string, key: string): ScopeInfo {
        let configXML = workspace.getConfiguration(configurationKey);
        let result = configXML.inspect(key);
        let scope: "default" | "global" | "workspace" | "folder", configurationTarget;
        if (result && result.workspaceFolderValue === undefined) {
            if (result.workspaceValue === undefined) {
                if (result.globalValue === undefined) {
                    scope = "default";
                    configurationTarget = true;
                } else {
                    scope = "global";
                    configurationTarget = true;
                }
            } else {
                scope = "workspace";
                configurationTarget = false;
            }
        } else {
            scope = "folder";
            configurationTarget = undefined;
        }
        return { "scope": scope, "configurationTarget": configurationTarget };
    }

    function getIndentationRules(): LanguageConfiguration {
        return {
            onEnterRules: [
                {
                    beforeText: new RegExp(`<([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$`, 'i'),
                    afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>/i,
                    action: { indentAction: IndentAction.IndentOutdent }
                },
                {
                    beforeText: new RegExp(`<(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`, 'i'),
                    action: { indentAction: IndentAction.Indent }
                }
            ],
        };
    }
}
