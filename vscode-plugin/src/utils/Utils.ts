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


import {Uri, window, workspace, WorkspaceEdit} from "vscode";
import * as fse from "fs-extra";
import * as path from 'path';
import {SubDirectories, ProjectNatures, APIArtifactInfo, ProxyArtifactInfo, ArtifactInfo, RegistryResourceInfo, EndpointArtifactInfo, InboundEndpointArtifactInfo, MessageProcessorArtifactInfo, MessageStoreArtifactInfo, SequenceArtifactInfo, TaskArtifactInfo, TemplateArtifactInfo } from "../artifacts/artifactUtils";
import { ConnectorModule } from "../connector/ConnectorModule";
import {XMLSerializer as XMLSerializer} from 'xmldom';

let DOM = require('xmldom').DOMParser;
let glob = require("glob");
const YAML = require("js-yaml");
var file_system = require('fs');
import * as xml2js from "xml2js";
import { ArtifactModule } from "../artifacts/ArtifactModule";
import { MediatorProjectInfo } from "../mediatorProject/mediarorProjectUtils";

export namespace Utils {

    const dirName = __dirname;

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
        if (!str.replace(/\s/g, '').length) {
            return false;
        }
        let regex = /^[a-zA-Z][a-zA-Z0-9_\-\. ]+$/;
        return regex.test(str);
    }

    export function validateGroupId(str: string) {
        if (!str.replace(/\s/g, '').length) {
            return false;
        }
        let regex = /^[a-zA-Z][a-zA-Z\. ]+$/;
        return regex.test(str);
    }

    export function validateRegistryPath(str: string) {
        if (!str.replace(/\s/g, '').length) {
            return false;
        }
        let regex = /^[a-zA-Z][/a-zA-Z0-9_\-\. ]+$/;
        return regex.test(str);
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
     * Interface that holds project information.
     */
     export interface Project {
        groupId?: string;
        artifactId?: string;
        version?: string;
    }

    /*
     * Read pom.xml file and abstract project related info.
     */
     export function getProjectInfoFromPOM(pomFilePath: string): Project {
        const buf: Buffer = fse.readFileSync(pomFilePath);
        let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
        return {
            groupId: xmlDoc.getElementsByTagName("groupId")[0].textContent,
            artifactId: xmlDoc.getElementsByTagName("artifactId")[0].textContent,
            version: xmlDoc.getElementsByTagName("version")[0].textContent
        };
    }

    /**
     * Delete Artifact form corresponding artifact.xml
     */
    export function deletefromArtifactXml(artifactXmlFilePath: string, artifactName: string){

        if(!fse.existsSync(artifactXmlFilePath)) return;

        let buf: Buffer = fse.readFileSync(artifactXmlFilePath);
        let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");

        let artifacts = xmlDoc.getElementsByTagName("artifacts");
        if(artifacts.length < 1) return;
        let elementList = xmlDoc.getElementsByTagName("artifact");
        let listLength: number = elementList.length;

        for (let i = 0; i < listLength; i++) {
            let name: string = elementList[i].getAttribute("name").trim();
            if ((name === artifactName) || (name === (artifactName + "_metadata")) ||
                (name === (artifactName + "_swagger")) || 
                (name === (artifactName + "_proxy_metadata"))) {
                artifacts[0].removeChild(elementList[i]);
                
            }
        }
        let data = new XMLSerializer().serializeToString(xmlDoc);
        fse.writeFileSync(artifactXmlFilePath, data);

    }

    /**
     * Delete artifact related information from composite pom.xml.
     */
    export function deleteArtifactFromPomXml(artifactName: string, artifactType: string, rootDirectory: string, groupId?: string){

        //const pomSubdirectory: string = workspaceFolder.name + SubDirectories.COMPOSITE_EXPORTER;
        const pathToPomXml:string = path.join(getDirectoryFromDirectoryType(SubDirectories.COMPOSITE_EXPORTER, rootDirectory), "pom.xml");

        if(!fse.existsSync(pathToPomXml)) return;

        let rootPomXmlFilePath: string = path.join(workspace.workspaceFolders![0].uri.fsPath, "pom.xml");
        let project:  Utils.Project =  Utils.getProjectInfoFromPOM(rootPomXmlFilePath);
        const {rootGroupId, version} = Object.assign(project);

        let buffer: Buffer = fse.readFileSync(pathToPomXml);
        let pomXmlDoc = new DOM().parseFromString(buffer.toString(), "text/xml")
        let dependencies = pomXmlDoc.getElementsByTagName("dependencies");
        let dependencyList = dependencies[0].getElementsByTagName("dependency");
        let listLength: number = dependencyList.length;
        let artifactGroupId: string;

        if(typeof groupId !== "undefined"){
            artifactGroupId = groupId;
        }
        else{
            artifactGroupId = `${rootGroupId}.${artifactType}`;
        }

        //delete metadata dependencies and properties in pom.xml
        for (let i = 0; i < listLength; i++) {

            let id: string = dependencyList[i].getElementsByTagName("artifactId")[0].textContent.trim();
            let groupId: string = dependencyList[i].getElementsByTagName("groupId")[0].textContent.trim();

            if((id === artifactName) && (groupId === artifactGroupId)){
            
                //remove dependancy
                let propertyTagName: string = `${groupId}_._${artifactName}`;
                dependencies[0].removeChild(dependencyList[i]);
            
                //remove property
                let properties = pomXmlDoc.getElementsByTagName("properties")[0];
                let property = properties.getElementsByTagName(propertyTagName);
                if(property.length > 0) properties.removeChild(property[0]);

                let data = new XMLSerializer().serializeToString(pomXmlDoc);
                fse.writeFileSync(pathToPomXml, data);

                //for api resource and proxy service
                let apiType: string = APIArtifactInfo.TYPE.split("/")[1];
                let proxyServiceType: string = ProxyArtifactInfo.TYPE.split("/")[1];
                if(artifactType === apiType){

                    //delete swagger related information
                    let swaggerArtifactName: string = `${artifactName}_swagger`;
                    deleteArtifactFromPomXml(swaggerArtifactName, "metadata", rootDirectory);

                    //delete metadata related imformation
                    let metadataArtifactName: string = `${artifactName}_metadata`;
                    deleteArtifactFromPomXml(metadataArtifactName, "metadata", rootDirectory);

                    //delete swagger and metadata files
                    let syapseSubDirectory: string = getDirectoryFromDirectoryType(SubDirectories.CONFIGS, rootDirectory); 
                    let metaDataDirectory: string = path.join(syapseSubDirectory, "src", "main", "resources", "metadata");
                    fse.remove(path.join(metaDataDirectory, artifactName + "_metadata.yaml"));
                    fse.remove(path.join(metaDataDirectory, artifactName + "_swagger.yaml"));
                }
                else if(artifactType === proxyServiceType){

                    //delete metadata related imformation
                    let metadataArtifactName: string = `${artifactName}_proxy_metadata`;
                    deleteArtifactFromPomXml(metadataArtifactName, "proxy-service.metadata", rootDirectory);

                    let syapseSubDirectory: string = getDirectoryFromDirectoryType(SubDirectories.CONFIGS, rootDirectory);
                    let metaDataDirectory: string = path.join(syapseSubDirectory, "src", "main", "resources", "metadata");
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
    export function checkBuildPlugins(filePath: string, directory: string){

        //read pom xml
        const buf: Buffer = fse.readFileSync(filePath);
        let pomXmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
        let build = pomXmlDoc.getElementsByTagName("build")[0];
        
        let parentPlugin = build.getElementsByTagName("plugins")[0];
        let plugins = build.getElementsByTagName("plugin");
        let currentPluginsArray: string[] = [plugins.length];

        const currentPluginsMap = new Map();
        let length: number = plugins.length;

        for(let i=0; i<length; i++){
            let artifactId: string = currentPluginsArray[i] = plugins[i].getElementsByTagName("artifactId")[0].textContent.trim();
            currentPluginsMap.set(artifactId,plugins[i]);
            
        }
        
        //read template file
        let buildTemplatePath: string = path.join(dirName, "..", "..", "templates", "pom");
        let fileName: string = directory + "Pom.xml";
        buildTemplatePath = path.join(buildTemplatePath, fileName);
        const buff: Buffer = fse.readFileSync(buildTemplatePath);
        let templateXmlDoc = new DOM().parseFromString(buff.toString(), "text/xml");
        
        let newPlugins = templateXmlDoc.getElementsByTagName("plugin");
        length = newPlugins.length

        for(let i=0; i<length; i++){
            let artifactId: string = newPlugins[i].getElementsByTagName("artifactId")[0].textContent.trim();
            if(!currentPluginsMap.has(artifactId)) parentPlugin.appendChild(newPlugins[i]);
        };
            
        let data = new XMLSerializer().serializeToString(pomXmlDoc);
        fse.writeFileSync(filePath, data);
    }

    /**
     * Get directory type when .project file is provided.
     */
    export function getDirectoryType(projectNatureFilePath: string): string{

        const buff: Buffer = fse.readFileSync(projectNatureFilePath);
        let xmlDoc = new DOM().parseFromString(buff.toString(), "text/xml");
        let projectNatures = xmlDoc.getElementsByTagName("nature");
        let nature: string = "unidentified";

        let projectNatureArray: string[] = [ProjectNatures.COMPOSITE_EXPORTER, ProjectNatures.CONFIGS, ProjectNatures.CONNECTOR_EXPORTER, 
            ProjectNatures.REGISTRY_RESOURCES, ProjectNatures.DATA_SERVICE, ProjectNatures.DATA_SOURCE, ProjectNatures.MEDIATOR_PROJECT];

        let subDirectoryArray: string[] = [SubDirectories.COMPOSITE_EXPORTER, SubDirectories.CONFIGS, SubDirectories.CONNECTOR_EXPORTER, 
            SubDirectories.REGISTRY_RESOURCES, SubDirectories.DATA_SERVICE, SubDirectories.DATA_SOURCE, SubDirectories.MEDIATOR_PROJECT];
        
        for(let i=0; i<projectNatures.length; i++){
            let index: number = projectNatureArray.indexOf(projectNatures[i].textContent.trim());
            if(index !== -1){
                nature = subDirectoryArray[index];
                break;
            }
        }
        return nature;  
    }

    /**
     * Get project directory when directory type is provided.
     */
    export function getDirectoryFromDirectoryType(directoryType: SubDirectories, rootDirectory: string): string{
        let requiredDirectory: string = "unidentified";
        let fileNames: string[] = file_system.readdirSync(rootDirectory);

        fileNames.forEach( (file: any) => {
            let projConfigFilePath: string = path.join(rootDirectory, file, ".project");
            if (file_system.existsSync(projConfigFilePath)) {
                let nature: string = getDirectoryType(projConfigFilePath).trim();
                if(nature === directoryType){
                    requiredDirectory = path.join(rootDirectory, file);
                    return requiredDirectory;
                }
            }
        });
        return requiredDirectory;
    }

    /**
    * Create new Composite Exporter project.
    */
    export function CreateNewCompositeExporterProject(rootDirectory: string, projectName: string){

        //create new sub-directory
        //create pom.xml, artifact.xml and .project files
        let templatePomFilePath: string = path.join(dirName, "..", "..", "templates", "pom", "CompositeExporterPom.xml");
        let templateProjNatureFilePath: string = path.join(dirName, "..", "..", "templates", "Conf", "compositeExporter.xml")
        Utils.createProject(projectName, "Composite Exporter Project", templatePomFilePath, 
            templateProjNatureFilePath, SubDirectories.COMPOSITE_EXPORTER, false, rootDirectory, ProjectNatures.COMPOSITE_EXPORTER);
    
    }

    /**
    * Add Composite Exporter project into correct module possition in root pom.xml.
    */
    export function addCompositeExporterToRootPom(rootDirectory: string, projectName: string){
        let rootPomFilePath: string = path.join(rootDirectory, "pom.xml");
        if(!fse.existsSync(rootPomFilePath)){
            window.showErrorMessage("No root pom.xml found...!");
            return;
        }
        const rootPomBuffer: Buffer = fse.readFileSync(rootPomFilePath);
        let rootPomXmlDoc = new DOM().parseFromString(rootPomBuffer.toString(), "text/xml");
        let modules = rootPomXmlDoc.getElementsByTagName("modules")[0];
        let connectorModule = rootPomXmlDoc.createElement("module");
        connectorModule.textContent = projectName.trim();

        modules.appendChild(connectorModule);
        fse.writeFileSync(rootPomFilePath, new XMLSerializer().serializeToString(rootPomXmlDoc));
    }

    /**
    * Create XML file with given data.
    */
    export function createXmlFile(filePath: string, data: any): Uri{
        let fileUri:Uri = Uri.file(filePath);
        let edit = new WorkspaceEdit();
        edit.createFile(fileUri);
        workspace.applyEdit(edit);
        fse.writeFileSync(fileUri.fsPath, new XMLSerializer().serializeToString(data));
        return fileUri;
    }

    /**
     * Create new property in composite pom.xml. 
     */
     export function addNewProperty(xmlDoc: any, tagName: string, properties: any, serverRole: string){
        let pomChild = xmlDoc.createElement(tagName);
        properties[0].appendChild(pomChild);
        pomChild.textContent = ["capp", serverRole].join("/");
    }

    /**
     * Create new dependency in composite pom.xml. 
     */
    export function addNewDependancy(xmlDoc: any, dependencies: any, artifactName: string, groupId: string, type: string | undefined, version?: string){
        let dependancy = xmlDoc.createElement("dependency");
        dependencies[0].appendChild(dependancy);
        createAndAppendElement(xmlDoc, dependancy,"groupId", groupId);
        createAndAppendElement(xmlDoc, dependancy,"artifactId", artifactName);
        if(typeof version !== "undefined"){
            createAndAppendElement(xmlDoc, dependancy,"version",version);
        }
        else{
            createAndAppendElement(xmlDoc, dependancy,"version","1.0.0");
        }
        
        if(typeof type !== "undefined"){
            createAndAppendElement(xmlDoc, dependancy,"type",type);
        }
    }

    /**
     * Create new xml element in xml DOM.
     */
    function createAndAppendElement(xmlDoc: any, parent: any, childName: string, content: string){
        let childElement = xmlDoc.createElement(childName);
        childElement.textContent = content;
        parent.appendChild(childElement);
    }

    /**
    * Update composite pom.xml for new artifact.
    */
    export function updateCompositePomXml(compositeDirectory: string, name: string, type: string, serverRole: string, finalGroupId: string, version?: string){
        
        //add entry to properties
        let compositePomFilePath : string = path.join(compositeDirectory, "pom.xml");
        if(!fse.existsSync(compositePomFilePath)) return;
        const buffer: Buffer = fse.readFileSync(compositePomFilePath);
        let pomXmlDoc = new DOM().parseFromString(buffer.toString(), "text/xml");
        let properties = pomXmlDoc.getElementsByTagName("properties");
        let artifatTagName:string = `${finalGroupId}_._${name}`;
        addNewProperty(pomXmlDoc, artifatTagName, properties, serverRole);

        //add new dependency
        let dependencies = pomXmlDoc.getElementsByTagName("dependencies");
        let nextNode = properties[0].nextSibling;
        while (nextNode.nodeType != 1) {
            nextNode = nextNode.nextSibling;
        }

        //create dependencies tags if there are no
        if(nextNode.tagName.trim() !== "dependencies"){
            
            let repositories = pomXmlDoc.getElementsByTagName("repositories");
            let newDependancies = pomXmlDoc.createElement("dependencies");
            pomXmlDoc.insertBefore(newDependancies, repositories[0]);
            dependencies[0] = newDependancies;
        }

        //skip creating <type></type> tags for mediator projects
        if(type === MediatorProjectInfo.TYPE){
            addNewDependancy(pomXmlDoc, dependencies, name, finalGroupId, undefined, version)
        }
        else{
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
                                            type: string,serverRole: string, file: string | undefined, path: string | undefined,
                                            mediaType: string | undefined, item: any){

        if(!fse.existsSync(artifactXmlFilePath)) return;

        const buffer: Buffer = fse.readFileSync(artifactXmlFilePath);
        let xmlDoc = new DOM().parseFromString(buffer.toString(), "text/xml");
        let artifactsList = xmlDoc.getElementsByTagName("artifacts");
        let artifacts;
        if(artifactsList.length > 0){
            artifacts = artifactsList[0];
        }
        else{
            artifacts = xmlDoc.createElement("artifacts");
            xmlDoc.appendChild(artifacts);
        }

        let artifact = xmlDoc.createElement("artifact");
        artifact.setAttribute("name", name);
        artifact.setAttribute("groupId",groupId);
        artifact.setAttribute("version", version);
        artifact.setAttribute("type", type);
        artifact.setAttribute("serverRole", serverRole);

        artifacts.appendChild(artifact);

        if(type === RegistryResourceInfo.TYPE && file && path && mediaType){
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
        else if(type === RegistryResourceInfo.TYPE && typeof item !== "undefined"){
            artifact.appendChild(item);
        }
        else if(type !== RegistryResourceInfo.TYPE && typeof file !== "undefined"){
            let child = xmlDoc.createElement("file");
            child.textContent = file;
            artifact.appendChild(child);
        }

        fse.writeFileSync(artifactXmlFilePath, new XMLSerializer().serializeToString(xmlDoc));
   }

    /**
    * Delete project information from root pom.xml.
    */
    export function safeDeteteProject(subDirectory: string){
        if(workspace.workspaceFolders){
            let rootDirectory: string = workspace.workspaceFolders[0].uri.fsPath;
            let rootPomFilePath: string = path.join(rootDirectory, "pom.xml");
            if(!fse.existsSync(rootPomFilePath)) return;

            //check wheher a top level module was deleted
            let parentDirectory: string = path.join(subDirectory, "..");
            if(rootDirectory.trim() !== parentDirectory.trim()) return;

            const buffer: Buffer = fse.readFileSync(rootPomFilePath);
            let rootPomXmlDoc = new DOM().parseFromString(buffer.toString(), "text/xml");

            let dirSplit: string[] = subDirectory.split(path.sep);
            let projectName: string = dirSplit[dirSplit.length - 1];

            let modules = rootPomXmlDoc.getElementsByTagName("modules")[0];
            let subModules = rootPomXmlDoc.getElementsByTagName("module");
            let length = subModules.length;
            for(let i=0; i<length; i++){
                if(subModules[i].textContent.trim() === projectName){
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
        templatePomXmlPath: string, createArtifactXml: boolean){

        let rootDirectory: string = path.join(directory, "..");
        let rootPomFilePath: string = path.join(rootDirectory, "pom.xml");
        let pomFilePath: string = path.join(directory, "pom.xml");
        let project: Project = getProjectInfoFromPOM(rootPomFilePath);

        //add new pom.xml
        const buff: Buffer = fse.readFileSync(templatePomXmlPath);
        let pomXmlDoc = new DOM().parseFromString(buff.toString(), "text/xml");

        let artifactIds =pomXmlDoc.getElementsByTagName("artifactId");
        let groupIds =pomXmlDoc.getElementsByTagName("groupId");
        let versions =pomXmlDoc.getElementsByTagName("version");
        let childProjectName = pomXmlDoc.getElementsByTagName("name")[0];
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
        let projectNature  = new DOM().parseFromString(buf.toString(), "text/xml");

        let name = projectNature.getElementsByTagName("name")[0];
        name.textContent = projectName.trim(); 

        let projectNatureFilePath: string = path.join(directory, ".project");
        createXmlFile(projectNatureFilePath,projectNature);

        if(createArtifactXml){
        //create new artifact.xml
        //read template file
        let templateArtifactFilePath: string = path.join(dirName, "..", "..", "templates", "Conf", "artifact.xml");
        const buffer: Buffer = fse.readFileSync(templateArtifactFilePath);
        let artifacts  = new DOM().parseFromString(buffer.toString(), "text/xml");

        let artifactFilePath: string = path.join(directory, "artifact.xml");
        createXmlFile(artifactFilePath,artifacts);
        }
    }

    export async function createProject(projectName: string, type: string, templatePomFilePath: string,
                                        templateProjNatureFilePath: string, directoryType: string, 
                                        createArtifactXml: boolean, rootDirectory: string,
                                        projectNature: ProjectNatures){

        const currentDirectory: string = Utils.getDirectoryFromDirectoryType(directoryType, rootDirectory).trim();
        if(currentDirectory !== "unidentified"){
            window.showWarningMessage(`WSO2 Enterprise Integrator Extension can not handle more than one ${type} &
            Handling more than one ${type} is under user's control, Do you want to continue?`, "Yes", "No").then(decision => {
                if(decision && (decision.trim() === "Yes")){

                    let newDirectory: string = path.join(rootDirectory, projectName);
                    if(fse.existsSync(newDirectory)){
                        window.showErrorMessage(`${type} name already exists!`);
                        return;
                    }
                    fse.mkdirSync(newDirectory);
                    //add artifact.xml, pom.xml and .project
                    Utils.createConfigurationFiles(projectName, newDirectory, templateProjNatureFilePath, templatePomFilePath, createArtifactXml);
                    addProjectToRootPom(projectName, projectNature, rootDirectory);
                }
            });
        }
        else{
            let newDirectory: string = path.join(rootDirectory, projectName);
            if(fse.existsSync(newDirectory)){
                window.showErrorMessage(`${type} name already exists!`);
                return;
            }
            fse.mkdirSync(newDirectory);
            //add artifact.xml, pom.xml and .project
            Utils.createConfigurationFiles(projectName, newDirectory, templateProjNatureFilePath, templatePomFilePath, createArtifactXml);
            addProjectToRootPom(projectName, projectNature, rootDirectory);
        }
    }

    function addProjectToRootPom(projectName: string, projectNature: ProjectNatures, rootDirectory: string){
        if(projectNature === ProjectNatures.COMPOSITE_EXPORTER){
            Utils.addCompositeExporterToRootPom(rootDirectory, projectName);
        }
        else if(projectNature === ProjectNatures.CONFIGS){
            ArtifactModule.addESBConfigsToRootPom(rootDirectory, projectName);
        }
        else if(projectNature === ProjectNatures.REGISTRY_RESOURCES){
            ArtifactModule.addRegistryResourcesToRootPom(rootDirectory, projectName);
        }
        else if(projectNature === ProjectNatures.CONNECTOR_EXPORTER){
            ConnectorModule.addConnectorExporterToRootPom(rootDirectory, projectName);
        }
    }
}
