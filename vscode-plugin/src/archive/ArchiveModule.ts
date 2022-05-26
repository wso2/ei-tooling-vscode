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

import { workspace, Uri, window, commands, WorkspaceEdit } from "vscode";
import * as path from 'path';
import * as fse from "fs-extra";
import { ArtifactModule } from "../artifacts/ArtifactModule";
import { DataServiceModule } from "../dataService/DataServiceModule";
import {
    APIArtifactInfo, ArtifactInfo, EndpointArtifactInfo, InboundEndpointArtifactInfo, LocalEntryArtifactInfo,
    MessageProcessorArtifactInfo, MessageStoreArtifactInfo, ProxyArtifactInfo, RegistryResourceInfo, SequenceArtifactInfo,
    SubDirectories, TaskArtifactInfo, TemplateArtifactInfo, ESBArtifactPath, Common
} from "../artifacts/artifactUtils";
import { Utils } from "../utils/Utils";
import { ConnectorInfo } from "../connector/connectorUtils";
import { ConnectorModule } from "../connector/ConnectorModule";
import { DataServiceInfo } from "../dataService/dataServiceUtils";
import { MediatorProjectInfo } from "../mediatorProject/mediarorProjectUtils";
import { MediatorProjectModule } from "../mediatorProject/MediatorProjectModule";

let DOM = require('xmldom').DOMParser;
var fileSystem = require('fs');
const extract = require('extract-zip');
const fernflower = require("fernflower");

let isEsbProjectCreated: boolean = false;
let isRegistryResourcesProjectCreated: boolean = false;
let isConnectorModuleCreated: boolean = false;
let isDataServiceProjectCreated: boolean = false;

export namespace ArchiveModule {

    const SRC = ESBArtifactPath.SRC;
    const MAIN = ESBArtifactPath.MAIN;
    const RESOURECS = ESBArtifactPath.RESOURECS;
    const METADATA = ESBArtifactPath.METADATA;
    const SWAGGER = ESBArtifactPath.SWAGGER;
    const SYNAPSE_CONFIG = ESBArtifactPath.SYNAPSE_CONFIG;
    const POM = Common.POM;
    const CONF = Common.CONF;
    const TEMPLATES = Common.TEMPLATES;
    const POM_FILE = Common.POM_FILE;
    const ARTIFACT_FILE = Common.ARTIFACT_FILE;
    const PROXY_METADATA = Common.PROXY_METADATA;
    const ARTIFACT_ID_TAG = Common.ARTIFACT_ID_TAG;
    const GROUP_ID_TAG = Common.GROUP_ID_TAG;
    const VERSION_TAG = Common.VERSION_TAG;
    const NAME_TAG = Common.NAME_TAG;
    const XML_TYPE = Common.XML_TYPE;
    const PROJECT_FILE = Common.PROJECT_FILE;

    export async function createProject(carFileLocation: string, newRootDirectory: string, projectName: string,
        groupId: string) {

        //create new project directory
        let newProjectDirectory: string = path.join(newRootDirectory, projectName);
        if (fse.existsSync(newProjectDirectory)) {
            window.showErrorMessage("Project directory already exists...!");
            return;
        }
        fileSystem.mkdirSync(newProjectDirectory);

        //extract zip archive
        let tmpDirectory: string = path.join(newProjectDirectory, "tmp");
        fse.mkdirSync(tmpDirectory);
        await extract(carFileLocation, { dir: tmpDirectory });

        //read root artifact file
        let rootArtifactsPath: string = path.join(tmpDirectory, "artifacts.xml");
        if (!fse.existsSync(rootArtifactsPath)) {
            window.showErrorMessage("Can not find root artifacts.xml file. New project creation failed...!");
            return;
        }
        const buffer: Buffer = fse.readFileSync(rootArtifactsPath);
        let artifactXml = new DOM().parseFromString(buffer.toString(), XML_TYPE);
        let artifacts = artifactXml.getElementsByTagName("artifact");

        if (artifacts.length > 0) {

            //create root pom.xml and .project files
            let name: string = artifacts[0].getAttribute(NAME_TAG);
            let version: string = artifacts[0].getAttribute(VERSION_TAG);
            let dependencies = artifacts[0].getElementsByTagName("dependency");
            createRootProjectNatureFile(newRootDirectory, projectName);
            createRootPomXml(newRootDirectory, groupId, projectName, version);

            //create settings.json
            Utils.createVsCodeSettingsFile(newProjectDirectory);

            //create composite exporter project
            Utils.CreateNewCompositeExporterProject(newProjectDirectory, name.trim());

            if (dependencies.length === 0) {
                window.showInformationMessage("No dependencies for the project...!");
                return;
            }

            let length: number = dependencies.length;
            for (let i = 0; i < length; i++) {
                let artifactName: string = dependencies[i].getAttribute("artifact");
                let version: string = dependencies[i].getAttribute(VERSION_TAG);
                let include: string = dependencies[i].getAttribute("include").trim();
                if (include === "true") {
                    let artifactXmlFilePath: string = path.join(tmpDirectory, `${artifactName}_${version}`, ARTIFACT_FILE);
                    if (fse.existsSync(artifactXmlFilePath)) {

                        let compositeDirectory: string = path.join(newProjectDirectory, name.trim());
                        let metadataDirectory: string = path.join(tmpDirectory, METADATA);
                        let rootMetadataFilePath: string = path.join(tmpDirectory, `${METADATA}.xml`);

                        //copy artifacts into new project directory
                        copyArtifactFile(newProjectDirectory, compositeDirectory, projectName, metadataDirectory,
                            rootMetadataFilePath, artifactXmlFilePath, groupId);
                    }
                }
            }
            isEsbProjectCreated = false;
            isRegistryResourcesProjectCreated = false;
            isConnectorModuleCreated = false;
            isDataServiceProjectCreated = false;
        }

        commands.executeCommand('vscode.openFolder', Uri.file(newProjectDirectory), true);
    }

    function createRootPomXml(directory: string, groupID: string, artifactID: string, version: string) {

        let templatePomFilePath: string = path.join(__dirname, "..", "..", TEMPLATES, POM, "rootPom.xml");
        let pomFilePath: string = path.join(directory, artifactID, POM_FILE);
        const rootPomBuffer: Buffer = fse.readFileSync(templatePomFilePath);
        let rootPomXmlDoc = new DOM().parseFromString(rootPomBuffer.toString(), XML_TYPE);
        let rootGroupId = rootPomXmlDoc.getElementsByTagName(GROUP_ID_TAG)[0];
        let rootArtifactId = rootPomXmlDoc.getElementsByTagName(ARTIFACT_ID_TAG)[0];
        let rootVersion = rootPomXmlDoc.getElementsByTagName(VERSION_TAG)[0];
        let name = rootPomXmlDoc.getElementsByTagName(NAME_TAG)[0];
        let description = rootPomXmlDoc.getElementsByTagName("description")[0];

        rootGroupId.textContent = groupID;
        rootArtifactId.textContent = artifactID;
        rootVersion.textContent = version;
        name.textContent = artifactID;
        description.textContent = artifactID;
        Utils.createXmlFile(pomFilePath, rootPomXmlDoc);
    }

    function createRootProjectNatureFile(directory: string, artifactId: string) {

        let templateFilePath: string = path.join(__dirname, "..", "..", TEMPLATES, CONF, "multiModuleProject.xml");
        let newFilePath: string = path.join(directory, artifactId, PROJECT_FILE);
        const buffer: Buffer = fse.readFileSync(templateFilePath);
        let xmlDoc = new DOM().parseFromString(buffer.toString(), XML_TYPE);
        let name = xmlDoc.getElementsByTagName(NAME_TAG)[0];
        name.textContent = artifactId;
        Utils.createXmlFile(newFilePath, xmlDoc);
    }

    function copyArtifactFile(rootDirectory: string, compositeExporterDirectory: string, projectName: string, metadataDirectory: string,
        metadataFilePath: string, artifactXmlFilePath: string, groupId: string) {

        const buffer: Buffer = fse.readFileSync(artifactXmlFilePath);
        let xmlDoc = new DOM().parseFromString(buffer.toString(), XML_TYPE);
        let artifact = xmlDoc.getElementsByTagName("artifact");
        if (artifact.length > 0) {

            let type: string = artifact[0].getAttribute("type").trim();

            let artifactTypes: string[] = [APIArtifactInfo.TYPE, ProxyArtifactInfo.TYPE, EndpointArtifactInfo.TYPE, InboundEndpointArtifactInfo.TYPE,
            LocalEntryArtifactInfo.TYPE, MessageStoreArtifactInfo.TYPE, MessageProcessorArtifactInfo.TYPE, TemplateArtifactInfo.TYPE,
            SequenceArtifactInfo.TYPE, TaskArtifactInfo.TYPE];

            let index: number = artifactTypes.indexOf(type);

            let name: string = artifact[0].getAttribute("name").trim();
            let version: string = artifact[0].getAttribute("version").trim();
            let serverRole: string = artifact[0].getAttribute("serverRole").trim();
            let fileName: string = artifact[0].getElementsByTagName("file")[0].textContent.trim();

            if (index !== -1) {//synapse artifact
                copySynapseArtifact(projectName, rootDirectory, name, type, version, serverRole, index, artifactXmlFilePath,
                    fileName, compositeExporterDirectory, metadataDirectory, metadataFilePath);
            }
            else if (type === RegistryResourceInfo.TYPE) {//registry resource
                copyRegistryResource(projectName, rootDirectory, compositeExporterDirectory, artifactXmlFilePath,
                    name, type, version, serverRole, fileName);
            }
            else if (type === ConnectorInfo.TYPE) {//connector
                copyEsbConnector(projectName, rootDirectory, compositeExporterDirectory, name, type, version,
                    serverRole, fileName, artifactXmlFilePath);
            }
            else if (type === DataServiceInfo.TYPE) {//data-service
                copyDataService(projectName, rootDirectory, compositeExporterDirectory, name, type, version,
                    serverRole, fileName, artifactXmlFilePath);
            }
            else if (type === MediatorProjectInfo.TYPE) {//mediator project
                copyMediatorProjct(rootDirectory, name, version, serverRole, fileName, artifactXmlFilePath);
            }
        }
    }

    function copySynapseArtifact(projectName: string, rootDirectory: string, name: string, type: string, version: string, serverRole: string,
        index: number, artifactXmlFilePath: string, fileName: string, compositeExporterDirectory: string,
        metadataDirectory: string, metadataFilePath: string) {
        if (!isEsbProjectCreated) {
            //create esb configs project
            let esbConfigsName: string = `${projectName}Configs`;
            ArtifactModule.CreateNewESBConfigProject(rootDirectory, esbConfigsName);
            isEsbProjectCreated = true;
        }

        let newFileName: string = `${name}.${ArtifactInfo.fileTypes.get(type)}`;

        let artifcatFolders: string[] = [APIArtifactInfo.DESTINATION_FOLDER, ProxyArtifactInfo.PROXY_DESTINATION_FOLDER, EndpointArtifactInfo.DESTINATION_FOLDER,
        InboundEndpointArtifactInfo.DESTINATION_FOLDER, LocalEntryArtifactInfo.DESTINATION_FOLDER, MessageStoreArtifactInfo.DESTINATION_FOLDER,
        MessageProcessorArtifactInfo.DESTINATION_FOLDER, TemplateArtifactInfo.DESTINATION_FOLDER, SequenceArtifactInfo.DESTINATION_FOLDER,
        TaskArtifactInfo.DESTINATION_FOLDER];

        let esbConfigsDirectory: string = Utils.getDirectoryFromDirectoryType(SubDirectories.CONFIGS, rootDirectory);
        if (esbConfigsDirectory.trim() === "unidentified") return;

        let destinationFolder: string = artifcatFolders[index];
        let destinationFilePath: string = path.join(esbConfigsDirectory, SRC, MAIN, SYNAPSE_CONFIG, destinationFolder, newFileName);
        let curruntArtifactPath: string = path.join(artifactXmlFilePath, "..", fileName);

        let edit = new WorkspaceEdit();
        edit.createFile(Uri.file(destinationFilePath));
        workspace.applyEdit(edit);
        fse.copySync(curruntArtifactPath, destinationFilePath);

        //update artifact.xml
        let configsArtifactfilePath: string = path.join(esbConfigsDirectory, ARTIFACT_FILE);
        let rootPomFilePath: string = path.join(rootDirectory, POM_FILE);
        let project: Utils.Project = Utils.getProjectInfoFromPOM(rootPomFilePath);
        let groupId: string = project.groupId;
        let finalGroupId: string = `${groupId}.${type.split("/")[1]}`;
        let filePath: string = [SRC, MAIN, SYNAPSE_CONFIG, destinationFolder, newFileName].join("/");
        Utils.addArtifactToArtifactXml(configsArtifactfilePath, name, finalGroupId, version, type, serverRole,
            filePath, undefined, undefined, undefined);

        //update composite pom.xml
        Utils.updateCompositePomXml(compositeExporterDirectory, name, type, serverRole, finalGroupId, version);

        //copy metadata files if there are any
        if ((type === APIArtifactInfo.TYPE) || (type === ProxyArtifactInfo.TYPE)) {
            let metadataGroupId: string = `${groupId}.${METADATA}`;
            copySynapseMetadataFiles(metadataDirectory, metadataFilePath, name, esbConfigsDirectory, compositeExporterDirectory,
                metadataGroupId);
        }
    }

    function copyRegistryResource(projectName: string, rootDirectory: string, compositeExporterDirectory: string,
        artifactXmlFilePath: string, name: string, type: string, version: string,
        serverRole: string, fileName: string) {

        if (!isRegistryResourcesProjectCreated) {
            //create registry resources project
            let registryResourcesName: string = `${projectName}RegistryResources`;
            ArtifactModule.CreateNewRegistryResourcesProject(rootDirectory, registryResourcesName);
            isRegistryResourcesProjectCreated = true;
        }

        let registryInfoFilePath: string = path.join(artifactXmlFilePath, "..", fileName);
        const buff: Buffer = fse.readFileSync(registryInfoFilePath);
        let xmlDoc = new DOM().parseFromString(buff.toString(), XML_TYPE);
        let items = xmlDoc.getElementsByTagName("item");

        let registryResourcesDirectory: string = Utils.getDirectoryFromDirectoryType(SubDirectories.REGISTRY_RESOURCES, rootDirectory);
        if (registryResourcesDirectory.trim() === "unidentified") return;

        if (items.length > 0) {

            let resourceFileName: string = items[0].getElementsByTagName("file")[0].textContent.trim();
            let resouceFilePath: string = path.join(artifactXmlFilePath, "..", RESOURECS, resourceFileName);
            let destinationFilePath: string = path.join(registryResourcesDirectory, resourceFileName);

            let edit = new WorkspaceEdit();
            edit.createFile(Uri.file(destinationFilePath));
            workspace.applyEdit(edit);
            fse.copySync(resouceFilePath, destinationFilePath);

            //update artifact.xml
            let artifactfilePath: string = path.join(registryResourcesDirectory, ARTIFACT_FILE);
            let rootPomFilePath: string = path.join(rootDirectory, POM_FILE);
            let project: Utils.Project = Utils.getProjectInfoFromPOM(rootPomFilePath);
            let groupId: string = project.groupId!;
            let finalGroupId: string = `${groupId}.${type.split("/")[1]}`;
            Utils.addArtifactToArtifactXml(artifactfilePath, name, finalGroupId, version, type, serverRole,
                undefined, undefined, undefined, items[0]);

            //update composite pom.xml
            Utils.updateCompositePomXml(compositeExporterDirectory, name, type, serverRole, finalGroupId, version);
        }
    }

    function copyEsbConnector(projectName: string, rootDirectory: string, compositeExporterDirectory: string,
        name: string, type: string, version: string, serverRole: string, fileName: string,
        artifactXmlFilePath: string) {

        if (!isConnectorModuleCreated) {
            //create connector exporter project
            let connectorExporterName: string = `${projectName}ConnectorExporter`;
            ConnectorModule.createNewConnectorExporter(rootDirectory, connectorExporterName);
            isConnectorModuleCreated = true;
        }

        let connectorExporterDirectory: string = Utils.getDirectoryFromDirectoryType(SubDirectories.CONNECTOR_EXPORTER, rootDirectory);
        if (connectorExporterDirectory.trim() === "unidentified") return;

        let connectorFilePath: string = path.join(artifactXmlFilePath, "..", fileName);
        let destinationFilePath: string = path.join(connectorExporterDirectory, fileName);

        let edit = new WorkspaceEdit();
        edit.createFile(Uri.file(destinationFilePath));
        workspace.applyEdit(edit);
        fse.copySync(connectorFilePath, destinationFilePath);

        //update artifact.xml
        let artifactfilePath: string = path.join(connectorExporterDirectory, ARTIFACT_FILE);
        let rootPomFilePath: string = path.join(rootDirectory, POM_FILE);
        let project: Utils.Project = Utils.getProjectInfoFromPOM(rootPomFilePath);
        let groupId: string = project.groupId!;
        let finalGroupId: string = `${groupId}.${type.split("/")[1]}`;
        Utils.addArtifactToArtifactXml(artifactfilePath, name, finalGroupId, version, type, serverRole,
            fileName, undefined, undefined, undefined);

        //update composite pom.xml
        Utils.updateCompositePomXml(compositeExporterDirectory, name, type, serverRole, finalGroupId, version);
    }

    function copyDataService(projectName: string, rootDirectory: string, compositeExporterDirectory: string,
        name: string, type: string, version: string, serverRole: string, fileName: string,
        artifactXmlFilePath: string) {

        if (!isDataServiceProjectCreated) {
            let dataServiceProjectName: string = `${projectName}DataService`;
            DataServiceModule.createProject(dataServiceProjectName, rootDirectory);
            isDataServiceProjectCreated = true;
        }

        let dataServiceFilePath: string = path.join(artifactXmlFilePath, "..", fileName);
        let newFileName: string = `${name}.${ArtifactInfo.fileTypes.get(type)}`;

        let dataServiceDirectory: string = Utils.getDirectoryFromDirectoryType(SubDirectories.DATA_SERVICE, rootDirectory);
        if (dataServiceDirectory.trim() === "unidentified") return;

        let destinationFilePath = path.join(dataServiceDirectory, "dataservice", newFileName);

        let edit = new WorkspaceEdit();
        edit.createFile(Uri.file(destinationFilePath));
        workspace.applyEdit(edit);
        fse.copySync(dataServiceFilePath, destinationFilePath);

        //update artifact.xml
        let artifactfilePath: string = path.join(dataServiceDirectory, ARTIFACT_FILE);
        let rootPomFilePath: string = path.join(rootDirectory, POM_FILE);
        let project: Utils.Project = Utils.getProjectInfoFromPOM(rootPomFilePath);
        let groupId: string = project.groupId!;
        let finalGroupId: string = `${groupId}.${type.split("/")[1]}`;
        let filePath: string = `dataservice/${newFileName}`
        Utils.addArtifactToArtifactXml(artifactfilePath, name, finalGroupId, version, type, serverRole,
            filePath, undefined, undefined, undefined);

        //update composite pom.xml
        Utils.updateCompositePomXml(compositeExporterDirectory, name, type, serverRole, finalGroupId, version);
    }

    function copyMediatorProjct(rootDirectory: string, name: string, version: string, serverRole: string,
        fileName: string, artifactXmlFilePath: string) {

        let jarFilePath: string = path.join(artifactXmlFilePath, "..", fileName);
        let extractDirectory: string = path.join(artifactXmlFilePath, "..", "tmp");
        let decompiledDirectory: string = path.join(extractDirectory, "decompiled");
        let manifestDirectory: string = path.join(decompiledDirectory, "META-INF");
        let manifestFilePath: string = path.join(manifestDirectory, "MANIFEST.MF");

        //decomplie .class files
        fernflower(jarFilePath, extractDirectory)
            .then((decompiledDir: any) => {
                //get package name from MANIFEST.MF
                const buf: Buffer = fse.readFileSync(manifestFilePath);
                let manifest = buf.toString();
                let manifestArray: string[] = manifest.split("Export-Package:");
                let packageArray: string = manifestArray[manifestArray.length - 1];
                packageArray = packageArray.split("\n")[0].trim();
                let packageName: string = packageArray.split(";")[0].trim();

                //remove manifest files
                if (fse.existsSync(manifestDirectory)) fse.removeSync(manifestDirectory);

                MediatorProjectModule.createProject(rootDirectory, name, packageName, version, serverRole);

                //copy java files
                let destinationDirectory: string = path.join(rootDirectory, name, SRC, MAIN, "java");
                if (fse.existsSync(destinationDirectory)) {
                    fse.copySync(decompiledDirectory, destinationDirectory);
                }
            })
            .catch((err: any) => console.log(err.stack));
    }

    function copySynapseMetadataFiles(metaDataDirectory: string, rootMetadataFilePath: string, artifactName: string,
        configsDirecrory: string, compositeDirectory: string, groupId: string) {

        const metadataBuffer: Buffer = fse.readFileSync(rootMetadataFilePath);
        let metadataXmlDoc = new DOM().parseFromString(metadataBuffer.toString(), XML_TYPE);
        let artifacts = metadataXmlDoc.getElementsByTagName("artifact");

        if (artifacts.length > 0) {
            let dependencyList = artifacts[0].getElementsByTagName("dependency");
            let metadataNameArray: string[] = [`${artifactName}_${METADATA}`, `${artifactName}_${SWAGGER}`, `${artifactName}_${PROXY_METADATA}`];
            let length: number = dependencyList.length;
            for (let i = 0; i < length; i++) {
                let metadataName: string = dependencyList[i].getAttribute("artifact");
                let metadataVersion: string = dependencyList[i].getAttribute(VERSION_TAG);
                let include: string = dependencyList[i].getAttribute("include").trim();

                if (include === "true") {
                    let index: number = metadataNameArray.indexOf(metadataName);
                    if (index !== -1) {
                        let folderName: string = `${metadataName}_${metadataVersion}`;
                        let artifactFilePath: string = path.join(metaDataDirectory, folderName, ARTIFACT_FILE);

                        if (!fse.existsSync(artifactFilePath)) continue;

                        const buff: Buffer = fse.readFileSync(artifactFilePath);
                        let xmlDoc = new DOM().parseFromString(buff.toString(), XML_TYPE);
                        let artifact = xmlDoc.getElementsByTagName("artifact")[0];
                        let name: string = artifact.getAttribute("name").trim();
                        let version: string = artifact.getAttribute("version").trim();
                        let type: string = artifact.getAttribute("type").trim();
                        let serverRole: string = artifact.getAttribute("serverRole").trim();
                        let fileName: string = artifact.getElementsByTagName("file")[0].textContent.trim();
                        let newFileName: string = `${name}.yaml`;

                        let metadataFilePath: string = path.join(metaDataDirectory, folderName, fileName);
                        if (!fse.existsSync(metadataFilePath)) continue;

                        let newMetadataFilePath: string = path.join(configsDirecrory, SRC, MAIN, RESOURECS, METADATA, newFileName);
                        let edit = new WorkspaceEdit();
                        edit.createFile(Uri.file(newMetadataFilePath));
                        workspace.applyEdit(edit);
                        fse.copySync(metadataFilePath, newMetadataFilePath);

                        //update artifact.xml
                        let artifactfilePath: string = path.join(configsDirecrory, ARTIFACT_FILE);
                        let filePath: string = [SRC, MAIN, RESOURECS, METADATA, newFileName].join("/");
                        Utils.addArtifactToArtifactXml(artifactfilePath, name, groupId, version, type, serverRole,
                            filePath, undefined, undefined, undefined);

                        //update composite pom.xml
                        Utils.updateCompositePomXml(compositeDirectory, name, type, serverRole, groupId, version);
                    }
                }
            }
        }
    }
}
