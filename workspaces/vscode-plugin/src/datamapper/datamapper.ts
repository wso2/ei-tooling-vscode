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

import * as vscode from 'vscode';
import { readdirSync } from "fs";
import { join } from "path";
import DMCFile from "./DMCFileGenerator";
import datamapperFileUpload from "./datamapperFileUpload";
import datamapperSerialization from './datamapperSerialization';
import registryProject from './registryProject';
import datamapperDeserialization from './datamapperDeserialization';

export default class dataMapper {
    public static currentPanel: dataMapper | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];
    private readonly _extensionPath: string;
    private readonly _projectName: string;
    private readonly _registryName : string;

    private constructor(panel: vscode.WebviewPanel, extensionPath: string,projectName: string,registryName: string) {
        this._panel = panel;
        this._extensionPath = extensionPath;
        this._projectName = projectName;
        this._registryName = registryName;

        // Set an event listener to listen for when the panel is disposed 
        this._panel.onDidDispose(this.dispose, null, this._disposables);
        // Set the HTML content for the webview panel
        this._panel.webview.html = this._getWebviewContent(this._panel.webview);
        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener();
        //refreshing the webview
        this._panel.webview.postMessage({ type: 'refresh' });
    }

    public static render(extensionPath: string,projectName: string,registryName: string) {
        if (dataMapper.currentPanel) {
            dataMapper.currentPanel._panel.reveal(vscode.ViewColumn.One);
        } else {
            const panel = vscode.window.createWebviewPanel(
                "OpenDataMapperView",
                "Data Mapper View",
                { viewColumn: vscode.ViewColumn.One, preserveFocus: true },
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                }
            );

            dataMapper.currentPanel = new dataMapper(panel, extensionPath,projectName,registryName);
        }
    }

    public dispose() {
        dataMapper.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _getWebviewContent(webview: any) {
        const buildPath = join(this._extensionPath, 'datamapper', 'build', 'static');
        const cssFile = readdirSync(join(buildPath, 'css')).find(file => file.endsWith('.css'));
        const jsFile = readdirSync(join(buildPath, 'js')).filter(file => file.startsWith('main.') && file.endsWith('.js'))[0];

        if (!cssFile || !jsFile) {
            throw new Error('Could not find CSS or JS file in build directory');
        }

        const stylesUri = vscode.Uri.file(join(buildPath, 'css', cssFile)).with({ scheme: 'file' });
        const scriptUri = vscode.Uri.file(join(buildPath, 'js', jsFile)).with({ scheme: 'file' });
        const styles = webview.asWebviewUri(stylesUri);
        const script = webview.asWebviewUri(scriptUri);
        this._panel.webview.postMessage({ vscode })

        return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
            <meta name="theme-color" content="#000000">
            <link rel="stylesheet" type="text/css" href="${styles}">
            <title>Data Mapper View</title>
          </head>
          <body>
            <div id="root"></div>
            <script>
            const vscode = acquireVsCodeApi();
            </script>
            <script src="${script}"></script>
          </body>
        </html>
      `;
    }

    private _setWebviewMessageListener() {
        var registryFolderPath: vscode.Uri ;
        this._panel.webview.onDidReceiveMessage(
            (message: any) => {
                const command = message.command;
                switch (command) {
                    case "success_alert":
                        {
                            vscode.window.showInformationMessage(message.text);
                            break;
                        }
                    case "fail_alert":
                        {
                            vscode.window.showErrorMessage(message.text);
                            break;
                        }
                    case "fileUpload":
                        { 
                            datamapperFileUpload.handleFileUpload(registryFolderPath,message.fileContent, message.fileName, message.extension,
                                (message) => {
                                    this._panel.webview.postMessage(message);
                                });
                            break;
                        }
                    case "serializing":
                        {
                            datamapperSerialization.serializingDiagram(registryFolderPath,message.fileContent,message.name);
                            break;
                        }
                    case "DMC":
                        {
                            DMCFile.fileCreation(message.linkData,message.name);
                            break;
                        }
                    case "ProjectNaming":
                        {
                            const message = { command: 'naming', data: this._projectName };
                            this._panel.webview.postMessage(message);
                            break;
                        }
                    case "deserializing":
                        {
                            datamapperDeserialization.deserializingDiagram(message.name,registryFolderPath,(message) => {
                                this._panel.webview.postMessage(message);
                            })
                            break;
                        }
                    case "RegistryFolder":
                        {
                            registryFolderPath=registryProject.getRegistryFolder(this._registryName);
                            break;
                        }
                }
            },
            undefined,
            this._disposables
        );
    }
}
