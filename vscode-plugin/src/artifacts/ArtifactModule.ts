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
import {ServerRoleInfo} from "./artifactUtils";

let DOM = require('xmldom').DOMParser;
let XMLSerializer = require('xmldom').XMLSerializer;

export namespace ArtifactModule {

    const dirName = __dirname;

    export function createTemplate(targetFolder: string, sourceFile: string, destinationFile: string, artifactType: string, type: string) {

        //first need to check whether there are multiple workspaces opened
        if (workspace.workspaceFolders) {
            const synapseWorkspace: WorkspaceFolder = workspace.workspaceFolders[0];

            const targetFolderPath = path.join(synapseWorkspace.uri.path, "src", "main", "synapse-config", targetFolder);
            const targetFilePath = path.join(targetFolderPath, destinationFile + ".xml");
            const targetFileUri = resolveUri(targetFilePath);

            checkPathExistence(targetFolderPath).then(result => {
                if (result) {
                    //check whether the file is already existing
                    checkPathExistence(targetFilePath).then(result => {
                        if (result) {
                            window.showErrorMessage("Error creating artifact! File already exists.");
                        } else {
                            let sourcePath = path.join(dirName, '..', '..', 'templates', targetFolder, sourceFile + '.xml');
                            createTargetArtifact(targetFileUri, destinationFile, sourcePath);
                            updateConfigArtifactXMLFile(destinationFile, artifactType, targetFolder, type);
                        }
                    });
                }
            });
        }
    }

    export function createResource(targetFolder: string, sourceFile: string, destinationFile: string, type: string) {
        if (workspace.workspaceFolders) {
            const synapseWorkspace: WorkspaceFolder = workspace.workspaceFolders[0];

            const targetFolderPath = path.join(synapseWorkspace.uri.path, "src", "main", "registry-resources");
            const targetFilePath = path.join(targetFolderPath, destinationFile + ".xml");
            const targetFileUri = resolveUri(targetFilePath);

            checkPathExistence(targetFolderPath).then(result => {
                if (result) {
                    checkPathExistence(targetFilePath).then(result => {
                        if (result) {
                            window.showErrorMessage("Error creating registry resource! File already exists.");
                        } else {
                            let sourcePath = path.join(dirName, '..', '..', 'templates', targetFolder, sourceFile + '.xml');
                            createTargetArtifact(targetFileUri, destinationFile, sourcePath);
                            updateRegistryArtifactXMLFile(destinationFile, type);
                        }
                    })
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

    async function createTargetArtifact(uri: Uri, fileName: string, sourcePath: string) {
        let edit = new WorkspaceEdit();
        edit.createFile(uri);
        workspace.applyEdit(edit);

        const buf: Buffer = await fse.readFile(sourcePath);
        await timeout(200);
        let updatedBody = updateNameAttribute(buf, fileName);
        await fse.writeFile(uri.path, updatedBody);
        await timeout(200);
        workspace.openTextDocument(uri).then(doc => window.showTextDocument(doc));
    }

    async function updateConfigArtifactXMLFile(artifactName: string, artifactType: string, targetFolder: string, type: string) {
        if (workspace.workspaceFolders) {
            const configArtifactXmlFileLocation: string = path.join(workspace.workspaceFolders[0].uri.path, "src", "main", "synapse-config", "artifact.xml");
            const buf: Buffer = await fse.readFile(configArtifactXmlFileLocation);
            await timeout(200);

            let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
            let parent = xmlDoc.getElementsByTagName("artifacts");
            let child = xmlDoc.createElement("artifact");
            parent[0].appendChild(child);
            child.setAttribute("name", artifactName);
            child.setAttribute("type", type);
            child.setAttribute("serverRole", ServerRoleInfo.ENTERPRISE_SERVICE_BUS);

            let fileTag = xmlDoc.createElement("file");
            fileTag.textContent = path.join(targetFolder, artifactName + ".xml");
            child.appendChild(fileTag);

            await fse.writeFile(configArtifactXmlFileLocation, new XMLSerializer().serializeToString(xmlDoc));
            // updatePomFile(artifactName, artifactType);
        }
    }

    async function updateRegistryArtifactXMLFile(artifactName: string, type: string) {
        if (workspace.workspaceFolders) {
            const registryArtifactXML: string = path.join(workspace.workspaceFolders[0].uri.path, "src", "main", "registry-resources", "artifact.xml");
            const buf: Buffer = await fse.readFile(registryArtifactXML);
            await timeout(200);

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

    async function updatePomFile(artifactName: string, artifactType: string) {
        if (workspace.workspaceFolders) {
            const pomXML: string = path.join(workspace.workspaceFolders[0].uri.path, "pom.xml");
            const buf: Buffer = await fse.readFile(pomXML);
            await timeout(200);

            let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
            let groupId = xmlDoc.getElementsByTagName("groupId")[0].textContent;
            let version = xmlDoc.getElementsByTagName("version")[0].textContent;
            let type = artifactType !== "registry" ? "xml" : "zip";

            // updateProperties(xmlDoc, artifactName, artifactType, groupId);
            // updateDependencies(xmlDoc, groupId, version, type, artifactType);

            let propertiesTag = xmlDoc.getElementsByTagName("properties");
            let propertyChild = propertiesTag[0].appendChild(xmlDoc.createElement(groupId + "." + artifactType + "_._" + artifactName));
            propertyChild.appendChild(xmlDoc.createTextNode("capp/EnterpriseServiceBus"));

            let dependenciesTag = xmlDoc.getElementsByTagName("dependencies");
            let dependencyChild = dependenciesTag[0].appendChild(xmlDoc.createElement("dependency"));
            let groupIdTag = dependencyChild.appendChild(xmlDoc.createElement("groupId"));
            groupIdTag.appendChild(xmlDoc.createTextNode(groupId + "." + artifactType));
            let artifactIdTag = dependencyChild.appendChild(xmlDoc.createElement("artifactId"));
            artifactIdTag.appendChild(xmlDoc.createTextNode(artifactName));
            let versionTag = dependencyChild.appendChild(xmlDoc.createElement("version"));
            versionTag.appendChild(xmlDoc.createTextNode(version));
            let typeTag = dependencyChild.appendChild(xmlDoc.createElement("type"));
            typeTag.appendChild(xmlDoc.createTextNode(type));

            await fse.writeFile(pomXML, new XMLSerializer().serializeToString(xmlDoc));
        }
    }

    function updateNameAttribute(buf: Buffer, fileName: string): string {
        let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
        xmlDoc.lastChild.setAttribute("name", fileName);
        return new XMLSerializer().serializeToString(xmlDoc);
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
}

