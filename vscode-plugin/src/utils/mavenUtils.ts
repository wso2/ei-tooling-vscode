// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { synapseTerminal } from "../mavenInternals/synapseTerminal";
import { Settings } from "../mavenInternals/Settings";
import * as fse from "fs-extra";
import * as path from "path";


export async function executeInTerminal(artifactId: string, command: string, pomfile?: string, options?: {}): Promise<void> {
    let pomFile = pomfile && vscode.workspace.getWorkspaceFolder(vscode.Uri.file(pomfile));

    if (typeof pomFile !== "undefined" && pomFile !== "") {
        const workspaceFolder: vscode.WorkspaceFolder = pomFile;

        const mvnString: string = wrappedWithQuotes(await synapseTerminal.formattedPathForTerminal(await getMaven(workspaceFolder)));

        // const mvnString: string = "mvn";

        let w = pomfile && vscode.Uri.file(pomfile);
        if(typeof w !== "undefined" && w !== "") {
            const fullCommand: string = [
                mvnString,
                command.trim(),
                pomfile && `-f "${await synapseTerminal.formattedPathForTerminal(pomfile)}"`,
                ""
            ].filter(Boolean).join(" ");

            const name: string = workspaceFolder ? `Maven-${workspaceFolder.name}` : "Maven";
            await synapseTerminal.runInTerminal(artifactId, fullCommand, Object.assign({ name }, options));

        }
        if (pomfile) {
            // await updateLRUCommands(command, pomfile);
        }
    }

    const mvnString: string = "mvn";
    const fullCommand: string = [
        mvnString,
        command.trim(),
        pomfile && `-f "${await synapseTerminal.formattedPathForTerminal(pomfile)}"`
    ].filter(Boolean).join(" ");

    const name: string = "Maven";
    await synapseTerminal.runInTerminal(artifactId, fullCommand, Object.assign({ name }, options));

}


export async function executeInTerminalNew(artifactId: string, command: string, pomfile?: string, options?: {}): Promise<void> {
    const mvnString: string = "mvn";
    const fullCommand: string = [
        mvnString,
        command.trim(),
        pomfile && `-f "${await synapseTerminal.formattedPathForTerminal(pomfile)}"`
    ].filter(Boolean).join(" ");

    const name: string = "Maven";
    await synapseTerminal.runInTerminal(artifactId, fullCommand, Object.assign({ name }, options));

}

async function getMaven(workspaceFolder?: vscode.WorkspaceFolder): Promise<string> {
    if (!workspaceFolder) {
        return Settings.Executable.path(null) || "mvn";
    }
    const executablePathInConf: string | undefined = Settings.Executable.path(workspaceFolder.uri);
    const preferMavenWrapper: boolean | undefined= Settings.Executable.preferMavenWrapper(workspaceFolder.uri);
    if (!executablePathInConf) {
        const mvnwPathWithoutExt: string = path.join(workspaceFolder.uri.fsPath, "mvnw");
        if (preferMavenWrapper && await fse.pathExists(mvnwPathWithoutExt)) {
            return mvnwPathWithoutExt;
        } else {
            return "mvn";
        }
    } else {
        return path.resolve(workspaceFolder.uri.fsPath, executablePathInConf);
    }
}

function wrappedWithQuotes(mvn: string): string {
    if (mvn === "mvn") {
        return mvn;
    } else {
        return `"${mvn}"`;
    }
}