'use strict';

import {Uri, window, workspace, WorkspaceEdit, WorkspaceFolder} from "vscode";
import * as fse from "fs-extra";
import * as path from 'path';

export namespace ArtifactModule {
    
    export async function createTemplate(targetFolder: string, sourceFile: string, destinationFile: string) {

        //first need to check whether there are multiple workspaces opened
        if(workspace.workspaceFolders) {
            let workspaces: number | undefined = workspace.workspaceFolders.length;
            
            if(workspaces === 0) {
                window.showErrorMessage("Make sure that you have opened a Synapse Project");

            }else if(workspaces === 1) {
                let synapseWorkspace: WorkspaceFolder =  workspace.workspaceFolders[0];

                const path1 = synapseWorkspace.uri.path + "/src/main/synapse-config/" + targetFolder;
                let pathToDestination = synapseWorkspace.uri.path + "/src/main/synapse-config/" + targetFolder + "/" + destinationFile + ".xml";
                let targetFileUri = resolveUri(pathToDestination);

                checkPathExistence(path1).then(result => {
                    if(!result) {
                        const path2 = synapseWorkspace.uri.path + "/synapse-config" + targetFolder;
                        pathToDestination = synapseWorkspace.uri.path + "/synapse-config/" + targetFolder + "/" + destinationFile + ".xml";
                        targetFileUri = resolveUri(pathToDestination);

                        checkPathExistence(path2).then(result => {
                            if(!result) {
                                window.showErrorMessage("Make sure that you have opened a Synapse Project");
                            }else {
                                if(checkPathExistence(pathToDestination)) {
                                    window.showErrorMessage("Cannot create artifact! File already exists.");
                                }else {
                                    createTargetArtifact(sourceFile, targetFileUri);
                                }
                            }
                        });
                    }else {
                        checkPathExistence(pathToDestination).then(result => {
                            if(result) {
                                window.showErrorMessage("Cannot create artifact! File already exists.");
                            }else {
                                createTargetArtifact(sourceFile, targetFileUri);
                            }
                        });
                        // if(checkPathExistence(pathToDestination)) {
                        //     window.showErrorMessage("Cannot create artifact! File already exists.");
                        // }else {
                        //     createTargetArtifact(sourceFile, targetFileUri);
                        // }
                    }
                });

            }else {
                //TODO: handle mutliple workspace opening
            }
        }
    }

    export async function checkPathExistence(path: string): Promise<boolean> {
        return await fse.pathExists(path).then(result => {
            return result;
        }, error => {console.log(error); return false;});
    }

    async function createTargetArtifact(sourceFile: string, uri: Uri) {
        let edit = new WorkspaceEdit();
        edit.createFile(uri);
        workspace.applyEdit(edit);

        const dirName = __dirname;
        let sourcePath = path.join(dirName, '..', '..', '..', 'templates', sourceFile+'.xml');

        // // TODO: check whether you can pipe here
        // await fse.readFile(sourcePath).then((value) => {
        //     fse.writeFile(uri.path, value.toString()).then(value => {
        //         open(uri).then(doc => window.showTextDocument(doc));
        //     }).catch(reason => 
        //         console.log(reason));
        // }).catch(reason => {
        //     console.log(reason);}
        //     );

        const buf: Buffer = await fse.readFile(sourcePath);
        // let parser = new DOMParser();

        await timeout(200);
        await fse.writeFile(uri.path, buf.toString());
        await timeout(200);
        workspace.openTextDocument(uri).then(doc => window.showTextDocument(doc));

    }

    function timeout(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // const writeFile = promisify(fs.writeFile);
    // const readFile = promisify(fs.readFile);

    // async function readXmlTemplateFile(sourceFile: string): Promise<string|undefined> {
    //     try {
    //         const text = await readFile("/Users/sajinieranasinghe/Documents/WebBasedEIToolingVSCodeExtension/vscode-synapse-parent/vscode-synapse/vscode-plugin/templates/"+sourceFile+".xml", "utf-8");
    //         return text;
    //     } catch (err) {
    //         console.log('Error', err);
    //     }
    // }

    // async function writeToXmlFile(): Promise<boolean> {
    //     try {
    //         const text = await readFile("/Users/sajinieranasinghe/Documents/WebBasedEIToolingVSCodeExtension/vscode-synapse-parent/vscode-synapse/vscode-plugin/templates/api.xml", "utf-8");
    //         return true;
    //     } catch (err) {
    //         console.log('Error', err);
    //         return false;
    //     }
    // }

    function resolveUri(path: string): Uri {
        const targetFolder: Uri = Uri.file(path);
        targetFolder.scheme == 'file';
        targetFolder.path == path;
        targetFolder.fragment == '';

        return targetFolder;
    }

    function resolvePath(path:string): string {
        if (process.platform === "win32") {
            return path.replace("/", "\\");
        }
        return path;
    }
}

