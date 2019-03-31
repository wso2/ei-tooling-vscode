// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { mavenOutputChannel } from "./mavenOutputChannel";
import { Settings } from "./Settings";
import { executeCommand } from "../utils/cpUtils";
import { Uri} from "vscode";
import * as cp from 'child_process';
import * as path from 'path';
import { ArchetypeModule } from "../archetype/ArchetypeModule";
import * as fse from "fs-extra";

interface ITerminalOptions {
    addNewLine?: boolean;
    name?: string;
    cwd?: string;
}

class SynapseTerminal implements vscode.Disposable {
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

            let cdCommand = await getCDCommand(artifactId);
            // const initCommand = getCommand(command);
            let sourcePath = path.join(__dirname, "..", "..", "temp", "out.txt");
            let destinationPath = path.join(__dirname, "..", "..", "temp", "output.txt");
            const initCommand = getCommand(command + " | tee "+ sourcePath +"; mv " + sourcePath + " " + destinationPath);
            // const initCommand = getCommand(command + "; "+ cdCommand +"; code . -r;");
            this.terminals[name].sendText(initCommand, addNewLine);

            // var fs = require('fs');
            // let result = false;

            // while(!result) {
            //     try {
            //         if (fs.existsSync(destinationPath)) {
            //             result = true;
            //             vscode.window.showInformationMessage("file exists");
            //         //file exists
            //         }
            //     } catch(err) {
            //         result = false;
            //         console.error(err);
            //     }
            // }

        }

        // await this.openNewWindow(cwd);
    }

    public async openNewWindow(cwd: string | undefined): Promise<void> {
        if(cwd) {
            let uri = Uri.parse(cwd);
            let success = vscode.commands.executeCommand('vscode.openFolder', uri, vscode.window);

            // vscode.workspace.updateWorkspaceFolders(0, 0, {uri: uri});
        }
    }

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

export function getCommand(cmd: string): string {
    if (process.platform === "win32") {
        switch (currentWindowsShell()) {
            case "PowerShell":
                return `cmd /c ${cmd}`; // PowerShell
            default:
                return cmd; // others, try using common one.
        }
    } else {
        return cmd;
    }
}

export async function getCDCommand(cwd: string): Promise<string> {
    if (process.platform === "win32") {
        switch (currentWindowsShell()) {
            case "Git Bash":
                return `cd "${cwd.replace(/\\+$/, "")}"`; // Git Bash: remove trailing '\'
            case "PowerShell":
                return `cd "${cwd}"`; // PowerShell
            case "Command Prompt":
                return `cd /d "${cwd}"`; // CMD
            case "WSL Bash":
                return `cd "${await toWslPath(cwd)}"`; // WSL
            default:
                return `cd "${cwd}"`; // Unknown, try using common one.
        }
    } else {
        return `cd "${cwd}"`;
    }
}

function currentWindowsShell(): string | undefined {
    const currentWindowsShellPath: string | undefined = Settings.External.defaultWindowsShell();
    if(typeof currentWindowsShellPath !== "undefined") {
        if (currentWindowsShellPath.endsWith("cmd.exe")) {
            return "Command Prompt";
        } else if (currentWindowsShellPath.endsWith("powershell.exe")) {
            return "PowerShell";
        } else if (currentWindowsShellPath.endsWith("bash.exe") || currentWindowsShellPath.endsWith("wsl.exe")) {
            if (currentWindowsShellPath.includes("Git")) {
                return "Git Bash";
            }
            return "WSL Bash";
        } else {
            return "Others";
        }
    }
    
}

function toDefaultWslPath(p: string): string {
    const arr: string[] = p.split(":\\");
    if (arr.length === 2) {
        const drive: string = arr[0].toLowerCase();
        const dir: string = arr[1].replace(/\\/g, "/");
        return `/mnt/${drive}/${dir}`;
    } else {
        return p.replace(/\\/g, "/");
    }
}

export async function toWslPath(path: string): Promise<string> {
    try {
        return (await executeCommand("wsl", ["wslpath", "-u", `"${path.replace(/\\/g, "/")}"`])).trim();
    } catch (error) {
        mavenOutputChannel.appendLine(error, "WSL");
        return toDefaultWslPath(path);
    }
}

export async function toWinPath(path: string): Promise<string> {
    return (await executeCommand("wsl", ["wslpath", "-w", `"${path}"`])).trim();
}

export const synapseTerminal: SynapseTerminal = new SynapseTerminal();

function promptOpenFolder(path: string) {
    if (vscode.workspace.workspaceFolders) {
        const folder = vscode.workspace.workspaceFolders.find((folder) => {
            return folder.uri.fsPath === path;
        });
        if (folder) {
			vscode.window.showInformationMessage("correct");
            return;
        }
    }
    const action = "Open Project";
    vscode.window.showInformationMessage("File resides within a Ballerina project at " +
        path, action)
        .then((selection) => {
            if (selection === action) {
                vscode.workspace.updateWorkspaceFolders(0, 0, { uri: Uri.file(path)});
            }
        });
}

async function createBashScript(commands: Commands) {
    let commandArray = commands.commands.join(";\n");
}

import { Runner } from "../mavenInternals/mavenRunner";

async function executeCommandHandlerOld(newProject: ArchetypeModule.ESBProject, cwd: string): Promise<string> {
    // let mavenRunner: Runner = new Runner();
    // const args: string[] = [
    //     "archetype:generate",
    //     `-DarchetypeArtifactId="${newProject.archetypeArtifactId}"`,
    //     `-DarchetypeGroupId="${newProject.archetypeGroupId}"`,
    //     `-DgroupId="${newProject.groupId}"`,
    //     `-DartifactId="${newProject.artifactId}"`,
    //     `-DinteractiveMode=false`
    // ];
    // if(cwd) {
    //     mavenRunner.runCommand("mvn", args, cwd, newProject.artifactId);
    // }

    const cdCommand = await getCDCommand(cwd);
    const mavenCommand = createMavenGenerateCommandArgs(newProject);

    let commands: Commands = {commands: [cdCommand, mavenCommand]};
    let command: string = getFullCommand(commands);
    return command;
}

function createMavenGenerateCommandArgs(newProject: ArchetypeModule.ESBProject): string {
    const mavenCommand: string = [
        "archetype:generate",
        `-DarchetypeArtifactId="${newProject.archetypeArtifactId}"`,
        `-DarchetypeGroupId="${newProject.archetypeGroupId}"`,
        `-DgroupId="${newProject.groupId}"`,
        `-DartifactId="${newProject.artifactId}"`,
        `-DinteractiveMode=false`
    ].join(" ");

    return mavenCommand;
}

interface Commands{
    commands: string[];
}


function getFullCommand(commands: Commands): string {
    let commandArray = commands.commands.join(";\n");
    return commandArray;

}