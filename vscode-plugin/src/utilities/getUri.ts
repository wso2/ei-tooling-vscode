import { join } from "path";
import { Uri, Webview } from "vscode";

export function getUri(webview: Webview, extensionUri: string, pathList: string[]) {
  return webview.asWebviewUri(Uri.file(join(extensionUri, ...pathList)));
}
