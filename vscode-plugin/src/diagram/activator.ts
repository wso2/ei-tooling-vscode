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

import { workspace, commands, window, Uri, ViewColumn, ExtensionContext, TextEditor, WebviewPanel, TextDocumentChangeEvent } from 'vscode';
import { join } from "path";
import * as _ from 'lodash';

const DEBOUNCE_WAIT = 500;
let diagramViewPanel: WebviewPanel | undefined;
let activeEditor: TextEditor | undefined;
let preventDiagramUpdate = false;
let xmlText: string;
let convertToJson = require('xml-js');
let jsonObject: JSON;

function render(context: ExtensionContext, json: JSON) {
    if (diagramViewPanel) {
        diagramViewPanel.webview.html = getWebviewContent(context, json);
    }
}

function getXMLText() {
    const editor = window.activeTextEditor;

    if (!editor) {
        return;
    }
    activeEditor = editor;

    if (window.activeTextEditor) {
        const currentDoc = window.activeTextEditor.document;
        return xmlText = currentDoc.getText();
    }
}

function getJSONObject() {
    let xml = getXMLText();
    return jsonObject = convertToJson.xml2json(xml, { compact: false, spaces: 4 });    
}
function updateWebView(context: ExtensionContext, json: JSON): void {
    if (diagramViewPanel) {
        render(context, json);
    }
}

export function showDiagram(context: ExtensionContext) {
    const didChangeDisposable = workspace.onDidChangeTextDocument(
        _.debounce((e: TextDocumentChangeEvent) => {
            if (activeEditor && (e.document === activeEditor.document)) {
                if (preventDiagramUpdate) {
                    return;
                }
                updateWebView(context, getJSONObject());
            }
        }, DEBOUNCE_WAIT));

    const changeActiveEditorDisposable = window.onDidChangeActiveTextEditor(
        (activatedEditor: TextEditor | undefined) => {
            if (window.activeTextEditor && activatedEditor
                && (activatedEditor.document === window.activeTextEditor.document)) {
                activeEditor = window.activeTextEditor;
                updateWebView(context, getJSONObject());
            }
        });

    if (diagramViewPanel) {
        diagramViewPanel.reveal(ViewColumn.Two, true);
        return;
    }

    diagramViewPanel = window.createWebviewPanel(
        'mediationDiagram',
        "Mediation Diagram",
        { viewColumn: ViewColumn.Two, preserveFocus: true },
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [
                Uri.file(getWebViewResourceRoot(context)),
            ],
        }
    );

    diagramViewPanel.iconPath = {
        light: Uri.file(join(context.extensionPath, 'resources/images/icons/design-view.svg')),
        dark: Uri.file(join(context.extensionPath, 'resources/images/icons/design-view-inverse.svg'))
    };

    const retunredJSONObject = getJSONObject();
    render(context, retunredJSONObject);

    diagramViewPanel.onDidDispose(() => {
        diagramViewPanel = undefined;
        didChangeDisposable.dispose();
        changeActiveEditorDisposable.dispose();
    });

}

export function getWebViewResourceRoot(context: ExtensionContext): string {

    return join(context.extensionPath,
        'resources/build');
}

export function getVSCodeResourceURI(filePath: string): string {
    return 'vscode-resource:' + filePath;
}

function getWebviewContent(context: ExtensionContext, json: JSON) {
    const resourceRoot = getVSCodeResourceURI(getWebViewResourceRoot(context));
    const stringifiedJson = JSON.stringify(json);
    
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mediation Diagram</title>
        </head>
        <body>
            <div id="root"></div>
            <script type="text/javascript">
                window["runConfig"] = {
                    resourcePath: "${resourceRoot}",
                    jsonValue:${stringifiedJson},    
                }
            </script>
            <script type="text/javascript" id="script" src="${resourceRoot}/main.js"></script>
        </body>
    </html>`;
}

export function deactivate() {
}