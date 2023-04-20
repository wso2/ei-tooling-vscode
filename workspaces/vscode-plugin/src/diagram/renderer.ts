import {ExtensionContext, Uri, Webview, workspace} from "vscode";
import {getComposerWebViewOptions, getLibraryWebViewContent, WebViewOptions} from "../utils/webview-utils";
// import {getComposerWebViewOptions, getLibraryWebViewContent, WebViewOptions} from "../utils/webview-utils";
import {DiagramFocus} from "./model";

export function render(
    context: ExtensionContext, filePath: Uri, startLine: number, startColumn: number,
    webView: Webview, diagramFocus?: DiagramFocus): string {

    return renderDiagram(context, filePath, startLine, startColumn, webView, diagramFocus);
}

function renderDiagram(
    context: ExtensionContext, filePath: Uri, startLine: number, startColumn: number,
    webView: Webview, diagramFocus?: DiagramFocus): string {
    console.log('workspace name', workspace.name);
    const body = `
        <div class="ballerina-editor design-view-container" id="diagram"><div class="loader" /></div>
    `;

    const bodyCss = "diagram";

    const styles = `
        body {
            background: #f1f1f1;
        }
        .overlay {
            display: none;
        }
        .drop-zone.rect {
            fill-opacity: 0;
        }
        #diagram {
            height: 100%;
            display: inline-block;
            width: 100%;
            background-color: #f8f9fb;
        }
        #errors {
            display: table;
            width: 100%;
            height: 100%;
        }
        #errors span { 
            display: table-cell;
            vertical-align: middle;
            text-align: center;
        }
        #warning {
            position: absolute;
            top: 15px;
            position: absolute;
            overflow: hidden;
            height: 25px;
            vertical-align: bottom;
            text-align: center;
            color: rgb(255, 90, 30);
            width: 100%;
        }
        #warning p {
            line-height: 25px;
        }
        .loader {
            border: 3px solid #edf0ff;
            border-top: 3px solid #5463dc;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            animation: spin 1s linear infinite;
            margin: auto;
            margin-top: 38%;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    let ballerinaFilePath = diagramFocus?.fileUri;

    const scripts = `
        function loadedScript() {
            window.langclient = getLangClient();
            function gotoSource(filePath, position) {
                return new Promise((resolve, _reject) => {
                    webViewRPCHandler.invokeRemoteMethod(
                        'gotoSource',
                        [filePath, position],
                        (response) => {
                            resolve(response);
                        }
                    );
                })
            }
            function getFileContent(url) {
                return new Promise((resolve, _reject) => {
                    webViewRPCHandler.invokeRemoteMethod(
                        'getFileContent',
                        [url],
                        (resp) => {
                            resolve(resp);
                        }
                    );
                })
            }
            function updateFileContent(url, content, skipForceSave) {
                return new Promise((resolve, _reject) => {
                    webViewRPCHandler.invokeRemoteMethod(
                        'updateFileContent',
                        [url, content, skipForceSave],
                        (resp) => {
                            resolve(resp);
                        }
                    );
                })
            }
            function drawDiagram({
                filePath,
                startLine,
                startColumn,
                lastUpdatedAt,
                projectPaths,
                diagramFocus,
                workspaceName
            }) {
                try {
                    const options = {
                        target: document.getElementById("diagram"),
                        editorProps: {
                            langClientPromise: Promise.resolve(getLangClient()),
                            filePath,
                            lastUpdatedAt,
                            getFileContent,
                            updateFileContent,
                            gotoSource
                        }
                    };
                    console.log("SLCEditor");
                    console.log(SLCEditor);
                    SLCEditor.renderDiagramEditor(options);
                } catch(e) {
                    if (e.message === 'ballerinaComposer is not defined') {
                        drawLoading();
                        return;
                    }
                    console.log(e.stack);
                    drawError('Oops. Something went wrong. ' + e.message);
                }
            }
            function drawError(message) {
                document.getElementById("diagram").innerHTML = \`
                <div id="errors">
                    <span>\$\{message\}</span>
                </div>
                \`;
            }
            function drawLoading() {
                document.getElementById("diagram").innerHTML = \`
                <div class="loader"></div>
                \`;
            }
            webViewRPCHandler.addMethod("updateDiagram", (args) => {
                drawDiagram({
                    filePath: args[0].filePath,
                    startLine: args[0].startLine,
                    startColumn: args[0].startColumn,
                    lastUpdatedAt: (new Date()).toISOString(),
                    projectPaths: ${JSON.stringify(workspace.workspaceFolders)},
                    diagramFocus: args[0].filePath ? {
                        filePath: args[0].filePath,
                        position: args[0].openInDiagram
                    }: undefined,
                    workspaceName: ${JSON.stringify(workspace.name)}
                });
                return Promise.resolve({});
            });
            drawDiagram({
                filePath: ${JSON.stringify(ballerinaFilePath)},
                startLine: ${startLine},
                startColumn: ${startColumn},
                lastUpdatedAt: (new Date()).toISOString(),
                projectPaths: ${JSON.stringify(workspace.workspaceFolders)},
                diagramFocus: ${
                    diagramFocus ?
                        `{
                            filePath: ${JSON.stringify(ballerinaFilePath)}
                        }`
                    : `undefined`
                },
                workspaceName: ${JSON.stringify(workspace.name)}
            });
        }
    `;

    const webViewOptions: WebViewOptions = {...getComposerWebViewOptions(context, "SLCEditor", webView), body, scripts, styles, bodyCss};
    // const webViewOptions: WebViewOptions = {body, scripts, styles, bodyCss};

    return getLibraryWebViewContent(context, webViewOptions, webView);

}
export function renderError() {
    return `
    <!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
    <div>
        Could not connect to the parser service. Please try again after restarting vscode.
        <a href="command:workbench.action.reloadWindow">Restart</a>
    </div>
    </body>
    </html>
    `;
}