import {ExtensionContext, Uri, Webview, WebviewOptions, WebviewPanelOptions} from "vscode";
import {join, sep} from "path";

const isDevMode = process.env.WEB_VIEW_WATCH_MODE === "true";

export interface WebViewOptions {
    jsFiles?: string[];
    cssFiles?: string[];
    body: string;
    scripts: string;
    styles: string;
    bodyCss?: string;
}

export function getCommonWebViewOptions(context: ExtensionContext): Partial<WebviewOptions & WebviewPanelOptions> {
    return {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
            Uri.file(join((context as ExtensionContext).extensionPath, 'resources', 'jslibs')),
            Uri.file(getWebViewResourceRoot(context)),
            Uri.file(getNodeModulesRoot(context))
        ],
    };
}

function getWebViewResourceRoot(context: ExtensionContext): string {
    return join((context as ExtensionContext).extensionPath,
        'resources');
}

function getExtensionPath(context: ExtensionContext): string {
    return join((context as ExtensionContext).extensionPath);
}

function getNodeModulesRoot(context: ExtensionContext): string {
    return join((context as ExtensionContext).extensionPath,
        'node_modules');
}

function getVSCodeResourceURI(filePath: string, webView: Webview): string {
    return webView.asWebviewUri(Uri.file(filePath)).toString();
}

export function getComposerWebViewOptions(context: ExtensionContext, componentName: string, webView: Webview, { disableComDebug = false, devHost = process.env.WEB_VIEW_DEV_HOST as string } = {}): Partial<WebViewOptions> {
    return {
        cssFiles: getComposerCSSFiles(context, disableComDebug, devHost, webView),
        jsFiles: getComposerJSFiles(context, componentName, disableComDebug, devHost, webView)
    };
}

function getComposerCSSFiles(context: ExtensionContext, disableComDebug: boolean, devHost: string, webView: Webview): string[] {
    const filePath = join((context as ExtensionContext).extensionPath, 'resources', 'jslibs', 'themes', 'ballerina-default.min.css');
    return [
        // webView.asWebviewUri(Uri.file(filePath)).toString()
        (isDevMode && !disableComDebug) ? join(devHost, 'themes', 'ballerina-default.min.css')
            : webView.asWebviewUri(Uri.file(filePath)).toString()
    ];
}

function getComposerJSFiles(context: ExtensionContext, componentName: string, disableComDebug: boolean, devHost: string, webView: Webview): string[] {
    const filePath = join((context as ExtensionContext).extensionPath, 'resources', 'jslibs') + sep + componentName + '.js';
    return [
        // webView.asWebviewUri(Uri.file(filePath)).toString()
        (isDevMode && !disableComDebug) ? join(devHost, componentName + '.js')
            : webView.asWebviewUri(Uri.file(filePath)).toString(),
        isDevMode ? 'http://localhost:8097' : '' // For React Dev Tools
    ];
}

export function getLibraryWebViewContent(context: ExtensionContext, options: WebViewOptions, webView: Webview, background: string ="#fff", padding: string="0px"): string {
    const {
        jsFiles,
        cssFiles,
        body,
        scripts,
        styles,
        bodyCss
    } = options;
    const externalScripts = jsFiles
        ? jsFiles.map(jsFile =>
            '<script charset="UTF-8" onload="loadedScript();" src="' + jsFile + '"></script>').join('\n')
        : '';
    const externalStyles = cssFiles
        ? cssFiles.map(cssFile =>
            '<link rel="stylesheet" type="text/css" href="' + cssFile + '" />').join('\n')
        : '';
    // const fontDir = join(getComposerURI(webView), 'font');

    // in windows fontdir path contains \ as separator. css does not like this.
    // const fontDirWithSeparatorReplaced = fontDir.split(sep).join("/");
    //
    // const isCodeServer = context.codeServerEnv;
    const resourceRoot = getVSCodeResourceURI(getWebViewResourceRoot(context), webView);

    return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                ${externalStyles}
                <style>
                    /* use this class for loader that are shown until the module js is loaded */
                    .root-loader {
                        position: absolute;
                        color: rgba(150, 150, 150, 0.5);
                        left: calc(50% - 20px);
                        top: calc(50% - 20px);
                    }
                    .loader {
                        border: 4px solid #bec5f5;
                        border-top: 4px solid #5463dc;
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        animation: spin 1s linear infinite;
                        margin: auto;
                        margin-top: 20%;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    html {
                        overflow: hidden;
                    }
                    ${styles}
                </style>
            </head>
            
            <body class="${bodyCss}" style="background: ${background}; padding: ${padding};">
                ${body}
                <script>
                    ${scripts}
                </script>
                <script charset="UTF-8" src="${(context as ExtensionContext).extensionPath}/node_modules/pako/dist/pako.min.js"></script>
                <script charset="UTF-8" src="${resourceRoot}/utils/messaging.js"></script>
                ${externalScripts}
            </body>
            </html>
        `;
}