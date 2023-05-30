/*
Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { Terminal, window, Uri, commands } from "vscode";
import { ChildProcess, spawn } from "child_process";
import { CommandTypes, TerminalDetails } from "./terminalUtils";
import { Utils } from "../utils/Utils";

export namespace TerminalModule {

    let terminal: Terminal;

    /**
    * Create new Terminal in VS Code editor.
    */
    export function createTerminal() {
        if (!terminal) {
            terminal = window.createTerminal({ name: TerminalDetails.NAME });
        }
    }

    /**
    * Create new integration project using maven commands.
    */
    export function createIntegrationProject(command: string, projectRootDir: string, targetLocation: string) {

        createTerminal();
        terminal.show();

        runMavenCommand(command, CommandTypes.CREATE, targetLocation, projectRootDir);

    }

    /**
    * Build integration project using maven commands.
    */
    export function buildIntegrationProject(command: string, targetLocation: string) {

        createTerminal();
        terminal.show();

        runMavenCommand(command, CommandTypes.CREATE, targetLocation, undefined);

    }

    /**
    * Run a given maven command.
    */
    export function runMavenCommand(command: string, type: CommandTypes, targetLocation: string, projectRootDir?: string) {

        let childProcess: ChildProcess = spawn(command, [], { cwd: targetLocation, shell: true });

        // childProcess.stdout.on('data', (data) => {
        //     terminal.sendText(`echo ${data}`);
        // });
        //
        // childProcess.stderr.on('data', (data) => {
        //     terminal.sendText(`echo ${data}`);
        // });

        childProcess.on("exit", (code) => {
            if (code === 0) {
                window.showInformationMessage("Maven process successfully executed");
                if (type === CommandTypes.CREATE && projectRootDir) {
                    Utils.createVsCodeSettingsFile(projectRootDir);
                    terminal.sendText(`echo 'Maven process successfully executed.'`);
                    commands.executeCommand('vscode.openFolder', Uri.file(projectRootDir), true);
                }
            } else if (code === 1) {
                window.showInformationMessage("Maven process failed.");
                terminal.sendText(`echo 'Maven process failed.'`);
            }
        });;
    }

    /**
    * Print Log messages to the terminal.
    */
    export function printLogMessage(logMessage: string) {
        createTerminal();
        terminal.sendText(`echo "[Log] ${logMessage}"`);
    }

}
