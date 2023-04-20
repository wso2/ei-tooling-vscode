import * as vscode from "vscode";

export const outputChannel = vscode.window.createOutputChannel("Synapse");

// This function will log the value to the Ballerina output channel only if debug log is enabled
export function debug(value: string): void {
    const output = withNewLine(value);
    console.log(output);
    // if (logLevelDebug) {
        outputChannel.append(output);
    // }
}

function withNewLine(value: string) {
    if (typeof value === 'string' && !value.endsWith('\n')) {
        return value += '\n';
    }
    return value;
}