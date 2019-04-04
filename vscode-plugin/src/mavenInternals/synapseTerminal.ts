'use strict';

import * as vscode from "vscode";
import { Settings } from "./Settings";
import { Uri} from "vscode";
import * as path from 'path';
import { getCDCommand, getCommand, currentWindowsShell, toWslPath} from "./commandHandler";

interface ITerminalOptions {
    addNewLine?: boolean;
    name?: string;
    cwd?: string;
}

export class SynapseTerminal implements vscode.Disposable {
    private readonly terminals: { [id: string]: vscode.Terminal } = {};

    public async runInTerminal(artifactId:string, command: string, options?: ITerminalOptions): Promise<void> {
        const defaultOptions: ITerminalOptions = { addNewLine: true, name: "Maven" };
        const { addNewLine, name, cwd } = Object.assign(defaultOptions, options);


        if(typeof name !== "undefined") {
            if (this.terminals[name] === undefined) {
                const env: {[envKey: string]: string} = Settings.getEnvironment();
                this.terminals[name] = vscode.window.createTerminal({ name, env });
            }
            this.terminals[name].show();
            if (cwd) {
                this.terminals[name].sendText(await getCDCommand(cwd), true);
            }

            // let cdCommand = await getCDCommand(artifactId);
            // const initCommand = getCommand(command);
            let sourcePath = path.join(__dirname, "..", "..", "temp", "out.txt");
            let destinationPath = path.join(__dirname, "..", "..", "temp", "output.txt");
            const initCommand = getCommand(command + " | tee "+ sourcePath +"; mv " + sourcePath + " " + destinationPath);
            // const initCommand = getCommand(command + "; "+ cdCommand +"; code . -r;");
            this.terminals[name].sendText(initCommand, addNewLine);
        }

        // await this.openNewWindow(cwd);
    }

    // public async openNewWindow(cwd: string | undefined): Promise<void> {
    //     if(cwd) {
    //         let uri = Uri.parse(cwd);
    //         let success = vscode.commands.executeCommand('vscode.openFolder', uri);
    //     }
    // }

    public closeAllTerminals(): void {
        Object.keys(this.terminals).forEach((id: string) => {
            this.terminals[id].dispose();
            delete this.terminals[id];
        });
    }

    public onDidCloseTerminal(closedTerminal: vscode.Terminal): void {
        try {
            delete this.terminals[closedTerminal.name];
        } catch (error) {
            // ignore it.
        }
    }

    // To Refactor: remove from here.
    public async formattedPathForTerminal(filepath: string): Promise<string> {
        if (process.platform === "win32") {
            switch (currentWindowsShell()) {
                case "WSL Bash":
                    return await toWslPath(filepath);
                default:
                    return filepath;
            }
        } else {
            return filepath;
        }
    }

    public dispose(): void {
        this.closeAllTerminals();
    }
}


