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

import { ChildProcess, spawn } from "child_process";
import { commands, Uri, window } from "vscode";
import { mavenOutputChannel } from "./mavenOutputChannel";

export class Runner {

    private _process: ChildProcess | undefined;
    private readonly CreateProject: string = "CreateProject";
    private readonly BuildProject: string = "BuildProject";

    public runCommand(goal: string, command: string, args: string[], nwd?: string, cwd?: string) {
        mavenOutputChannel.clear();
        mavenOutputChannel.show();

        this._process = spawn(command, args, { cwd: cwd, shell: true });

        this._process.stdout.on('data', (data) => {
            mavenOutputChannel.append(data.toString());
        });

        this._process.stderr.on('data', (data) => {
            mavenOutputChannel.append(data.toString());
        });

        this._process.on("exit", (code) => {
            if (code === 0) {
                window.showInformationMessage("Maven process successfully executed");
                if (nwd && goal === this.CreateProject) {
                    commands.executeCommand('vscode.openFolder', Uri.file(nwd), true);
                }
            } else if (code === 1) {
                window.showInformationMessage("Maven process failed.");
            }
        });
    }

    public runProjectBuildCommand(command: string, cwd?: string) {
        this.runCommand(this.BuildProject, command, [], undefined, cwd);
    }

    public runProjectCreateCommand(command: string, args: string[], nwd?: string, cwd?: string) {
        this.runCommand(this.CreateProject, command, args, nwd, cwd);
    }
}
