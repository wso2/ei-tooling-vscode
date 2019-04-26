/*
Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the "License"); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import {mavenOutputChannel} from "./mavenOutputChannel";
import {Settings} from "./Settings";
import {executeCommand} from "../utils/cpUtils";
import {ArchetypeModule} from "../archetype/ArchetypeModule";
import {Runner} from "./mavenRunner";
import * as path from 'path';

export async function executeCommandHandler(newProject: ArchetypeModule.ESBProject, targetLocation: string) {
    let commandRunner: Runner = new Runner();
    await getCDCommand(targetLocation).then((cdCommand) => {
        let cmd = cdCommand + " && " + getMavenGenerateCommand(newProject);
        const projectRootDir: string = path.join(targetLocation, newProject.artifactId);

        commandRunner.runCommand(cmd, [], projectRootDir, targetLocation);
    });
}

function getMavenGenerateCommand(newProject: ArchetypeModule.ESBProject): string {
    return [
        "mvn",
        "archetype:generate",
        `-DarchetypeArtifactId=${newProject.archetypeArtifactId}`,
        `-DarchetypeGroupId=${newProject.archetypeGroupId}`,
        `-DgroupId=${newProject.groupId}`,
        `-DartifactId=${newProject.artifactId}`,
        `-DinteractiveMode=false`,
        `-DarchetypeCatalog=internal`
    ].join(" ");
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

export function currentWindowsShell(): string | undefined {
    const currentWindowsShellPath: string | undefined = Settings.External.defaultWindowsShell();
    if (typeof currentWindowsShellPath !== "undefined") {
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
        return (await executeCommand("wsl", ["wslpath", "-u", `"${path.replace(
            /\\/g, "/")}"`])).trim();
    } catch (error) {
        mavenOutputChannel.appendLine(error, "WSL");
        return toDefaultWslPath(path);
    }
}

// export async function toWinPath(path: string): Promise<string> {
//     return (await executeCommand("wsl", ["wslpath", "-w", `"${path}"`])).trim();
// }
