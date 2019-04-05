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

'use strict';

import * as vscode from "vscode";
import { Settings } from "./Settings";
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

            let cdCommand = await getCDCommand(artifactId);
            const initCommand = getCommand(command + "; "+ cdCommand +"; code . -r;");
            this.terminals[name].sendText(initCommand, addNewLine);
        }
    }

    public closeAllTerminals(): void {
        Object.keys(this.terminals).forEach((id: string) => {
            this.terminals[id].dispose();
            delete this.terminals[id];
        });
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


