import {WebViewMethod, WebViewRPCMessage} from "./model";
import {deflateSync} from "zlib";
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

const getLangClientMethods = (langClient: ExtendedLangClient): WebViewMethod[] => {
    return [{
        methodName: 'getSyntaxTree',
        handler: (args: any[]) => {
            const start = new Date().getTime();
            // const res = "{\n    \"startTagOpenOffset\": 39,\n    \"startTagOffOffset\": 125,\n    \"endTagOpenOffset\": 394,\n    \"endTagOffOffset\": 399,\n    \"start\": 39,\n    \"end\": 400,\n    \"kind\": \"api\",\n    \"selfClosed\": false,\n    \"hasTextNode\": false,\n    \"children\": [\n      {\n        \"startTagOpenOffset\": 131,\n        \"startTagOffOffset\": 175,\n        \"endTagOpenOffset\": 382,\n        \"endTagOffOffset\": 392,\n        \"start\": 131,\n        \"end\": 393,\n        \"kind\": \"resource\",\n        \"selfClosed\": false,\n        \"hasTextNode\": false,\n        \"children\": [\n          {\n            \"startTagOpenOffset\": 185,\n            \"startTagOffOffset\": 196,\n            \"endTagOpenOffset\": 274,\n            \"endTagOffOffset\": 286,\n            \"start\": 185,\n            \"end\": 287,\n            \"kind\": \"inSequence\",\n            \"selfClosed\": false,\n            \"hasTextNode\": false,\n            \"children\": [\n              {\n                \"startTagOpenOffset\": 210,\n                \"startTagOffOffset\": -1,\n                \"endTagOpenOffset\": -1,\n                \"endTagOffOffset\": -1,\n                \"start\": 210,\n                \"end\": 216,\n                \"kind\": \"log\",\n                \"selfClosed\": true,\n                \"hasTextNode\": false,\n                \"children\": [],\n                \"attributes\": []\n              },\n              {\n                \"startTagOpenOffset\": 255,\n                \"startTagOffOffset\": -1,\n                \"endTagOpenOffset\": -1,\n                \"endTagOffOffset\": -1,\n                \"start\": 255,\n                \"end\": 265,\n                \"kind\": \"respond\",\n                \"selfClosed\": true,\n                \"hasTextNode\": false,\n                \"children\": [],\n                \"attributes\": []\n              }\n            ],\n            \"attributes\": []\n          },\n          {\n            \"startTagOpenOffset\": 296,\n            \"startTagOffOffset\": 308,\n            \"endTagOpenOffset\": 338,\n            \"endTagOffOffset\": 351,\n            \"start\": 296,\n            \"end\": 352,\n            \"kind\": \"outSequence\",\n            \"selfClosed\": false,\n            \"hasTextNode\": false,\n            \"children\": [\n              {\n                \"startTagOpenOffset\": 322,\n                \"startTagOffOffset\": -1,\n                \"endTagOpenOffset\": -1,\n                \"endTagOffOffset\": -1,\n                \"start\": 322,\n                \"end\": 329,\n                \"kind\": \"send\",\n                \"selfClosed\": true,\n                \"hasTextNode\": false,\n                \"children\": [],\n                \"attributes\": []\n              }\n            ],\n            \"attributes\": []\n          }\n        ]\n      }\n    ]\n  }";
            // return Promise.resolve(res);
            return langClient.getSyntaxTree(args[0]).then((result) => {
                consoleLog(start, 'getSyntaxTree');
                // const zippedResult = deflateSync(Buffer.from(JSON.stringify(result)));
                // return Promise.resolve(zippedResult);
                // const res = "{\n    \"startTagOpenOffset\": 39,\n    \"startTagOffOffset\": 125,\n    \"endTagOpenOffset\": 394,\n    \"endTagOffOffset\": 399,\n    \"start\": 39,\n    \"end\": 400,\n    \"kind\": \"api\",\n    \"selfClosed\": false,\n    \"hasTextNode\": false,\n    \"children\": [\n      {\n        \"startTagOpenOffset\": 131,\n        \"startTagOffOffset\": 175,\n        \"endTagOpenOffset\": 382,\n        \"endTagOffOffset\": 392,\n        \"start\": 131,\n        \"end\": 393,\n        \"kind\": \"resource\",\n        \"selfClosed\": false,\n        \"hasTextNode\": false,\n        \"children\": [\n          {\n            \"startTagOpenOffset\": 185,\n            \"startTagOffOffset\": 196,\n            \"endTagOpenOffset\": 274,\n            \"endTagOffOffset\": 286,\n            \"start\": 185,\n            \"end\": 287,\n            \"kind\": \"inSequence\",\n            \"selfClosed\": false,\n            \"hasTextNode\": false,\n            \"children\": [\n              {\n                \"startTagOpenOffset\": 210,\n                \"startTagOffOffset\": -1,\n                \"endTagOpenOffset\": -1,\n                \"endTagOffOffset\": -1,\n                \"start\": 210,\n                \"end\": 216,\n                \"kind\": \"log\",\n                \"selfClosed\": true,\n                \"hasTextNode\": false,\n                \"children\": [],\n                \"attributes\": []\n              },\n              {\n                \"startTagOpenOffset\": 255,\n                \"startTagOffOffset\": -1,\n                \"endTagOpenOffset\": -1,\n                \"endTagOffOffset\": -1,\n                \"start\": 255,\n                \"end\": 265,\n                \"kind\": \"respond\",\n                \"selfClosed\": true,\n                \"hasTextNode\": false,\n                \"children\": [],\n                \"attributes\": []\n              }\n            ],\n            \"attributes\": []\n          },\n          {\n            \"startTagOpenOffset\": 296,\n            \"startTagOffOffset\": 308,\n            \"endTagOpenOffset\": 338,\n            \"endTagOffOffset\": 351,\n            \"start\": 296,\n            \"end\": 352,\n            \"kind\": \"outSequence\",\n            \"selfClosed\": false,\n            \"hasTextNode\": false,\n            \"children\": [\n              {\n                \"startTagOpenOffset\": 322,\n                \"startTagOffOffset\": -1,\n                \"endTagOpenOffset\": -1,\n                \"endTagOffOffset\": -1,\n                \"start\": 322,\n                \"end\": 329,\n                \"kind\": \"send\",\n                \"selfClosed\": true,\n                \"hasTextNode\": false,\n                \"children\": [],\n                \"attributes\": []\n              }\n            ],\n            \"attributes\": []\n          }\n        ]\n      }\n    ]\n  }";
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
    }];
}

async function applyChange(params: ApplyEditParams): Promise<boolean> {
    const url: string = params.textDocument.uri;
    const uri: Uri = Uri.parse(url);
    const document: TextDocument = await workspace.openTextDocument(uri);
    if (document === null) {
        return false;
    }

    const edit = new WorkspaceEdit();
    let startPosition = new Position(params.textEdit.range.start.line, params.textEdit.range.start.character);
    let endPosition = new Position(params.textEdit.range.end.line, params.textEdit.range.end.character);
    let replaceLocation: Position | Range = new Range(startPosition, endPosition);
    edit.replace(Uri.file(params.textDocument.fsPath), replaceLocation, params.textEdit.newText);
    await workspace.applyEdit(edit);
    return true;
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
