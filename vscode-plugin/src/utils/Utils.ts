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

import { Uri, window, workspace, WorkspaceEdit } from "vscode";
import * as fse from "fs-extra";
import * as path from 'path';
import {
    SubDirectories, ProjectNatures, APIArtifactInfo, ProxyArtifactInfo, ArtifactInfo, RegistryResourceInfo,
    ESBArtifactPath, Common
} from "../artifacts/artifactUtils";
import { ConnectorModule } from "../connector/ConnectorModule";
import { XMLSerializer as XMLSerializer } from 'xmldom';

let DOM = require('xmldom').DOMParser;
var fileSystem = require('fs');
import * as xml2js from "xml2js";
import { ArtifactModule } from "../artifacts/ArtifactModule";
import { MediatorProjectInfo } from "../mediatorProject/mediarorProjectUtils";

export namespace Utils {

    const dirName = __dirname;
    const SRC = ESBArtifactPath.SRC;
    const MAIN = ESBArtifactPath.MAIN;
    const RESOURECS = ESBArtifactPath.RESOURECS;
    const METADATA = ESBArtifactPath.METADATA;
    const SWAGGER = ESBArtifactPath.SWAGGER;
    const VERSION = Common.VERSION;
    const POM = Common.POM;
    const CONF = Common.CONF;
    const TEMPLATES = Common.TEMPLATES;
    const POM_FILE = Common.POM_FILE;
    const ARTIFACT_FILE = Common.ARTIFACT_FILE;
    const PROJECT_FILE = Common.PROJECT_FILE;
    const MODULE = Common.MODULE;
    const MODULES = Common.MODULES;
    const PROXY_METADATA = Common.PROXY_METADATA;
    const ARTIFACT_ID_TAG = Common.ARTIFACT_ID_TAG;
    const GROUP_ID_TAG = Common.GROUP_ID_TAG;
    const VERSION_TAG = Common.VERSION_TAG;
    const NAME_TAG = Common.NAME_TAG;
    const DEPENDENCIES_TAG = Common.DEPENDENCIES_TAG;
    const PLUGIN_TAG = Common.PLUGIN_TAG;

    export async function parseXmlContent(xmlString: string, options?: xml2js.OptionsV2): Promise<{}> {
        const opts: {} = Object.assign({ explicitArray: true }, options);
        return new Promise<{}>(
            (resolve: (value: {}) => void, reject: (e: Error) => void): void => {
                xml2js.parseString(xmlString, opts, (err: Error, res: {}) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            }
        );
    }

    export function validate(str: string) {
        checkWhiteSpaces(str);

        let regex = /^[a-zA-Z][a-zA-Z0-9_\-\. ]+$/;
        return regex.test(str);
    }

    export function validateGroupId(str: string) {
        checkWhiteSpaces(str);

        let regex = /^[a-zA-Z][a-zA-Z\. ]+$/;
        return regex.test(str);
    }

    export function validateRegistryPath(str: string) {
        checkWhiteSpaces(str);

        let regex = /^[a-zA-Z][/a-zA-Z0-9_\-\. ]+$/;
        return regex.test(str);
    }

    function checkWhiteSpaces(str: string) {
        if (!str.replace(/\s/g, '').length) {
            return false;
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

    /*
     * Create settings.json file withn .vscode folder.
     */
    export function createVsCodeSettingsFile(rootDirectory: string) {
        //create settings.json
        let settingsDirectory: string = path.join(rootDirectory, ".vscode");
        let settingsFilePath: string = path.join(settingsDirectory, "settings.json");

        if (!fse.existsSync(settingsDirectory)) fse.mkdirSync(settingsDirectory);

        let templateSettingsFilePath: string = path.join(dirName, "..", "..", TEMPLATES, CONF, "settings.json");
        let edit = new WorkspaceEdit();
        edit.createFile(Uri.file(settingsFilePath));
        workspace.applyEdit(edit);
        let settings: Buffer = fse.readFileSync(templateSettingsFilePath);
        fse.writeFileSync(settingsFilePath, settings);
    }

    /**
     * Interface that holds project information.
     */
    export interface Project {
        groupId: string;
        artifactId: string;
        version: string;
    }

    /*
     * Read pom.xml file and abstract project related info.
     */
    export function getProjectInfoFromPOM(pomFilePath: string): Project {
        const buf: Buffer = fse.readFileSync(pomFilePath);
        let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
        return {
            groupId: xmlDoc.getElementsByTagName(GROUP_ID_TAG)[0].textContent,
            artifactId: xmlDoc.getElementsByTagName(ARTIFACT_ID_TAG)[0].textContent,
            version: xmlDoc.getElementsByTagName(VERSION_TAG)[0].textContent
        };
    }

    /**
     * Delete Artifact form corresponding artifact.xml
     */
    export function deletefromArtifactXml(artifactXmlFilePath: string, artifactName: string) {

        if (!fse.existsSync(artifactXmlFilePath)) return;

        let buf: Buffer = fse.readFileSync(artifactXmlFilePath);
        let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");

        let artifacts = xmlDoc.getElementsByTagName("artifacts");
        if (artifacts.length < 1) return;
        let elementList = xmlDoc.getElementsByTagName("artifact");
        let listLength: number = elementList.length;

        for (let i = 0; i < listLength; i++) {
            let name: string = elementList[i].getAttribute(NAME_TAG).trim();
            if ((name === artifactName) || (name === (`${artifactName}_${METADATA}`)) ||
                (name === (`${artifactName}_${SWAGGER}`)) ||
                (name === (`${artifactName}_${PROXY_METADATA}`))) {
                artifacts[0].removeChild(elementList[i]);

            }
        }
        let data = new XMLSerializer().serializeToString(xmlDoc);
        fse.writeFileSync(artifactXmlFilePath, data);
    }

    /**
     * Delete artifact related information from composite pom.xml.
     */
    export function deleteArtifactFromPomXml(artifactName: string, artifactType: string, rootDirectory: string, groupId: string | undefined) {

        const pathToPomXml: string = path.join(getDirectoryFromDirectoryType(SubDirectories.COMPOSITE_EXPORTER, rootDirectory), POM_FILE);
        if (!fse.existsSync(pathToPomXml)) return;

        let rootPomXmlFilePath: string = path.join(rootDirectory, POM_FILE);
        let project: Project = getProjectInfoFromPOM(rootPomXmlFilePath);
        let rootGroupId = project.groupId;

        let buffer: Buffer = fse.readFileSync(pathToPomXml);
        let pomXmlDoc = new DOM().parseFromString(buffer.toString(), "text/xml")
        let dependencies = pomXmlDoc.getElementsByTagName(DEPENDENCIES_TAG);
        let dependencyList = dependencies[0].getElementsByTagName("dependency");
        let listLength: number = dependencyList.length;
        let artifactGroupId: string;

        if (typeof groupId !== "undefined") {
            artifactGroupId = groupId;
        }
        else {
            artifactGroupId = `${rootGroupId}.${artifactType}`;
        }

        //delete dependencies and properties in pom.xml
        for (let i = 0; i < listLength; i++) {

            let artifactId: string = dependencyList[i].getElementsByTagName(ARTIFACT_ID_TAG)[0].textContent.trim();
            let groupId: string = dependencyList[i].getElementsByTagName(GROUP_ID_TAG)[0].textContent.trim();

            if ((artifactId === artifactName) && (groupId === artifactGroupId)) {

                //remove dependancy
                let propertyTagName: string = `${groupId}_._${artifactName}`;
                dependencies[0].removeChild(dependencyList[i]);

                //remove property
                let properties = pomXmlDoc.getElementsByTagName("properties")[0];
                let property = properties.getElementsByTagName(propertyTagName);
                if (property.length > 0) properties.removeChild(property[0]);

                let data = new XMLSerializer().serializeToString(pomXmlDoc);
                fse.writeFileSync(pathToPomXml, data);

                //for api resource and proxy service
                let apiType: string = APIArtifactInfo.TYPE.split("/")[1];
                let proxyServiceType: string = ProxyArtifactInfo.TYPE.split("/")[1];
                if (artifactType === apiType) {

                    //delete swagger related information
                    let swaggerArtifactName: string = `${artifactName}_${SWAGGER}`;
                    deleteArtifactFromPomXml(swaggerArtifactName, METADATA, rootDirectory, undefined);

                    //delete metadata related imformation
                    let metadataArtifactName: string = `${artifactName}_${METADATA}`;
                    deleteArtifactFromPomXml(metadataArtifactName, METADATA, rootDirectory, undefined);

                    //delete swagger and metadata files
                    let syapseSubDirectory: string = getDirectoryFromDirectoryType(SubDirectories.CONFIGS, rootDirectory);
                    let metaDataDirectory: string = path.join(syapseSubDirectory, SRC, MAIN, RESOURECS, METADATA);
                    fse.remove(path.join(metaDataDirectory, `${artifactName}_${METADATA}.yaml`));
                    fse.remove(path.join(metaDataDirectory, `${artifactName}_${SWAGGER}.yaml`));
                }
                else if (artifactType === proxyServiceType) {

                    //delete metadata related imformation
                    let metadataArtifactName: string = `${artifactName}_${PROXY_METADATA}`;
                    deleteArtifactFromPomXml(metadataArtifactName, "proxy-service.metadata", rootDirectory, undefined);

                    let syapseSubDirectory: string = getDirectoryFromDirectoryType(SubDirectories.CONFIGS, rootDirectory);
                    let metaDataDirectory: string = path.join(syapseSubDirectory, SRC, MAIN, RESOURECS, METADATA);
                    fse.remove(path.join(metaDataDirectory, artifactName + "_proxy_metadata.yaml"));
                }
                return;
            }
        }
    }

    export function isExistDirectoryPattern(filePath: string, dirPattern: string): boolean {
        let regExpForDirPattern = new RegExp(dirPattern);
        return regExpForDirPattern.test(filePath);
    }

    /**
     * Check bulid plugin for each project before build.
     */
    export function checkBuildPlugins(filePath: string, directory: string) {

        //read pom xml
        const buf: Buffer = fse.readFileSync(filePath);
        let pomXmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
        let build = pomXmlDoc.getElementsByTagName("build")[0];

        let parentPlugin = build.getElementsByTagName("plugins")[0];
        let plugins = build.getElementsByTagName(PLUGIN_TAG);
        let length: number = plugins.length;
        let currentPluginIdArray: string[] = [];

        for (let i = 0; i < length; i++) {
            currentPluginIdArray[i] = plugins[i].getElementsByTagName(ARTIFACT_ID_TAG)[0].textContent.trim();
        }

        //read template file
        let fileName: string = directory + "Pom.xml";
        let buildTemplatePath: string = path.join(dirName, "..", "..", TEMPLATES, POM, fileName);
        const buff: Buffer = fse.readFileSync(buildTemplatePath);
        let templateXmlDoc = new DOM().parseFromString(buff.toString(), "text/xml");

        let newPlugins = templateXmlDoc.getElementsByTagName(PLUGIN_TAG);
        length = newPlugins.length

        for (let i = 0; i < length; i++) {
            let artifactId: string = newPlugins[i].getElementsByTagName(ARTIFACT_ID_TAG)[0].textContent.trim();
            let index: number = currentPluginIdArray.indexOf(artifactId);
            if (index === -1) parentPlugin.appendChild(newPlugins[i]);
        };

        let data = new XMLSerializer().serializeToString(pomXmlDoc);
        fse.writeFileSync(filePath, data);
    }

    /**
     * Get directory type when .project file is provided.
     */
    export function getDirectoryType(projectNatureFilePath: string): string {

        const buff: Buffer = fse.readFileSync(projectNatureFilePath);
        let xmlDoc = new DOM().parseFromString(buff.toString(), "text/xml");
        let projectNatures = xmlDoc.getElementsByTagName("nature");
        let directoryType: string = "unidentified";

        let projectNatureArray: string[] = [ProjectNatures.COMPOSITE_EXPORTER, ProjectNatures.CONFIGS, ProjectNatures.CONNECTOR_EXPORTER,
        ProjectNatures.REGISTRY_RESOURCES, ProjectNatures.DATA_SERVICE, ProjectNatures.DATA_SOURCE, ProjectNatures.MEDIATOR_PROJECT];

        let directoryTypeArray: string[] = [SubDirectories.COMPOSITE_EXPORTER, SubDirectories.CONFIGS, SubDirectories.CONNECTOR_EXPORTER,
        SubDirectories.REGISTRY_RESOURCES, SubDirectories.DATA_SERVICE, SubDirectories.DATA_SOURCE, SubDirectories.MEDIATOR_PROJECT];

        for (let i = 0; i < projectNatures.length; i++) {
            let index: number = projectNatureArray.indexOf(projectNatures[i].textContent.trim());
            if (index !== -1) {
                directoryType = directoryTypeArray[index];
                break;
            }
        }
        return directoryType;
    }

    /**
     * Get project directory when directory type is provided.
     */
    export function getDirectoryFromDirectoryType(directoryType: SubDirectories, rootDirectory: string): string {
        let directory: string = "unidentified";
        let SubDirectories: string[] = fileSystem.readdirSync(rootDirectory);

        SubDirectories.forEach((dir: any) => {
            let projConfigFilePath: string = path.join(rootDirectory, dir, PROJECT_FILE);
            if (fileSystem.existsSync(projConfigFilePath)) {
                let type: string = getDirectoryType(projConfigFilePath).trim();
                if (type === directoryType) {
                    directory = path.join(rootDirectory, dir);
                    return directory;
                }
            }
        });
        return directory;
    }

    /**
    * Create new Composite Exporter project.
    */
    export async function CreateNewCompositeExporterProject(rootDirectory: string, projectName: string) {

        //create new sub-directory
        //create pom.xml, artifact.xml and .project files
        let templatePomFilePath: string = path.join(dirName, "..", "..", TEMPLATES, POM, "CompositeExporterPom.xml");
        let templateProjNatureFilePath: string = path.join(dirName, "..", "..", TEMPLATES, CONF, "compositeExporter.xml");
        await createProject(projectName, "Composite Exporter Project", templatePomFilePath,
            templateProjNatureFilePath, SubDirectories.COMPOSITE_EXPORTER, false, rootDirectory, ProjectNatures.COMPOSITE_EXPORTER);
    }

    /**
    * Add Composite Exporter project into correct module possition in root pom.xml.
    */
    export function addCompositeExporterToRootPom(rootDirectory: string, projectName: string) {
        let rootPomFilePath: string = path.join(rootDirectory, POM_FILE);
        if (!fse.existsSync(rootPomFilePath)) {
            window.showErrorMessage("No root pom.xml found...!");
            return;
        }
        const rootPomBuffer: Buffer = fse.readFileSync(rootPomFilePath);
        let rootPomXmlDoc = new DOM().parseFromString(rootPomBuffer.toString(), "text/xml");
        let modules = rootPomXmlDoc.getElementsByTagName(MODULES)[0];
        let compositeExporterModule = rootPomXmlDoc.createElement(MODULE);
        compositeExporterModule.textContent = projectName.trim();

        modules.appendChild(compositeExporterModule);
        fse.writeFileSync(rootPomFilePath, new XMLSerializer().serializeToString(rootPomXmlDoc));
    }

    /**
    * Create XML file with given data.
    */
    export function createXmlFile(filePath: string, data: any): Uri {
        let fileUri: Uri = Uri.file(filePath);
        let edit = new WorkspaceEdit();
        edit.createFile(fileUri);
        workspace.applyEdit(edit);
        fse.writeFileSync(fileUri.fsPath, new XMLSerializer().serializeToString(data));
        return fileUri;
    }

    /**
     * Create new property in composite pom.xml. 
     */
    export function addNewProperty(xmlDoc: any, tagName: string, properties: any, serverRole: string) {
        let pomChild = xmlDoc.createElement(tagName);
        properties[0].appendChild(pomChild);
        pomChild.textContent = ["capp", serverRole].join("/");
    }

    /**
     * Create new dependency in composite pom.xml. 
     */
    export function addNewDependancy(xmlDoc: any, dependencies: any, artifactName: string, groupId: string,
        type: string | undefined, version?: string) {

        let dependancy = xmlDoc.createElement("dependency");
        dependencies[0].appendChild(dependancy);

        createAndAppendElement(xmlDoc, dependancy, GROUP_ID_TAG, groupId);
        createAndAppendElement(xmlDoc, dependancy, ARTIFACT_ID_TAG, artifactName);

        if (typeof version !== "undefined") {
            createAndAppendElement(xmlDoc, dependancy, VERSION_TAG, version);
        }
        else {
            createAndAppendElement(xmlDoc, dependancy, VERSION_TAG, VERSION);
        }

        if (typeof type !== "undefined") {
            createAndAppendElement(xmlDoc, dependancy, "type", type);
        }
    }

    /**
     * Create new xml element in xml DOM.
     */
    function createAndAppendElement(xmlDoc: any, parent: any, childName: string, content: string) {
        let childElement = xmlDoc.createElement(childName);
        childElement.textContent = content;
        parent.appendChild(childElement);
    }

    /**
    * Update composite pom.xml for new artifact.
    */
    export function updateCompositePomXml(compositeDirectory: string, name: string, type: string, serverRole: string,
        finalGroupId: string, version?: string) {

        //add entry to properties
        let compositePomFilePath: string = path.join(compositeDirectory, POM_FILE);
        if (!fse.existsSync(compositePomFilePath)) return;
        const buffer: Buffer = fse.readFileSync(compositePomFilePath);
        let pomXmlDoc = new DOM().parseFromString(buffer.toString(), "text/xml");
        let properties = pomXmlDoc.getElementsByTagName("properties");
        let artifatTagName: string = `${finalGroupId}_._${name}`;
        addNewProperty(pomXmlDoc, artifatTagName, properties, serverRole);

        //add new dependency
        let dependencies = pomXmlDoc.getElementsByTagName(DEPENDENCIES_TAG);
        let nextNode = properties[0].nextSibling;
        while (nextNode.nodeType != 1) {
            nextNode = nextNode.nextSibling;
        }

        //create dependencies tags if there are no
        if (nextNode.tagName.trim() !== DEPENDENCIES_TAG) {

            let repositories = pomXmlDoc.getElementsByTagName("repositories");
            let newDependancies = pomXmlDoc.createElement(DEPENDENCIES_TAG);
            pomXmlDoc.insertBefore(newDependancies, repositories[0]);
            dependencies[0] = newDependancies;
        }

        //skip creating <type></type> tags for mediator projects
        if (type === MediatorProjectInfo.TYPE) {
            addNewDependancy(pomXmlDoc, dependencies, name, finalGroupId, undefined, version)
        }
        else {
            addNewDependancy(pomXmlDoc, dependencies, name, finalGroupId, ArtifactInfo.fileTypes.get(type), version);
        }

        fse.writeFileSync(compositePomFilePath, new XMLSerializer().serializeToString(pomXmlDoc));
    }

    /**
    * Update artifact.xml for new artifact for,
    * ESB artifacts
    * Registry resources
    * ESB connectors
    * Data services
    */
    export function addArtifactToArtifactXml(artifactXmlFilePath: string, name: string, groupId: string, version: string,
        type: string, serverRole: string, file: string | undefined, path: string | undefined,
        mediaType: string | undefined, item: any) {

        if (!fse.existsSync(artifactXmlFilePath)) return;

        const buffer: Buffer = fse.readFileSync(artifactXmlFilePath);
        let xmlDoc = new DOM().parseFromString(buffer.toString(), "text/xml");
        let artifactsList = xmlDoc.getElementsByTagName("artifacts");
        let artifacts;
        if (artifactsList.length > 0) {
            artifacts = artifactsList[0];
        }
        else {
            artifacts = xmlDoc.createElement("artifacts");
            xmlDoc.appendChild(artifacts);
        }

        let artifact = xmlDoc.createElement("artifact");
        artifact.setAttribute("name", name);
        artifact.setAttribute("groupId", groupId);
        artifact.setAttribute("version", version);
        artifact.setAttribute("type", type);
        artifact.setAttribute("serverRole", serverRole);

        artifacts.appendChild(artifact);

        if (type === RegistryResourceInfo.TYPE && file && path && mediaType) {
            let child = xmlDoc.createElement("item");
            artifact.appendChild(child);

            let fileName = xmlDoc.createElement("file");
            fileName.textContent = file;
            child.appendChild(fileName);

            let filePath = xmlDoc.createElement("path");
            filePath.textContent = path;
            child.appendChild(filePath);

            let resourceMediatype = xmlDoc.createElement("mediaType");
            resourceMediatype.textContent = mediaType;
            child.appendChild(resourceMediatype);

            let properties = xmlDoc.createElement("properties");
            child.appendChild(properties);
        }
        else if (type === RegistryResourceInfo.TYPE && typeof item !== "undefined") {
            artifact.appendChild(item);
        }
        else if (type !== RegistryResourceInfo.TYPE && typeof file !== "undefined") {
            let child = xmlDoc.createElement("file");
            child.textContent = file;
            artifact.appendChild(child);
        }

        fse.writeFileSync(artifactXmlFilePath, new XMLSerializer().serializeToString(xmlDoc));
    }

    /**
    * Delete project information from root pom.xml.
    */
    export function safeDeteteProject(subDirectory: string) {
        if (workspace.workspaceFolders) {
            let rootDirectory: string = workspace.workspaceFolders[0].uri.fsPath;
            let rootPomFilePath: string = path.join(rootDirectory, POM_FILE);
            if (!fse.existsSync(rootPomFilePath)) return;

            //check wheher a top level module was deleted
            let parentDirectory: string = path.join(subDirectory, "..");
            if (rootDirectory.trim() !== parentDirectory.trim()) return;

            const buffer: Buffer = fse.readFileSync(rootPomFilePath);
            let rootPomXmlDoc = new DOM().parseFromString(buffer.toString(), "text/xml");

            let dirArray: string[] = subDirectory.split(path.sep);
            let projectName: string = dirArray[dirArray.length - 1];

            let modules = rootPomXmlDoc.getElementsByTagName(MODULES)[0];
            let subModules = rootPomXmlDoc.getElementsByTagName(MODULE);
            let length = subModules.length;
            for (let i = 0; i < length; i++) {
                if (subModules[i].textContent.trim() === projectName) {
                    modules.removeChild(subModules[i]);
                    break;
                }
            }
            fse.writeFileSync(rootPomFilePath, new XMLSerializer().serializeToString(rootPomXmlDoc));
        }
    }

    /**
   * Create pom.xml, artifact.xml, and .project files for newly created project.
   */
    export function createConfigurationFiles(projectName: string, directory: string, templateProjectNaturePath: string,
        templatePomXmlPath: string, createArtifactXml: boolean) {

        let rootDirectory: string = path.join(directory, "..");
        let rootPomFilePath: string = path.join(rootDirectory, POM_FILE);
        let pomFilePath: string = path.join(directory, POM_FILE);
        let project: Project = getProjectInfoFromPOM(rootPomFilePath);

        //add new pom.xml
        const buff: Buffer = fse.readFileSync(templatePomXmlPath);
        let pomXmlDoc = new DOM().parseFromString(buff.toString(), "text/xml");

        let artifactIds = pomXmlDoc.getElementsByTagName(ARTIFACT_ID_TAG);
        let groupIds = pomXmlDoc.getElementsByTagName(GROUP_ID_TAG);
        let versions = pomXmlDoc.getElementsByTagName(VERSION_TAG);
        let childProjectName = pomXmlDoc.getElementsByTagName(NAME_TAG)[0];
        let childProjectDescription = pomXmlDoc.getElementsByTagName("description")[0];

        //parent
        artifactIds[0].textContent = project.artifactId;
        groupIds[0].textContent = project.groupId;
        versions[0].textContent = project.version;

        //child
        artifactIds[1].textContent = projectName.trim();
        groupIds[1].textContent = project.groupId;
        versions[1].textContent = project.version;
        childProjectName.textContent = projectName.trim();
        childProjectDescription.textContent = projectName.trim();

        createXmlFile(pomFilePath, pomXmlDoc);

        //add new .project file
        //read template file
        const buf: Buffer = fse.readFileSync(templateProjectNaturePath);
        let projectNature = new DOM().parseFromString(buf.toString(), "text/xml");

        let name = projectNature.getElementsByTagName(NAME_TAG)[0];
        name.textContent = projectName.trim();

        let projectNatureFilePath: string = path.join(directory, PROJECT_FILE);
        createXmlFile(projectNatureFilePath, projectNature);

        if (createArtifactXml) {
            //create new artifact.xml
            //read template file
            let templateArtifactFilePath: string = path.join(dirName, "..", "..", TEMPLATES, CONF, ARTIFACT_FILE);
            const buffer: Buffer = fse.readFileSync(templateArtifactFilePath);
            let artifacts = new DOM().parseFromString(buffer.toString(), "text/xml");

            let artifactFilePath: string = path.join(directory, ARTIFACT_FILE);
            createXmlFile(artifactFilePath, artifacts);
        }
    }

    /**
   * Can be used to create,
   * Composite Exporter
   * ESB Configs
   * Registry Resources
   * Connector Exporter &
   * add it to root pom.xml.
   */
    export async function createProject(projectName: string, type: string, templatePomFilePath: string,
        templateProjNatureFilePath: string, directoryType: string, createArtifactXml: boolean,
        rootDirectory: string, projectNature: ProjectNatures) {

        const currentDirectory: string = getDirectoryFromDirectoryType(directoryType, rootDirectory).trim();
        if (currentDirectory !== "unidentified") {
            let decision = await window.showWarningMessage(`WSO2 Enterprise Integrator Extension can not handle more than one ${type},
                Do you want to continue?`, "Yes", "No");
            if (decision && (decision.trim() === "Yes")) {
                let newDirectory: string = path.join(rootDirectory, projectName);
                if (fse.existsSync(newDirectory)) {
                    window.showErrorMessage(`${type} name already exists!`);
                    return;
                }
                fse.mkdirSync(newDirectory);
                //add artifact.xml, pom.xml and .project
                createConfigurationFiles(projectName, newDirectory, templateProjNatureFilePath, templatePomFilePath, createArtifactXml);
                addProjectToRootPom(projectName, projectNature, rootDirectory);
            }
        }
        else {
            let newDirectory: string = path.join(rootDirectory, projectName);
            if (fse.existsSync(newDirectory)) {
                window.showErrorMessage(`${type} name already exists!`);
                return;
            }
            fse.mkdirSync(newDirectory);
            //add artifact.xml, pom.xml and .project
            createConfigurationFiles(projectName, newDirectory, templateProjNatureFilePath, templatePomFilePath, createArtifactXml);
            addProjectToRootPom(projectName, projectNature, rootDirectory);
        }
    }

    function addProjectToRootPom(projectName: string, projectNature: ProjectNatures, rootDirectory: string) {
        if (projectNature === ProjectNatures.COMPOSITE_EXPORTER) {
            addCompositeExporterToRootPom(rootDirectory, projectName);
        }
        else if (projectNature === ProjectNatures.CONFIGS) {
            ArtifactModule.addESBConfigsToRootPom(rootDirectory, projectName);
        }
        else if (projectNature === ProjectNatures.REGISTRY_RESOURCES) {
            ArtifactModule.addRegistryResourcesToRootPom(rootDirectory, projectName);
        }
        else if (projectNature === ProjectNatures.CONNECTOR_EXPORTER) {
            ConnectorModule.addConnectorExporterToRootPom(rootDirectory, projectName);
        }
    }
}
