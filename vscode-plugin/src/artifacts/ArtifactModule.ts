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

        const buf: Buffer = await fse.readFile(sourcePath);
        await timeout(200);
        await fse.writeFile(uri.path, buf.toString());
        await timeout(200);
        workspace.openTextDocument(uri).then(doc => window.showTextDocument(doc));
    }

    function timeout(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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

