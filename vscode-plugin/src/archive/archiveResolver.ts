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

import {workspace, Uri, window, commands} from "vscode";
import * as path from 'path';
import {executeProjectBuildCommand} from "../mavenInternals/commandHandler";
import {ArchetypeModule} from "../archetype/ArchetypeModule";
import { ArtifactModule } from "../artifacts/ArtifactModule";
import {ProjectNatures, SubDirectories} from "../artifacts/artifactUtils";
import {chooseTargetFolder, chooseTargetFile, showInputBox} from "../utils/uiUtils";
import * as fse from "fs-extra";

var file_system = require('fs');
var archiver = require('archiver');
const extract = require('extract-zip');
var AdmZip = require('adm-zip');

/*
* Build the project and create the .car file in the target folder
* */
export function createDeployableArchive() {

    let projectNatures: string[] = [SubDirectories.COMPOSITE_EXPORTER, SubDirectories.CONFIGS, SubDirectories.CONNECTOR_EXPORTER,
         SubDirectories.REGISTRY_RESOURCES, SubDirectories.DATA_SERVICE];
    

    if (workspace.workspaceFolders) {
        let rootDirectory: string = workspace.workspaceFolders[0].uri.fsPath;
        file_system.readdir(rootDirectory, (err: any, files: any) => {
            if (err)
              console.log(err);
            else {
              files.forEach( (file: any) => {
                let projConfigFilePath: string = path.join(rootDirectory, file, ".project");
                let pomFilePath: string = path.join(rootDirectory, file, "pom.xml");
                ArtifactModule.checkPathExistence(pomFilePath).then(exists => {
                    if (exists) {
                        let projectNature: string = ArtifactModule.getProjectNature(projConfigFilePath);
                        if(projectNatures.indexOf(projectNature) !== -1){
                            ArtifactModule.checkBuildPlugins(pomFilePath, projectNature);
                        }
                    }
                });

              })
            }
            executeProjectBuildCommand(rootDirectory);
          });
        }
}

export async function createZipArchive(){

    // Set home dir as the target folder hint.
    const homedir: string = require('os').homedir();
    const targetFolderHint = Uri.file(homedir);

    let zipFileName = await showInputBox("Enter zip archive name");

    if((typeof zipFileName === "undefined") || (zipFileName === "") ) {
        zipFileName = "untitled";
    }

    //get the destination folder
    const targetLocation: string | null = await chooseTargetFolder(targetFolderHint);

    if(workspace.workspaceFolders && targetLocation){

        let rootDirectory: string = workspace.workspaceFolders[0].uri.fsPath;
        let projectName: string = workspace.workspaceFolders[0].name;

        let zipFilePath: string = path.join(targetLocation, zipFileName+".zip");
        let output = file_system.createWriteStream(zipFilePath);
        let archive = archiver('zip');

        archive.on('error', function(err: any){
            window.showErrorMessage("Zip Archive Creation Failed");
            return;
            
        });

        // pipe archive data to the file
        archive.pipe(output);

        // append files from a sub-directory and naming it <project-name> within the archive
        archive.directory(rootDirectory, projectName);
        
        // finalize the archive (ie we are done appending files but streams have to finish yet)
        archive.finalize();
        window.showInformationMessage("Zip Archive Created Successfully");
            

    }
}

export async function unzipArchive(){

    try {
        // Set home dir as the target folder hint.
        const homedir: string = require('os').homedir();
        const targetFolderHint = Uri.file(homedir);

        //get the target folder
        const targetLocation: string | null = await chooseTargetFile(targetFolderHint);

        var zip = new AdmZip(targetLocation);
        var zipEntries = zip.getEntries(); // an array of ZipEntry records
        
        if(targetLocation){

            //get the destination directory
            const destinationLocation: string | null = await chooseTargetFolder(targetFolderHint);

            if(destinationLocation){
                await extract(targetLocation, { dir: destinationLocation })

                window.showInformationMessage("Zip Archive Imported Successfully");
    
                let projectName: string = zipEntries[0].entryName.split(path.sep)[0].trim();
                let projectFilePath: string = path.join(destinationLocation, projectName);
                commands.executeCommand('vscode.openFolder', Uri.file(projectFilePath), true);

            }
           
        }
        
      } catch (err) {
            window.showErrorMessage("Zip Archive Extraction Failed");
      }
}
