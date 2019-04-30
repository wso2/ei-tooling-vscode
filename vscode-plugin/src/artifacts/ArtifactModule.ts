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

import {Uri, window, workspace, WorkspaceEdit, WorkspaceFolder} from "vscode";
import * as fse from "fs-extra";
import * as path from 'path';
import {ServerRoleInfo} from "./artifactUtils";
import {XMLSerializer as XMLSerializer} from 'xmldom';

let DOM = require('xmldom').DOMParser;

export namespace ArtifactModule {

    const dirName = __dirname;

    /**
     * Interface that holds project information.
     */
    export interface Project {
        groupId?: string;
        artifactId?: string;
        version?: string;
    }

    /**
     * Create new config artifact in Synapse ESB project.
     */
    export function createArtifact(targetFolder: string, templateFileName: string, targetArtifactName: string,
                                   artifactType: string, type: string) {
        if (workspace.workspaceFolders) {
            const synapseWorkspace: WorkspaceFolder = workspace.workspaceFolders[0];

            // Create target folder path where the new config artifact is going to be added in the project.
            const pathToTargetFolder = path.join(synapseWorkspace.uri.path, "src", "main", "synapse-config",
                                               targetFolder);

            // Check if the path really exists. If not exists, the project is not a standard Synapse ESB Project
            checkPathExistence(pathToTargetFolder).then(exists => {
                if (exists) {
                    createArtifactFromTemplate(targetFolder, templateFileName, targetArtifactName, type,
                                               pathToTargetFolder, "synapse-config");
                }
            });
        }
    }

    /**
     * Create new resource in Synapse ESB project.
     */
    export function createResource(targetFolder: string, templateFileName: string, targetArtifactName: string,
                                   type: string) {
        if (workspace.workspaceFolders) {
            const synapseWorkspace: WorkspaceFolder = workspace.workspaceFolders[0];

            const targetFolderPath = path.join(synapseWorkspace.uri.path, "src", "main", "registry-resources");

            // Check if the path really exists. If not exists, the project is not a standard Synapse ESB Project
            checkPathExistence(targetFolderPath).then(exists => {
                if (exists) {
                    createArtifactFromTemplate(targetFolder, templateFileName, targetArtifactName, type, targetFolderPath,
                                   "registry-resources");
                }
            });
        }
    }

    export async function checkPathExistence(path: string): Promise<boolean> {
        return await fse.pathExists(path).then(
            result => {
                return result;
            }
            , error => {
                console.log(error);
                return false;
            });
    }

    /**
     * Create artifact from template.
     */
    function createArtifactFromTemplate(targetFolder: string, templateFileName: string, targetArtifactName: string,
                                        type: string, pathToTargetFolder: string, resourceType: string) {

        let targetFile = path.join("src", "main", "**", "**", targetArtifactName + ".xml");

        // Check whether the file already exists in project. Find files with similar name in the workspace.
        workspace.findFiles(targetFile).then(async result => {
            if (result.length === 0) { //no matching files found

                const targetArtifactFilePath = path.join(pathToTargetFolder, targetArtifactName + ".xml");
                const targetArtifactFileUri: Uri = Uri.file(targetArtifactFilePath);
                const templateArtifactFilePath = path.join(dirName, '..', '..', 'templates', targetFolder,
                                             templateFileName + '.xml');

                await createTargetArtifactFromTemplate(targetArtifactFileUri, targetArtifactName,
                                                       templateArtifactFilePath);

                if (resourceType === "synapse-config") {
                    await addNewArtifactToConfigArtifactXMLFile(targetArtifactName, targetFolder, type);
                } else {
                    await addNewArtifactToRegistryArtifactXMLFile(targetArtifactName, type);
                }
            } else {
                window.showErrorMessage("Error creating " + targetArtifactName + ".xml artifact! \nFile already "
                                        + "exists in ." + result.join(","));
            }
        });
    }

    /**
     * Create the artifact from template.
     */
    async function createTargetArtifactFromTemplate(targetArtifactFileUri: Uri, targetArtifactName: string,
                                                    templateArtifactFilePath: string) {
        let edit = new WorkspaceEdit();
        edit.createFile(targetArtifactFileUri);
        workspace.applyEdit(edit);

        // Read and buffer artifact template file.
        const buf: Buffer = await fse.readFile(templateArtifactFilePath);
        await timeout(200);

        // Update the name attribute of the buffered artifact to comply with the new artifact.
        let updatedBody = updateNameAttribute(buf, targetArtifactName);

        // Write the updated template content to the target file.
        await fse.writeFile(targetArtifactFileUri.path, updatedBody);
        await timeout(200);

        // Open and show newly created artifact document in the editor.
        workspace.openTextDocument(targetArtifactFileUri).then(doc => window.showTextDocument(doc));
    }

    /**
     * Add artifact info of the newly created artifact to synapse-config artifact.xml file.
     */
    async function addNewArtifactToConfigArtifactXMLFile(artifactName: string, targetFolder: string, type: string) {
        if (workspace.workspaceFolders) {
            // read pom and get project group_id and version
            const pomFile: string = path.join(workspace.workspaceFolders[0].uri.path, "pom.xml");
            let project: Project = await getProjectInfoFromPOM(pomFile);
            const {groupId, version} = Object.assign(project);

            const configArtifactXmlFileLocation: string = path.join(workspace.workspaceFolders[0].uri.path,
                                                                    "src", "main", "synapse-config", "artifact.xml");
            // Read and buffer synapse-config artifact.xml file
            const buf: Buffer = await fse.readFile(configArtifactXmlFileLocation);
            await timeout(200);

            // Parse the artifact.xml file content to a DOM document.
            // Create new artifact DOM Element info to represent the newly created artifact.
            let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
            let parent = xmlDoc.getElementsByTagName("artifacts");
            let child = xmlDoc.createElement("artifact");
            parent[0].appendChild(child);
            child.setAttribute("name", artifactName);
            child.setAttribute("type", type);
            child.setAttribute("serverRole", ServerRoleInfo.ENTERPRISE_SERVICE_BUS);
            child.setAttribute("groupId", groupId);
            child.setAttribute("version", version);

            let fileTag = xmlDoc.createElement("file");
            fileTag.textContent = path.join(targetFolder, artifactName + ".xml");
            child.appendChild(fileTag);

            // Update the synapse-config artifact.xml file.
            await fse.writeFile(configArtifactXmlFileLocation, new XMLSerializer().serializeToString(xmlDoc));
        }
    }

    /**
     * Add artifact info of the newly created artifact to registry-resource artifact.xml file.
     */
    async function addNewArtifactToRegistryArtifactXMLFile(artifactName: string, type: string) {
        if (workspace.workspaceFolders) {
            const registryArtifactXML: string = path.join(workspace.workspaceFolders[0].uri.path,
                                                          "src", "main", "registry-resources", "artifact.xml");
            const buf: Buffer = await fse.readFile(registryArtifactXML);

            let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
            let parent = xmlDoc.getElementsByTagName("artifacts");
            let child = parent[0].appendChild(xmlDoc.createElement("artifact"));
            child.setAttribute("name", artifactName);
            child.setAttribute("type", type);
            child.setAttribute("serverRole", "EnterpriseIntegrator");

            let item = xmlDoc.createElement("item");
            let file = xmlDoc.createElement("file");
            file.textContent = "file";

            let filePath = xmlDoc.createElement("path");
            filePath.textContent = "path";

            let mediaType = xmlDoc.createElement("mediaType");
            mediaType.textContent = "mediaType";

            item.appendChild(file);
            item.appendChild(filePath);
            item.appendChild(mediaType);
            child.appendChild(item);

            //TODO: complete the code
            await fse.writeFile(registryArtifactXML, new XMLSerializer().serializeToString(xmlDoc));
        }
    }

    /**
     * Read pom.xml file and abstract project related info.
     */
    export async function getProjectInfoFromPOM(pomFilePath: string): Promise<Project> {
        const buf: Buffer = await fse.readFile(pomFilePath);
        let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
        return {
            groupId: xmlDoc.getElementsByTagName("groupId")[0].textContent,
            artifactId: xmlDoc.getElementsByTagName("artifactId")[0].textContent,
            version: xmlDoc.getElementsByTagName("version")[0].textContent
        };
    }

    /**
     * Update the name attribute value in the buffered content.
     */
    function updateNameAttribute(buf: Buffer, name: string): string {
        let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
        xmlDoc.lastChild.setAttribute("name", name);
        return new XMLSerializer().serializeToString(xmlDoc);
    }

    function timeout(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Delete the artifact info of the deleted artifact from the related artifact.xml file.
     */
    export async function safeDeleteArtifact(deletedFile: Uri) {
        const filePath: string = deletedFile.fsPath;
        let array: string[] = filePath.split(path.sep);
        let deletedArtifact: string = array[array.length - 1];
        let rawArtifactName: string[] = deletedArtifact.split(".");
        let resourceType;

        // Check if the deleted file is a synapse-config or a registry-resource file
        if (isExistDirectoryPattern(filePath, path.join("src", "main", "synapse-config"))) {
            resourceType = "synapse-config";

        } else if (isExistDirectoryPattern(filePath, path.join("src", "main", "registry-resources"))) {
            resourceType = "registry-resources";
        }

        if (workspace.workspaceFolders && resourceType) {
            let artifactXmlFilePath = path.join(workspace.workspaceFolders[0].uri.path, "src", "main",
                                                resourceType, "artifact.xml");

            // Read related artifact.xml file, convert it to DOM Document and remove the deleted artifact info
            fse.readFile(artifactXmlFilePath).then(buf => {
                let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
                let elementList = xmlDoc.getElementsByTagName("artifact");

                for (let i = 0; i < elementList.length; i++) {
                    if (elementList[i].getAttribute("name") === rawArtifactName[0]) {
                        xmlDoc.removeChild(elementList[i]);
                        fse.writeFile(artifactXmlFilePath, new XMLSerializer().serializeToString(xmlDoc))
                            .catch(error => console.log(error));
                        break;
                    }
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }

    function isExistDirectoryPattern(filePath: string, dirPattern: string): boolean {
        let regExpForDirPattern = new RegExp(dirPattern);
        return regExpForDirPattern.test(filePath);
    }

}

