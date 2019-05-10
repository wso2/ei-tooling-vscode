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
import {LocalEntryArtifactInfo, ServerRoleInfo} from "./artifactUtils";
import {XMLSerializer as XMLSerializer} from 'xmldom';
import {RegistryResource} from "./artifactResolver";

let DOM = require('xmldom').DOMParser;
let glob = require("glob");

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
            const pathToTargetFolder = path.join(synapseWorkspace.uri.fsPath, "src", "main", "synapse-config",
                                                 targetFolder);

            // Check if the path really exists. If not exists, the project is not a standard Synapse ESB Project
            checkPathExistence(pathToTargetFolder).then(exists => {
                if (exists) {
                    createArtifactFromTemplate(targetFolder, templateFileName, targetArtifactName, artifactType, type,
                                               pathToTargetFolder, "synapse-config", undefined);
                }
            });
        }
    }

    /**
     * Create new resource in Synapse ESB project.
     */
    export function createResource(targetFolder: string, templateFileName: string, targetArtifactName: string,
                                   artifactType: string, type: string, registryResource: RegistryResource) {
        if (workspace.workspaceFolders) {
            const synapseWorkspace: WorkspaceFolder = workspace.workspaceFolders[0];

            const targetFolderPath = path.join(synapseWorkspace.uri.fsPath, "src", "main", "registry-resources");

            // Check if the path really exists. If not exists, the project is not a standard Synapse ESB Project
            checkPathExistence(targetFolderPath).then(exists => {
                if (exists) {
                    createArtifactFromTemplate(targetFolder, templateFileName, targetArtifactName, artifactType, type,
                                               targetFolderPath, "registry-resources", registryResource);
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
                                        artifactType: string, type: string, pathToTargetFolder: string,
                                        resourceType: string, registryResource: RegistryResource | undefined) {

        if (workspace.workspaceFolders) {
            let pattern = path.join("*", targetArtifactName + ".xml");
            let cwd = path.join(workspace.workspaceFolders[0].uri.fsPath, "src", "main", resourceType);
            let newGlob = new glob(pattern, {cwd: cwd}, async function (err: any, files: any) {
                if (err) {
                    window.showErrorMessage("Error creating " + targetArtifactName + ".xml artifact!. ERROR: " + err);
                    return;
                }
                if (files.length > 0) {
                    // file name already exists in the project.
                    window.showErrorMessage("Error creating " + targetArtifactName + ".xml artifact!");
                } else {
                    const targetArtifactFilePath = path.join(pathToTargetFolder, targetArtifactName + ".xml");
                    const targetArtifactFileUri: Uri = Uri.file(targetArtifactFilePath);
                    const templateArtifactFilePath = path.join(dirName, '..', '..', 'templates', targetFolder,
                                                               templateFileName + '.xml');

                    createTargetArtifactFromTemplate(targetArtifactFileUri, targetArtifactName,
                                                     templateArtifactFilePath, artifactType);

                    if (resourceType === "synapse-config") {
                        await addNewArtifactToConfigArtifactXMLFile(targetArtifactName, targetFolder, type);
                    } else {
                        addNewArtifactToRegistryArtifactXMLFile(targetArtifactName, type, registryResource);
                    }
                }
                console.log(files);
            });
        }
    }

    /**
     * Create the artifact from template.
     */
    function createTargetArtifactFromTemplate(targetArtifactFileUri: Uri, targetArtifactName: string,
                                              templateArtifactFilePath: string, artifactType: string) {
        let edit = new WorkspaceEdit();
        edit.createFile(targetArtifactFileUri);
        workspace.applyEdit(edit);

        // Read and buffer artifact template file.
        const buf: Buffer = fse.readFileSync(templateArtifactFilePath);

        // Update the name attribute of the buffered artifact to comply with the new artifact.
        let updatedBody = "";
        if (artifactType !== LocalEntryArtifactInfo.ARTIFACT_TYPE) {
            updatedBody = updateAttribute(buf, "name", targetArtifactName);
        } else {
            updatedBody = updateAttribute(buf, "key", targetArtifactName);
        }
        // Write the updated template content to the target file.
        fse.writeFileSync(targetArtifactFileUri.fsPath, updatedBody);

        // Open and show newly created artifact document in the editor.
        workspace.openTextDocument(targetArtifactFileUri).then(doc => window.showTextDocument(doc));
    }

    /**
     * Add artifact info of the newly created artifact to synapse-config artifact.xml file.
     */
    async function addNewArtifactToConfigArtifactXMLFile(artifactName: string, targetFolder: string, type: string) {
        if (workspace.workspaceFolders) {
            // read pom and get project group_id and version
            const pomFile: string = path.join(workspace.workspaceFolders[0].uri.fsPath, "pom.xml");
            let project: Project = await getProjectInfoFromPOM(pomFile);
            const {groupId, version} = Object.assign(project);

            const configArtifactXmlFileLocation: string = path.join(workspace.workspaceFolders[0].uri.fsPath,
                                                                    "src", "main", "synapse-config", "artifact.xml");
            // Read and buffer synapse-config artifact.xml file
            const buf: Buffer = fse.readFileSync(configArtifactXmlFileLocation);

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
            fse.writeFileSync(configArtifactXmlFileLocation, new XMLSerializer().serializeToString(xmlDoc));
        }
    }

    /**
     * Add artifact info of the newly created artifact to registry-resource artifact.xml file.
     */
    function addNewArtifactToRegistryArtifactXMLFile(artifactName: string, type: string,
                                                     registryResource: RegistryResource | undefined) {
        if (workspace.workspaceFolders) {
            const registryArtifactXML: string = path.join(workspace.workspaceFolders[0].uri.fsPath,
                                                          "src", "main", "registry-resources", "artifact.xml");
            const buf: Buffer = fse.readFileSync(registryArtifactXML);

            let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
            let parent = xmlDoc.getElementsByTagName("artifacts");
            let child = parent[0].appendChild(xmlDoc.createElement("artifact"));
            child.setAttribute("name", artifactName);
            child.setAttribute("type", type);
            child.setAttribute("serverRole", "EnterpriseIntegrator");

            let item = xmlDoc.createElement("item");
            let file = xmlDoc.createElement("file");
            file.textContent = registryResource!.file;

            let filePath = xmlDoc.createElement("path");
            filePath.textContent = registryResource!.path;

            let mediaType = xmlDoc.createElement("mediaType");
            mediaType.textContent = registryResource!.mediaType;

            item.appendChild(file);
            item.appendChild(filePath);
            item.appendChild(mediaType);
            child.appendChild(item);

            fse.writeFileSync(registryArtifactXML, new XMLSerializer().serializeToString(xmlDoc));
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
    function updateAttribute(buf: Buffer, attributeName: string, attributeValue: string): string {
        let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
        xmlDoc.lastChild.setAttribute(attributeName, attributeValue);
        return new XMLSerializer().serializeToString(xmlDoc);
    }

    /**
     * Delete the artifact info of the deleted artifact from the related artifact.xml file.
     */
    export function safeDeleteArtifact(deletedFile: Uri) {
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
            let artifactXmlFilePath = path.join(workspace.workspaceFolders[0].uri.fsPath, "src", "main",
                                                resourceType, "artifact.xml");

            let buf: Buffer = fse.readFileSync(artifactXmlFilePath);
            let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
            let elementList = xmlDoc.getElementsByTagName("artifact");

            for (let i = 0; i < elementList.length; i++) {
                if (elementList[i].getAttribute("name") === rawArtifactName[0]) {
                    xmlDoc.removeChild(elementList[i]);
                    let data = new XMLSerializer().serializeToString(xmlDoc);
                    fse.writeFileSync(artifactXmlFilePath, data);
                    break;
                }
            }

        }
    }

    function isExistDirectoryPattern(filePath: string, dirPattern: string): boolean {
        let regExpForDirPattern = new RegExp(dirPattern);
        return regExpForDirPattern.test(filePath);
    }

}

