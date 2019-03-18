// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { synapseTerminal } from "../mavenInternals/synapseTerminal";


export async function executeInTerminal(command: string, pomfile?: string, options?: {}): Promise<void> {
    let v = pomfile && vscode.workspace.getWorkspaceFolder(vscode.Uri.file(pomfile));

    if (typeof v !== "undefined" && v !== "") {
        const workspaceFolder: vscode.WorkspaceFolder = v;

        // const mvnString: string = wrappedWithQuotes(await mavenTerminal.formattedPathForTerminal(await getMaven(workspaceFolder)));

        const mvnString: string = "mvn";


        let w = pomfile && vscode.Uri.file(pomfile);
        if(typeof w !== "undefined" && w !== "") {
            const fullCommand: string = [
                mvnString,
                command.trim(),
                pomfile && `-f "${await synapseTerminal.formattedPathForTerminal(pomfile)}"`,
                ""
            ].filter(Boolean).join(" ");

            const name: string = workspaceFolder ? `Maven-${workspaceFolder.name}` : "Maven";
            await synapseTerminal.runInTerminal(fullCommand, Object.assign({ name }, options));

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
    await synapseTerminal.runInTerminal(fullCommand, Object.assign({ name }, options));
    
    
}




