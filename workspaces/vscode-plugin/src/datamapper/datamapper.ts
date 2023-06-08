import { readFile, readdirSync } from "fs";
import { join, dirname } from "path";
import { Disposable, WebviewPanel, window, ViewColumn, Uri, workspace } from "vscode";
import * as vscode from 'vscode';
import DMCFile from "./DMCFileGenerator";
import datamapperFileUpload from "./datamapperFileUpload";


export default class dataMapper {
    public static currentPanel: dataMapper | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];
    private readonly _extensionPath: string;

    private constructor(panel: WebviewPanel, extensionPath: string) {
        this._panel = panel;
        this._extensionPath = extensionPath;

        // Set an event listener to listen for when the panel is disposed 
        this._panel.onDidDispose(this.dispose, null, this._disposables);

        // Set the HTML content for the webview panel
        this._panel.webview.html = this._getWebviewContent(this._panel.webview);

        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener();

        //refreshing the webview
        this._panel.webview.postMessage({ type: 'refresh' });
    }

    public static render(extensionPath: string) {
        if (dataMapper.currentPanel) {
            // If the webview panel already exists reveal it
            dataMapper.currentPanel._panel.reveal(ViewColumn.One);
        } else {
            // If a webview panel does not already exist create and show a new one
            const panel = window.createWebviewPanel(
                // Panel view type
                "OpenDataMapperView",
                // Panel title
                "Data Mapper View",
                // The editor column the panel should be displayed in
                ViewColumn.One,
                // Extra panel configurations
                {
                    // Enable JavaScript in the webview
                    enableScripts: true,
                }
            );

            dataMapper.currentPanel = new dataMapper(panel, extensionPath);
        }
    }

    public dispose() {
        dataMapper.currentPanel = undefined;

        // Dispose of the current webview panel
        this._panel.dispose();

        // Dispose of all disposables (i.e. commands) for the current webview panel
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _getWebviewContent(webview: any) {

        //settting the path of build files
        const buildPath = join(this._extensionPath, 'datamapper', 'build', 'static');

        const cssFile = readdirSync(join(buildPath, 'css')).find(file => file.endsWith('.css'));
        const jsFile = readdirSync(join(buildPath, 'js')).filter(file => file.startsWith('main.') && file.endsWith('.js'))[0];

        if (!cssFile || !jsFile) {
            throw new Error('Could not find CSS or JS file in build directory');
        }

        const stylesUri = Uri.file(join(buildPath, 'css', cssFile)).with({ scheme: 'file' });
        const scriptUri = Uri.file(join(buildPath, 'js', jsFile)).with({ scheme: 'file' });

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
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root"></div>
            <script>
            // connection point of extension with react frontend
            const vscode = acquireVsCodeApi();
            window.onload = function() {
                vscode.postMessage({ command: 'success_alert' });
                console.log('Ready to accept data.');
            };
            </script>
            <script src="${script}"></script>
          </body>
        </html>
      `;
    }

    private _setWebviewMessageListener() {
        this._panel.webview.onDidReceiveMessage(
            (message: any) => {
                const command = message.command;
                switch (command) {
                    case "success_alert":
                        {
                            window.showInformationMessage(message.text);
                            break;
                        }
                    case "fail_alert":
                        {
                            window.showErrorMessage(message.text);
                            break;
                        }
                    case "fileUpload":
                        {
                            datamapperFileUpload.handleFileUpload(message.fileContent, message.fileName, message.extension,
                                (message) => {
                                    this._panel.webview.postMessage(message);
                                });
                            break;
                        }
                    case "serializing":
                        {
                            datamapperFileUpload.serializingDiagram(message.fileContent);
                            break;
                        }
                    case "DMC": {
                        DMCFile.fileCreation(message.linkData);
                        break;
                    }
                    case "deserializing": {
                        var currentFolder = workspace.workspaceFolders?.[0];
                        if (currentFolder) {
                            var filePath = join(currentFolder.uri.fsPath, "data.json");
                            readFile(filePath, 'utf8', (err, data) => {
                                if (err) {
                                    window.showErrorMessage(`Unable to read file: ${err.message}`);
                                    return;
                                }

                                const message = { command: 'serialized', data: data };
                                this._panel.webview.postMessage(message);
                            });
                        }
                    }
                        return;
                }
            },
            undefined,
            this._disposables
        );

    }
}
