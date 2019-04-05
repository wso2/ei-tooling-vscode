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
import { window, Uri, commands } from "vscode";
import { mavenOutputChannel } from "./mavenOutputChannel";

export class Runner { 
    
	private _process : ChildProcess | undefined;
	
    public runCommand(command: string, args: string[], cwd?: string, oldCwd?: string) {
        mavenOutputChannel.clear();
        mavenOutputChannel.show();
        
        this._process = spawn(command, args, {cwd: oldCwd, shell: true});
        
        this._process.stdout.on('data', (data) => {
            mavenOutputChannel.append(data.toString());
        });
        
        this._process.stderr.on('data', (data) => {
            mavenOutputChannel.append(data.toString());
        });

        this._process.on("exit",(code, signal)=>{
            if(code === 0) {
                if(cwd) {
                    window.showInformationMessage("maven success");
                    commands.executeCommand('vscode.openFolder', Uri.file(cwd), true);
                }
            }else if(code === 1) {
                window.showInformationMessage("maven failed: " + signal);
                
            }
        });
    }
}