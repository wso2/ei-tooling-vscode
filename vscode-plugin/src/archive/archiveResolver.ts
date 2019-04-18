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

import {workspace} from "vscode";
import * as fse from "fs-extra";
import * as path from 'path';

var archiver = require('archiver');
var DOM = require('xmldom').DOMParser;
let XMLSerializer = require('xmldom').XMLSerializer;

export async function createCApp() {

    if (workspace.workspaceFolders) {
        let projectName = workspace.name;

        //read pom
        const pomFile: string = path.join(workspace.workspaceFolders[0].uri.path, "pom.xml");
        const pomBuf: Buffer = await fse.readFile(pomFile);
        let pomDom = new DOM().parseFromString(pomBuf.toString(), "text/xml");
        const projectVersion = pomDom.getElementsByTagName("version")[0].textContent;

        // create a file to stream archive data to.
        let output = fse.createWriteStream(workspace.workspaceFolders[0].uri.path + '/example.car');
        let archive = archiver('zip', {
            zlib: {level: 9} // Sets the compression level.
        });

        archive.on('warning', function (err: any) {
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                // throw error
                throw err;
            }
        });

        archive.on('error', function (err: any) {
            throw err;
        });
        // pipe archive data to the file
        archive.pipe(output);

        let artifactsXML = new DOM().parseFromString("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<artifacts>\n</artifacts>");
        let artifactsTag = artifactsXML.getElementsByTagName("artifacts");
        let artifactTag = artifactsXML.createElement("artifact");
        artifactsTag[0].appendChild(artifactTag);
        artifactTag.setAttribute("name", projectName + "CompositeApplication");
        artifactTag.setAttribute("version", projectVersion);
        artifactTag.setAttribute("type", "carbon/application");

        //read synapse-config artifact.xml file
        const configArtifactXML: string = path.join(workspace.workspaceFolders[0].uri.path, "src", "main",
            "synapse-config", "artifact.xml");
        const configBuf: Buffer = await fse.readFile(configArtifactXML);
        let configArtifactDom = new DOM().parseFromString(configBuf.toString(), "text/xml");
        let configArtifacts = configArtifactDom.getElementsByTagName("artifact");
        let noOfConfigArtifacts: number = configArtifacts.length;

        for (let i = 0; i < noOfConfigArtifacts; i++) {
            let artifact = configArtifacts[i];
            let name = artifact.getAttribute("name");
            let serverRole = artifact.getAttribute("serverRole");
            let artifactLocation = artifact.getElementsByTagName("file")[0].textContent;

            // generate new folder name and new file name to be put into .car file.
            let newFolderName = name + "_" + projectVersion;
            let newFileName = name + "-" + projectVersion + ".xml";

            let perArtifactXmlDom = new DOM().parseFromString("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            // remove group_id attribute, set version attribute, and set new artifact location inside file tag
            artifact.removeAttribute("groupId");
            artifact.setAttribute("version", projectVersion);
            artifact.getElementsByTagName("file")[0].textContent = newFileName;
            perArtifactXmlDom.appendChild(artifact);

            let perArtifactXmlContent: string = new XMLSerializer().serializeToString(perArtifactXmlDom);
            archive.append(perArtifactXmlContent, {name: "example/" + newFolderName + "/artifact.xml"});

            let artifactFileLocation = path.join(workspace.workspaceFolders[0].uri.path, "src", "main", "synapse-config", artifactLocation);
            let copyTo = path.join("example", newFolderName, newFileName);
            archive.file(artifactFileLocation, {name: copyTo});

            // add dependency element to artifacts.xml file in .car file
            let child = artifactsXML.createElement("dependency");
            child.setAttribute("artifact", name);
            child.setAttribute("version", projectVersion);
            child.setAttribute("include", "true");
            child.setAttribute("serverRole", serverRole);
            artifactTag.appendChild(child);
        }

        //read registry-resource artifact.xml file
        const registryArtifactXML: string = path.join(workspace.workspaceFolders[0].uri.path, "src", "main",
            "registry-resources", "artifact.xml");
        const registryBuf: Buffer = await fse.readFile(registryArtifactXML);
        let registryArtifactDom = new DOM().parseFromString(registryBuf.toString(), "text/xml");
        let registryArtifacts = registryArtifactDom.getElementsByTagName("artifact");
        let noOfRegistryResources: number = registryArtifacts.length;

        for (let i = 0; i < noOfRegistryResources; i++) {
            let registryArtifact = registryArtifacts[i];
            let name = registryArtifact.getAttribute("name");
            let serverRole = registryArtifact.getAttribute("serverRole");
            let fileName = registryArtifact.getElementsByTagName("file")[0].textContent;

            // generate new folder name to be put into .car file
            let newFolderName = name + "_" + projectVersion;

            registryArtifact.removeAttribute("groupId");
            registryArtifact.setAttribute("version", projectVersion);
            let item = registryArtifact.getElementsByTagName("item")[0];

            let dom = new DOM().parseFromString("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            let resources = dom.createElement("resources");
            resources.appendChild(item);
            dom.appendChild(resources);

            let infoXmlFileContent = new XMLSerializer().serializeToString(dom);
            let infoXmlFilePathInCar = path.join("example", newFolderName, name + "-info.xml");
            archive.append(infoXmlFileContent, {name: infoXmlFilePathInCar});

            let file = dom.createElement("file");
            file.textContent = name + "-info.xml";
            registryArtifact.removeChild(item);
            registryArtifact.appendChild(file);
            dom.removeChild(resources);
            dom.appendChild(registryArtifact);

            infoXmlFileContent = new XMLSerializer().serializeToString(dom);
            let resourceArtifactXmlFilePathInCar = path.join("example", newFolderName, "artifact.xml")
            archive.append(infoXmlFileContent, {name: resourceArtifactXmlFilePathInCar});

            let registryArtifactFileLocation = path.join(workspace.workspaceFolders[0].uri.path, "src", "main", "registry-resources", fileName);
            let copyTo = path.join("example", newFolderName, "resources", fileName);
            archive.file(registryArtifactFileLocation, {name: copyTo});

            // add dependency element to artifacts.xml file in .car file
            let child = artifactsXML.createElement("dependency");
            child.setAttribute("artifact", name);
            child.setAttribute("version", projectVersion);
            child.setAttribute("include", "true");
            child.setAttribute("serverRole", serverRole);
            artifactTag.appendChild(child);
        }

        let artifactXmlFileContent: string = new XMLSerializer().serializeToString(artifactsXML);
        let artifactXmlFileLocationInCar = path.join("example", "artifacts.xml");
        archive.append(artifactXmlFileContent, {name: artifactXmlFileLocationInCar});

        archive.finalize();
    }
}

interface Project {
    groupId?: string;
    artifactId?: string;
    version?: string;
}

async function readPomFile(): Promise<Project | undefined> {
    if (workspace.workspaceFolders) {
        const pomXML: string = path.join(workspace.workspaceFolders[0].uri.path, "pom.xml");
        const buf: Buffer = await fse.readFile(pomXML);
        let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
        let project: Project = {version: xmlDoc.getElementsByTagName("version")[0].textContent};
        return project;
    }
}