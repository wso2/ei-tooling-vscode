/**
 * Copyright (c) 2023, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

import {WebViewMethod, WebViewRPCMessage} from "./model";
import {ExtendedLangClient} from "../extended-language.client";
import {debug} from "../utils/logger";
import {
    commands,
    Position,
    Range,
    TextDocument,
    Uri,
    WebviewPanel,
    WebviewView,
    workspace,
    WorkspaceEdit
} from "vscode";
import {ApplyEditParams} from "../ISynapseLanguageClient";
import {callUpdateDiagramMethod} from "../diagram";

const getLangClientMethods = (langClient: ExtendedLangClient): WebViewMethod[] => {
    return [{
        methodName: 'getSyntaxTree',
        handler: (args: any[]) => {
            const start = new Date().getTime();
            return langClient.getSyntaxTree(args[0]).then((result) => {
                consoleLog(start, 'getSyntaxTree');
                // const zippedResult = deflateSync(Buffer.from(JSON.stringify(result)));
                // return Promise.resolve(zippedResult);
                return Promise.resolve(result);

            });
        }
    },
    {
        methodName: 'getCompletion',
        handler: (args: any[]) => {
            const start = new Date().getTime();
            return langClient.getCompletion(args[0]).then(result => {
                consoleLog(start, 'getCompletion');
                return result;
            });
        }
    },
    {
        methodName: 'applyChange',
        handler: (args: any[]) => {
            const start = new Date().getTime();
            return applyChange(args[0]).then(result => {
                consoleLog(start, 'getCompletion');
                return result;
            });
        }
    },
    {
        methodName: 'hover',
        handler: (args: any[]) => {
            const start = new Date().getTime();
            return langClient.hover(args[0]).then(result => {
                consoleLog(start, 'hover');
                return result;
            });
        }
    },
    {
        methodName: 'getSnippetCompletion',
        handler: (args: any[]) => {
            const start = new Date().getTime();
            return langClient.getSnippetCompletion(args[0]).then(result => {
                consoleLog(start, 'getSnippetCompletion');
                return result;
            });
        }
    }];
}

async function applyChange(params: ApplyEditParams): Promise<boolean> {
    const url: string = params.textDocument.uri;
    const uri: Uri = Uri.parse(url);
    const document: TextDocument = await workspace.openTextDocument(uri);
    if (document === null) {
        return false;
    }
    const previousComponentStartPosition = params.previousComponentStartPosition;
    const previousPosition = document.positionAt(previousComponentStartPosition);
    const previousStartCharacter = previousPosition.character;
    const edit = new WorkspaceEdit();
    let startPosition = new Position(params.textEdit.range.start.line, params.textEdit.range.start.character);
    let endPosition = new Position(params.textEdit.range.end.line, params.textEdit.range.end.character);
    let replaceLocation: Position | Range = new Range(startPosition, endPosition);
    let replaceText = params.textEdit.newText;
    // if (!replaceText.startsWith("\n")) {
    replaceText = formatReplaceText(replaceText, previousStartCharacter);
    // }
    // formatReplaceText(params.textEdit.newText, previousStartCharacter);
    edit.replace(Uri.file(params.textDocument.fsPath), replaceLocation, replaceText);
    await workspace.applyEdit(edit);
    callUpdateDiagramMethod();
    return true;
}

function formatReplaceText(targetText: string, indentation: number): string {
    const lines: string[] = targetText.split(/\r?\n/);
    let result: string = "";
    lines.map((item, index) => {
        result += " ".repeat(indentation) + item + "\n"
    })
    return result;
}

function consoleLog(start: number, fnName: string) {
    const end = new Date().getTime();
    debug(`Backend - Time taken for ${fnName}: ${end - start}ms`);
}

export class WebViewRPCHandler {

    private _sequence: number = 1;
    private _callbacks: Map<number, Function> = new Map();

    constructor(public methods: Array<WebViewMethod>, public webViewPanel: WebviewPanel | WebviewView) {
        webViewPanel.webview.onDidReceiveMessage(this._onRemoteMessage.bind(this));
        this.webViewPanel = webViewPanel;
    }

    private _getMethod(methodName: string) {
        return this.methods.find(method => (method.methodName === methodName));
    }

    private _onRemoteMessage(msg: WebViewRPCMessage) {
        if (msg.id !== undefined) {
            // this is a request from remote
            const method = this._getMethod(msg.methodName);
            if (method) {
                const handler = method.handler(msg.arguments || [], this.webViewPanel);
                if (!handler) {
                    return;
                }
                handler.then((response: Thenable<any>) => {
                    this.webViewPanel.webview.postMessage({
                        originId: msg.id,
                        response: JSON.stringify(response)
                    });
                });
            }
        } else if (msg.originId !== undefined) {
            // this is a response from remote to one of our requests
            const callback = this._callbacks.get(msg.originId);
            if (callback) {
                callback(JSON.parse(msg.response));
                this._callbacks.delete(msg.originId);
            }
        }
    }

    invokeRemoteMethod(methodName: string, args: any[] = [], callback: Function) {
        const msg = {
            id: this._sequence,
            methodName,
            arguments: args,
        };
        this._callbacks.set(this._sequence, callback);
        this.webViewPanel.webview.postMessage(msg);
        this._sequence++;
    }

    static create(
        webViewPanel: WebviewPanel | WebviewView,
        langClient: ExtendedLangClient,
        methods: Array<WebViewMethod> = [])
        : WebViewRPCHandler {
        return new WebViewRPCHandler(
            [...methods, ...getLangClientMethods(langClient), ...undoRedoMethods],
            webViewPanel);
    }

    dispose() {
        // TODO unregister event handlers
    }
}

const undoRedoMethods = [{
    methodName: 'undo',
    handler: (args: any[]) => {
        commands.executeCommand('workbench.action.focusPreviousGroup')
            .then(() => {
                commands.executeCommand('undo');
            });
    }
},
    {
        methodName: 'redo',
        handler: (args: any[]) => {
            commands.executeCommand('workbench.action.focusPreviousGroup')
                .then(() => {
                    commands.executeCommand('redo');
                });

        }
    }
];
