
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
import { ArchetypeModule } from "../../archetype/ArchetypeModule";
import { join } from "path";
import { readdirSync } from "fs";
import { getNonce } from "../../utils/uiUtils";
import * as vscode from 'vscode';
import { sampleUtils } from "../../utils/sampleUtils";

/**
 * This class handles the new integration wizard web form.
 */
export class SampleWizard {
    private _workspaceFolders: string[] = [];
    public static currentPanel: SampleWizard | undefined;
    public readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];
    private readonly _extensionPath: string;

    private constructor(panel: vscode.WebviewPanel, extensionPath: string, workspaceFolders: string[]) {
        this._workspaceFolders = workspaceFolders;
        this._panel = panel;
        this._extensionPath = extensionPath;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getWebviewContent(this._panel.webview);
        this._setWebviewMessageListener(this._panel.webview);
    }

    /**
     * Renders the current webview panel if it exists otherwise a new webview panel
     * will be created and displayed.
     *
     * @param extensionUri The URI of the directory containing the extension.
     */
    public static render(extensionPath: string, workspaceFolders: string[]) {
        if (SampleWizard.currentPanel) {
            // If the webview panel already exists reveal it
            SampleWizard.currentPanel._panel.reveal(vscode.ViewColumn.One);
        } else {
            // If a webview panel does not already exist create and show a new one
            const panel = vscode.window.createWebviewPanel(
                "showHelloWorld",
                "Sample Wizard",
                vscode.ViewColumn.One,
                {
                    localResourceRoots: [vscode.Uri.file(extensionPath)],
                    enableScripts: true,
                }
            );
            SampleWizard.currentPanel = new SampleWizard(panel, extensionPath, workspaceFolders);
        }
    }

    /**
     * Cleans up and disposes of webview resources when the webview panel is closed.
     */
    public dispose() {
        SampleWizard.currentPanel = undefined;

        // Dispose of the current webview panel
        this._panel.dispose();

        // Dispose of all disposables (i.e. commands) associated with the current webview panel
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
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
        const resources = webview.asWebviewUri(vscode.Uri.file(join(this._extensionPath, 'resources')));

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
                <title>Sample Wizard</title>
            </head>
            <body>
                <noscript>You need to enable JavaScript to run this app.</noscript>
                <div id="root"></div>
                <script>
                    const vscodeReference = acquireVsCodeApi();
                    const pageName = "SampleWizard";
                    const resourcesPath = "${resources}";
                    const themeColour = "${theme}";
                    const workspaceFolders = "${this._workspaceFolders}";
                </script>
                <script nonce="${nonce}" src="${script}"></script>
            </body>
            </html>
        `;
    }


    /**
     * Sets up an event listener to listen for messages passed from the webview context and
     * executes code based on the message that is recieved.
     *
     * @param webview A reference to the extension webview
     */
    private _setWebviewMessageListener(webview: vscode.Webview) {
        webview.onDidReceiveMessage(
            (message: any) => {
                const command = message.command;

                switch (command) {
                    case "CreateNewSample":
                        {
                            sampleUtils.createSample(message.SampleType, message.SampleName);
                            vscode.commands.executeCommand('workbench.view.explorer');
                            this.dispose();
                            return;
                        }
                    case "WorkspaceChanged": {
                        this._workspaceFolders = message.data;
                        return;
                    }
                }
            },
            undefined,
            this._disposables
        );
    }


}