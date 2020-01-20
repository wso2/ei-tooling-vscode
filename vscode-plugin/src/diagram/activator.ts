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

import { workspace, commands, window, Uri, ViewColumn, ExtensionContext, TextEditor, WebviewPanel, WorkspaceFolder } from 'vscode';
import { join } from "path";
import * as path from 'path';
import * as fs from "fs"
//import {ArtifactModule} from '../artifacts/ArtifactModule'

let diagramViewPanel: WebviewPanel | undefined;
let activeEditor: TextEditor | undefined;
//let pathToTargetFolder: null;

function updateWebView(docUri: Uri): void {

}

export function showDiagram(context: ExtensionContext) {


    if (workspace.workspaceFolders) {
        const synapseWorkspace: WorkspaceFolder = workspace.workspaceFolders[0];
        const pathToTargetFolder = path.join(synapseWorkspace.uri.fsPath, "src", "main", "synapse-config", "sequences");

        if (diagramViewPanel) {
            diagramViewPanel.reveal(ViewColumn.Two, true);
            return;
        }

        diagramViewPanel = window.createWebviewPanel(
            'mediationDiagram',
            "Mediation Diagram",
            { viewColumn: ViewColumn.Two, preserveFocus: true },
            {
                localResourceRoots: [Uri.file(join(pathToTargetFolder))],
                enableScripts: true
            },
        );

        const changeActiveEditorDisposable = window.onDidChangeActiveTextEditor(
            (activatedEditor: TextEditor | undefined) => {
                if (window.activeTextEditor && activatedEditor
                    && (activatedEditor.document === window.activeTextEditor.document)
                ) {
                    activeEditor = window.activeTextEditor;
                    //updateWebView(activatedEditor.document.uri);
                }
            });

        const editor = window.activeTextEditor;
        if (!editor) {
            return;
        }
        activeEditor = editor;
        
        let text;

        if (window.activeTextEditor) {
            const currentDoc = window.activeTextEditor.document;
            text = currentDoc.getText();
        }

        workspace.onDidOpenTextDocument((document) => {
            text = document.getText();
        });

        let convertToJson = require('xml-js');
        let xml = text;

        const result1 = convertToJson .xml2json(xml, { compact: true, spaces: 4 });
        //var result2 = convert.xml2json(xml, { compact: false, spaces: 4 });

        if (diagramViewPanel != undefined) {
            diagramViewPanel.webview.html = getWebviewContent(text);
        }

        console.log(result1);

        // if (diagramViewPanel && html) {
        // 	diagramViewPanel.webview.html = text;
        // }
        // if(text != undefined) {
        //     diagramViewPanel.webview.html = getWebviewContent(text);
        // }

        // diagramViewPanel.webview.html = getWebviewContent(text);

        diagramViewPanel.iconPath = {
            light: Uri.file(join(context.extensionPath, 'resources/images/icons/design-view.svg')),
            dark: Uri.file(join(context.extensionPath, 'resources/images/icons/design-view-inverse.svg'))
        };

        diagramViewPanel.onDidDispose(() => {
            diagramViewPanel = undefined;
            //didChangeDisposable.dispose();
            changeActiveEditorDisposable.dispose();
        });
    }
}

function getWebviewContent(text: any) {

    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cat Coding</title>
  </head>
  <body>
        <code><pre>${text}</pre></code>
  </body>

  
  </html>`;
}

export function deactivate() {
}
