import * as path from 'path';
import * as vscode from 'vscode';

export function renderer(context: vscode.ExtensionContext) {
    // Only allow a single Cat Coder
    let currentPanel: vscode.WebviewPanel | undefined = undefined;
  
    
        
          currentPanel = vscode.window.createWebviewPanel(
            'catCoding',
            'Cat Coding',
            vscode.ViewColumn.One,
            {
              enableScripts: true
            }
          );
          currentPanel.webview.html = getWebviewContent();
          currentPanel.onDidDispose(
            () => {
              currentPanel = undefined;
            },
            undefined,
            context.subscriptions
          );
        
  
    // Our new command
    context.subscriptions.push(
      vscode.commands.registerCommand('catCoding.doRefactor', () => {
        if (!currentPanel) {
          return;
        }
  
        // Send a message to our webview.
        // You can send any JSON serializable data.
        currentPanel.webview.postMessage({ command: 'refactor' });
      })
    );
  }
  
  function getWebviewContent() {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cat Coding</title>
  </head>
  <body>
      <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
      <h1 id="lines-of-code-counter">0</h1>
  
      <script>
          const counter = document.getElementById('lines-of-code-counter');
  
          let count = 0;
          setInterval(() => {
              counter.textContent = count++;
          }, 100);
  
          // Handle the message inside the webview
          window.addEventListener('message', event => {
  
              const message = event.data; // The JSON data our extension sent
  
              switch (message.command) {
                  case 'refactor':
                      count = Math.ceil(count * 0.5);
                      counter.textContent = count;
                      break;
              }
          });
      </script>
  </body>
  </html>`;
  }