/*
Copyright (c) 2023, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 LLC. licenses this file to you under the Apache License,
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
import * as vscode from 'vscode';
import { Disposable, Uri } from "vscode";
import { getNonce } from "../../utils/uiUtils";
import { join } from "path";
import { readdirSync } from "fs";
import { Utils } from '../../utils/Utils';

export class GettingStarted implements vscode.WebviewViewProvider {


    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this.view = webviewView;

        console.log('hellooo  '+this._extensionPath);
        webviewView.webview.options = {
            // Allow scripts in the webview
            localResourceRoots: [vscode.Uri.file(this._extensionPath)],
            enableScripts: true,
        };

        webviewView.webview.html = this._getWebviewContent(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.command) {
                case "ShowNewIntegrationWizard":
                    {
                        void vscode.commands.executeCommand('CreateNewIntegrationProjectPage');
                        break;
                    }
                case "ShowNewDataServiceWizard":
                    {
                        void vscode.commands.executeCommand('wso2ei.dataservice.create.project');
                        break;
                    }
                case "ShowNewDataSourceWizard":
                    {
                        void vscode.commands.executeCommand('wso2ei.dataservice.create.service');
                        break;
                    }
                case "ShowNewMediatorWizard":
                    {
                        void vscode.commands.executeCommand('wso2ei.mediatorproject.create.project');
                        break;
                    }
                case "ShowSampleWizard":
                        {
                            void vscode.commands.executeCommand('CreateNewSamplePage');
                            break;
                        }
                default:
                    break;
            }
            // Reload the html content due to bug
            webviewView.webview.html = this._getWebviewContent(webviewView.webview);
        });

        // check for workspace settings
        Utils.setNewWorkspaceIfnotExists();
    }

    public static currentPanel: GettingStarted | undefined;
    private _disposables: Disposable[] = [];
    private readonly _extensionPath: string;
    public static readonly viewType = 'GettingStarted';

    public view?: vscode.WebviewView;

    constructor(extensionPath: string) {
        this._extensionPath = extensionPath;
    }

    private _getWebviewContent(webview: vscode.Webview) {
        const buildPath = join(this._extensionPath, 'out', 'static');

        const cssFile = readdirSync(join(buildPath, 'css')).find(file => file.endsWith('.css'));
        const jsFile = readdirSync(join(buildPath, 'js')).filter(file => file.startsWith('main.') && file.endsWith('.js'))[0];

        if (!cssFile || !jsFile) {
            throw new Error('Could not find CSS or JS file in build directory');
        }

        const stylesUri = vscode.Uri.file(join(buildPath, 'css', cssFile)).with({ scheme: 'file' });
        const scriptUri = vscode.Uri.file(join(buildPath, 'js', jsFile)).with({ scheme: 'file' });

        const styles = webview.asWebviewUri(stylesUri);
        const script = webview.asWebviewUri(scriptUri);
        const nonce = getNonce();

        var currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        var theme: string;
        String(currentTheme).includes('Dark') ? theme = 'dark' : theme = 'light';

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
                <meta name="theme-color" content="#000000">
                <link rel="stylesheet" type="text/css" href="${styles}">
                <title>New Integration Wizard</title>
            </head>
            <body>
                <noscript>You need to enable JavaScript to run this app.</noscript>
                <div id="root"></div>
                <script>
                    const vscodeReference = acquireVsCodeApi();
                    const pageName = "GettingStarted";
                    const themeColour = "${theme}";
                </script>
                <script nonce="${nonce}" src="${script}"></script>
            </body>
            </html>
        `;
    }


    public dispose() {
        GettingStarted.currentPanel = undefined;
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    public themeChanged(theme: string) {
        
    }
   
}

