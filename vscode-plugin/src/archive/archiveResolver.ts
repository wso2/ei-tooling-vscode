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

import { workspace, Uri, window, commands } from "vscode";
import * as path from 'path';
import { executeProjectBuildCommand } from "../mavenInternals/commandHandler";
import { SubDirectories } from "../artifacts/artifactUtils";
import { chooseTargetFolder, chooseTargetFile, showInputBox, showInputBoxForArtifactId, showInputBoxForGroupId } from "../utils/uiUtils";
import { Utils } from "../utils/Utils";
import { ArchiveModule } from "./ArchiveModule";

var fileSystem = require('fs');
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
        fileSystem.readdir(rootDirectory, (err: any, files: any) => {
            if (err)
                console.log(err);
            else {
                files.forEach((file: any) => {
                    let projConfigFilePath: string = path.join(rootDirectory, file, ".project");
                    let pomFilePath: string = path.join(rootDirectory, file, "pom.xml");
                    Utils.checkPathExistence(pomFilePath).then(exists => {
                        if (exists) {
                            let projectNature: string = Utils.getDirectoryType(projConfigFilePath);
                            if (projectNatures.indexOf(projectNature) !== -1) {
                                Utils.checkBuildPlugins(pomFilePath, projectNature);
                            }
                        }
                    });

                })
            }
            executeProjectBuildCommand(rootDirectory);
        });
    }
}

export async function createZipArchive() {

    // Set home dir as the target folder hint.
    const homedir: string = require('os').homedir();
    const targetFolderHint = Uri.file(homedir);

    let zipFileName = await showInputBox("Enter zip archive name");

    if ((typeof zipFileName === "undefined") || (zipFileName === "")) {
        zipFileName = "untitled";
    }

    //get the destination folder
    const targetLocation: string | null = await chooseTargetFolder(targetFolderHint);

    if (workspace.workspaceFolders && targetLocation) {

        let rootDirectory: string = workspace.workspaceFolders[0].uri.fsPath;
        let projectName: string = workspace.workspaceFolders[0].name;

        let zipFilePath: string = path.join(targetLocation, zipFileName + ".zip");
        let output = fileSystem.createWriteStream(zipFilePath);
        let archive = archiver('zip');

        archive.on('error', function (err: any) {
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

export async function unzipArchive() {

    try {
        // Set home dir as the target folder hint.
        const homedir: string = require('os').homedir();
        const targetFolderHint = Uri.file(homedir);

        //get the target folder
        const targetLocation: string | null = await chooseTargetFile(targetFolderHint, "Select ZIP Archive...", { 'ZIP files': ['zip'] });

        var zip = new AdmZip(targetLocation);
        var zipEntries = zip.getEntries(); // an array of ZipEntry records

        if (targetLocation) {

            //get the destination directory
            const destinationLocation: string | null = await chooseTargetFolder(targetFolderHint);

            if (destinationLocation) {
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

export async function createProjectFromCar() {

    try {
        // Set home dir as the target folder hint.
        const homedir: string = require('os').homedir();
        const targetFolderHint = Uri.file(homedir);

        //get the target folder
        const targetCarFileLocation: string | null = await chooseTargetFile(targetFolderHint, "Select CAR Archive...", { 'car files': ['car'] });

        if (targetCarFileLocation) {

            let artifactId: string | undefined = await showInputBoxForArtifactId();
            let groupId: string | undefined = await showInputBoxForGroupId();

            // Ensure that artifactID name is valid.
            while (typeof artifactId !== "undefined" && !Utils.validate(artifactId)) {
                window.showErrorMessage("Enter valid ArtifactId name!!");
                artifactId = await showInputBoxForArtifactId();
            }

            // Ensure that groupID name is valid.
            while (typeof groupId !== "undefined" && !Utils.validateGroupId(groupId)) {
                window.showErrorMessage("Enter valid GroupId name!!");
                groupId = await showInputBoxForGroupId();
            }

            if (typeof artifactId === "undefined" || typeof groupId === "undefined") {
                return;
            }

            //get the destination directory
            const newProjectLocation: string | null = await chooseTargetFolder(targetFolderHint);

            if (newProjectLocation) {
                ArchiveModule.createProject(targetCarFileLocation, newProjectLocation, artifactId, groupId);
            }
        }

    } catch (err) {
        window.showErrorMessage("Project Creation Failed");

    }
}


