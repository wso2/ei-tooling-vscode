import { ChildProcess, spawn } from "child_process";
import { window } from "vscode";
import { mavenOutputChannel } from "./mavenOutputChannel";
import {promptOpenFolder} from "../project";

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
                    promptOpenFolder(cwd);
                }
            }else if(code === 1) {
                window.showInformationMessage("maven failed");
                
            }
        });
    }
}