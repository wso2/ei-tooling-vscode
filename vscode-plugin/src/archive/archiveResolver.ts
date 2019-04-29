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

import {window, workspace} from "vscode";
import * as fse from "fs-extra";
import * as path from 'path';
import * as archiver from "archiver";
import {XMLSerializer as XMLSerializer} from 'xmldom';
import {chooseTargetFolder} from "../utils/uiUtils";

let DOM = require('xmldom').DOMParser;

export async function createCApp() {

    if (workspace.workspaceFolders) {
        let projectName = workspace.name;

        // get name for deployable archive
        const nameOfCARFile = await window.showInputBox({prompt: "Enter name for deployable archive"})
            .then(text => text);

        // select target directory to create .car file
        const cwd = workspace.workspaceFolders[0].uri.path;
        let targetFolderToGenerateCAR: string | null =
            await chooseTargetFolder(workspace.workspaceFolders[0].uri);

        if (!targetFolderToGenerateCAR) {
            targetFolderToGenerateCAR = cwd;
        }

        // read pom and get project version
        let project: Project = await getProjectInfoFromPOM(path.join(cwd, "pom.xml"));
        const {version} = Object.assign(project);

        // create a file to stream archive data to.
        let output = fse.createWriteStream(path.join(targetFolderToGenerateCAR, nameOfCARFile + ".car"));
        let archive: archiver.Archiver = archiver('zip', {
            zlib: {level: 0} // Sets the compression level.
        });

        archive.on('warning', function (err: any) {
            if (err.code === 'ENOENT') {
                window.showWarningMessage(err);
            } else {
                window.showErrorMessage(err);
                throw err;
            }
        });

        archive.on('error', function (err: any) {
            window.showErrorMessage("Error occurred while creating the .car file: " + err);
            throw err;
        });
        // pipe archive data to the file
        archive.pipe(output);

        let artifactsXML: Document =
            new DOM().parseFromString("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<artifacts>\n</artifacts>");
        let artifactsTag = artifactsXML.getElementsByTagName("artifacts");
        let artifactTag: Element = artifactsXML.createElement("artifact");
        artifactsTag[0].appendChild(artifactTag);
        artifactTag.setAttribute("name", projectName + "CompositeApplication_" + version);
        artifactTag.setAttribute("version", version);
        artifactTag.setAttribute("type", "carbon/application");

        let promise: Promise<void> = processConfigArtifactXmlFile(cwd, version, artifactsXML,
                                                                  artifactTag, archive);
        promise.then(() => {
            if (targetFolderToGenerateCAR) {
                let promise2: Promise<void> = processRegistryArtifactXmlFile(targetFolderToGenerateCAR, version,
                                                                             artifactsXML, artifactTag, archive);

                promise2.then(() => {
                    let artifactXmlFileContent: string = new XMLSerializer().serializeToString(artifactsXML);
                    let artifactXmlFileLocationInCar = path.join("artifacts.xml");
                    archive.append(artifactXmlFileContent, {name: artifactXmlFileLocationInCar});

                    archive.finalize();
                });
            }
        });
    }
}

interface Project {
    groupId?: string;
    artifactId?: string;
    version?: string;
}

async function getProjectInfoFromPOM(pomFilePath: string): Promise<Project> {
    const buf: Buffer = await fse.readFile(pomFilePath);
    let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
    return {
        groupId: xmlDoc.getElementsByTagName("groupId")[0].textContent,
        artifactId: xmlDoc.getElementsByTagName("artifactId")[0].textContent,
        version: xmlDoc.getElementsByTagName("version")[0].textContent
    };
}

async function processConfigArtifactXmlFile(pathToWorkspaceFolder: string, projectVersion: string,
                                            artifactsXML: Document, artifactTag: Element,
                                            archive: archiver.Archiver): Promise<void> {
    //read synapse-config artifact.xml file
    const configArtifactXML: string = path.join(pathToWorkspaceFolder, "src", "main",
                                                "synapse-config", "artifact.xml");
    const configBuf: Buffer = await fse.readFile(configArtifactXML);
    let configArtifactDom = new DOM().parseFromString(configBuf.toString(), "text/xml");
    let configArtifacts = configArtifactDom.getElementsByTagName("artifact");
    let noOfConfigArtifacts: number = configArtifacts.length;

    // process each artifact inside /synapse-config/artifact.xml
    for (let i = 0; i < noOfConfigArtifacts; i++) {
        // extract artifactName, serverRole, artifactLocation information from each artifact.
        let configArtifact = configArtifacts[i];
        let name = configArtifact.getAttribute("name");
        let serverRole = configArtifact.getAttribute("serverRole");
        let artifactLocation = configArtifact.getElementsByTagName("file")[0].textContent;

        // generate new folder name and new file name to be put into .car file.
        let newFolderName = name + "_" + projectVersion;
        let newFileName = name + "-" + projectVersion + ".xml";

        let newArtifactXmlDom = new DOM().parseFromString("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        // remove group_id attribute, set version attribute, and set new artifact location inside file tag
        configArtifact.removeAttribute("groupId");
        configArtifact.setAttribute("version", projectVersion);
        configArtifact.getElementsByTagName("file")[0].textContent = newFileName;
        newArtifactXmlDom.appendChild(configArtifact);

        // serialize newly created artifact dom to xml string
        let newArtifactXmlContent: string = new XMLSerializer().serializeToString(newArtifactXmlDom);

        // append new artifact.xml file to .car file.
        archive.append(newArtifactXmlContent, {name: newFolderName + path.sep});
        archive.append(newArtifactXmlContent, {name: path.join(newFolderName, "artifact.xml")});


        // copy artifact (api, proxy, endpoint, etc.) directly into relevant place in .car file
        let artifactFileLocation = path.join(pathToWorkspaceFolder, "src", "main", "synapse-config", artifactLocation);
        let copyTo = path.join(newFolderName, newFileName);
        archive.file(artifactFileLocation, {name: copyTo});

        // generate and add dependency element to artifacts.xml file in .car file
        let child = artifactsXML.createElement("dependency");
        child.setAttribute("artifact", name);
        child.setAttribute("version", projectVersion);
        child.setAttribute("include", "true");
        child.setAttribute("serverRole", serverRole);
        artifactTag.appendChild(child);
    }
}

async function processRegistryArtifactXmlFile(pathToWorkspaceFolder: string, projectVersion: string,
                                              artifactsXML: Document, artifactTag: Element,
                                              archive: archiver.Archiver): Promise<void> {
    //read registry-resource artifact.xml file
    const registryArtifactXML: string = path.join(pathToWorkspaceFolder, "src", "main",
                                                  "registry-resources", "artifact.xml");
    const registryBuf: Buffer = await fse.readFile(registryArtifactXML);
    let registryArtifactDom = new DOM().parseFromString(registryBuf.toString(), "text/xml");
    let registryArtifacts = registryArtifactDom.getElementsByTagName("artifact");
    let noOfRegistryResources: number = registryArtifacts.length;

    // process each artifact inside registry-resources/artifact.xml
    for (let i = 0; i < noOfRegistryResources; i++) {
        // extract artifactName, serverRole, fileName information from each artifact.
        let registryArtifact = registryArtifacts[i];
        let name = registryArtifact.getAttribute("name");
        let serverRole = registryArtifact.getAttribute("serverRole");
        let fileName = registryArtifact.getElementsByTagName("file")[0].textContent;

        // generate new folder name to be put into .car file
        let newFolderName = name + "_" + projectVersion;

        // remove group_id attribute, set version attribute, and get item element
        registryArtifact.removeAttribute("groupId");
        registryArtifact.setAttribute("version", projectVersion);
        let item = registryArtifact.getElementsByTagName("item")[0];

        let dom = new DOM().parseFromString("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        // create "resource" element to be put inside artifact-info.xml file
        let resources = dom.createElement("resources");
        resources.appendChild(item);
        dom.appendChild(resources);

        // serialize -info.xml dom into xml string
        let infoXmlFileContent = new XMLSerializer().serializeToString(dom);
        // append -info.xml file into .car.file
        archive.append(infoXmlFileContent, {name: newFolderName + path.sep});
        archive.append(infoXmlFileContent, {name: path.join(newFolderName, name + "-info.xml")});

        // generate new artifact.xml file to be put into .car file under each registry resource
        let file = dom.createElement("file");
        file.textContent = name + "-info.xml";
        registryArtifact.removeChild(item);
        registryArtifact.appendChild(file);
        dom.removeChild(resources);
        dom.appendChild(registryArtifact);

        // append new artifact.xml file to .car file.
        infoXmlFileContent = new XMLSerializer().serializeToString(dom);
        archive.append(infoXmlFileContent, {name: path.join(newFolderName, "artifact.xml")});

        // directly copy registry resource in registry-resource folder into relevant place in .car file
        archive.append(infoXmlFileContent, {name: path.join(newFolderName, "resources" + path.sep)});
        let registryArtifactFileLocation = path.join(pathToWorkspaceFolder, "src", "main", "registry-resources",
                                                     fileName);
        let copyTo = path.join(newFolderName, "resources", fileName);
        archive.file(registryArtifactFileLocation, {name: copyTo});

        // generate and add dependency element to artifacts.xml file in .car file
        let child = artifactsXML.createElement("dependency");
        child.setAttribute("artifact", name);
        child.setAttribute("version", projectVersion);
        child.setAttribute("include", "true");
        child.setAttribute("serverRole", serverRole);
        artifactTag.appendChild(child);
    }
}
