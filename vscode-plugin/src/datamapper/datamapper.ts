import { Disposable, Webview, WebviewPanel, window, ViewColumn } from "vscode";


export default class dataMapper {
    public static currentPanel: dataMapper | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];

    private constructor(panel: WebviewPanel) {
        this._panel = panel;

        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this._panel.onDidDispose(this.dispose, null, this._disposables);

        // Set the HTML content for the webview panel
        this._panel.webview.html = this._getWebviewContent(this._panel.webview);

        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this._panel.webview);

        //refreshing the webview
        this._panel.webview.postMessage({type : 'refresh'});
    }

    public static render() {
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

            dataMapper.currentPanel = new dataMapper(panel);
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

    private _getWebviewContent(webview: Webview) {

        // const stylePathArray = ["webview-ui", "build", "assets", "index.css"];

        // const stylesUri = webview.asWebviewUri(Uri.joinPath(extensionUri, ...stylePathArray));

        // // The CSS file from the React build output
        // const stylesUri = getUri(webview, extensionUri, [
        //   "webview-ui",
        //   "build",
        //   "static",
        //   "css",
        //   "main.css",
        // ]);
        // The JS file from the React build output
        // const scriptUri = getUri(webview, extensionUri, [
        //   "webview-ui",
        //   "build",
        //   "static",
        //   "js",
        //   "main.js",
        // ]);

        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
            <meta name="theme-color" content="#000000">
            <link rel="stylesheet" type="text/css" href="https://file%2B.vscode-resource.vscode-cdn.net/c%3A/Hana/Projects/DataMapper/ei-tooling-vscode/vscode-plugin/webviews/build/static/css/main.073c9b0a.css">
            <title>Data Mapper View</title>
          </head>
          <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root"></div>
            <script src="https://file%2B.vscode-resource.vscode-cdn.net/c%3A/Hana/Projects/DataMapper/ei-tooling-vscode/vscode-plugin/webviews/build/static/js/main.8950bcf9.js"></script>
          </body>
        </html>
      `;
    }

    private _setWebviewMessageListener(webview: Webview) {
        webview.onDidReceiveMessage(
            (message: any) => {
                const command = message.command;
                const text = message.text;

                switch (command) {
                    case "hello":
                        // Code that should run in response to the hello message command
                        {
                            window.showInformationMessage(text);
                            break;
                        }
                    // case "reload": {
                    //     webview.html = this._getWebviewContent(this._panel.webview);
                    //     break;
                    // }

                        return;
                    // Add more switch case statements here as more webview message commands
                    // are created within the webview context (i.e. inside media/main.js)
                }
            },
            undefined,
            this._disposables
        );
    }
}
