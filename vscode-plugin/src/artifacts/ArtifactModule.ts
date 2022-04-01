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
import {LocalEntryArtifactInfo, ServerRoleInfo, SubDirectories} from "./artifactUtils";
import {XMLSerializer as XMLSerializer} from 'xmldom';
import {RegistryResource} from "./artifactResolver";
import { dir } from "console";

let DOM = require('xmldom').DOMParser;
let glob = require("glob");
const YAML = require("js-yaml");

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
            const subFolder: string = synapseWorkspace.name + SubDirectories.CONFIGS;
            const pathToTargetFolder = path.join(synapseWorkspace.uri.fsPath, subFolder, "src", "main", "synapse-config",
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
            const registryResourceSubDirectory:string = synapseWorkspace.name + SubDirectories.REGISTRY_RESOURCES;

            const targetFolderPath = path.join(synapseWorkspace.uri.fsPath, registryResourceSubDirectory);

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
        
        //create artifact
        if (workspace.workspaceFolders && (registryResource === undefined)) {

            
            let pattern = path.join("*", targetArtifactName + getFileExtension(registryResource));

            let subDirectory: string = workspace.workspaceFolders[0].name + SubDirectories.CONFIGS;
            let cwd = path.join(workspace.workspaceFolders[0].uri.fsPath, subDirectory, "src", "main", resourceType);

            const compositeExporterDirectory: string = workspace.workspaceFolders[0].name + SubDirectories.COMPOSITE_EXPORTER;

             //target metadata.yaml and swagger.yaml folder
             let pathtoResourcesFile = path.join(workspace.workspaceFolders[0].uri.fsPath, subDirectory, "src", "main", "resources", "metadata");

            let newGlob = new glob(pattern, {cwd: cwd}, async function (err: any, files: any) {
                if (err) {
                    window.showErrorMessage("Error creating " + targetArtifactName + " artifact!. ERROR: " + err);
                    return;
                }
                if (files.length > 0) {
                    // file name already exists in the project.
                    window.showErrorMessage("Error creating " + targetArtifactName + " artifact!");
                } else {
                    let targetArtifactFilePath = path.join(pathToTargetFolder, targetArtifactName +
                        getFileExtension(registryResource));

                    const targetArtifactFileUri: Uri = Uri.file(targetArtifactFilePath);
                    let templateArtifactFilePath = path.join(dirName, '..', '..', 'templates', targetFolder,
                                                               templateFileName + getFileExtension(registryResource));
                    //create metadata and swagger files for API
                    if(targetFolder.trim() === "api"){
                        //path to metadata template
                        let templateMetadataFilePath = path.join(dirName, '..', '..', 'templates', 'metadata', "metadata.yaml");
                        //path to swagger template
                        let templateSwaggerFilePath = path.join(dirName, '..', '..', 'templates', 'metadata', "swagger.yaml");
                        //path to metadata file
                        let targetMetadataFilePath = path.join(pathtoResourcesFile,targetArtifactName+"_metadata.yaml");
                        //path to swagger file
                        let targetSwaggerFilePath = path.join(pathtoResourcesFile,targetArtifactName+"_swagger.yaml");

                        let edit = new WorkspaceEdit();
                        let targetMetadataFilePatUri = Uri.file(targetMetadataFilePath);
                        edit.createFile(targetMetadataFilePatUri);
                        workspace.applyEdit(edit);

                        //create and update metadata.yaml
                        let serviceUrl: string = "https://{MI_HOST}:{MI_PORT}/context_here";
                        createMetaDataYaml(templateMetadataFilePath,targetArtifactName, "Sample API",  "OAS3", serviceUrl, targetMetadataFilePatUri);

                        let targetSwaggerFilePatUri = Uri.file(targetSwaggerFilePath);
                        edit.createFile(targetSwaggerFilePatUri);
                        workspace.applyEdit(edit);

                        // Read and buffer swagger.yaml template file.
                        let rawYaml: Buffer = fse.readFileSync(templateSwaggerFilePath);
                        let data = YAML.load(rawYaml)
                        data.info.title = targetArtifactName;
                        data.info.description = "API Definition of " + targetArtifactName;

                        // Write the updated template content to the target file.
                        fse.writeFileSync(targetSwaggerFilePatUri.fsPath, YAML.dump(data));

                    }
                    else if(targetFolder.trim() === "proxy-services"){
                        //path to metadata template
                        let templateMetadataFilePath = path.join(dirName, '..', '..', 'templates', 'metadata', "metadata.yaml");
                        //path to metadata file
                        let targetMetadataFilePath = path.join(pathtoResourcesFile,targetArtifactName+"_proxy_metadata.yaml");

                        let edit = new WorkspaceEdit();
                        let targetMetadataFilePatUri = Uri.file(targetMetadataFilePath);
                        edit.createFile(targetMetadataFilePatUri);
                        workspace.applyEdit(edit);

                        //create and update metadata.yaml
                        let serviceUrl: string = "https://{MI_HOST}:{MI_PORT}/services/" + targetArtifactName;
                        createMetaDataYaml(templateMetadataFilePath,targetArtifactName, "Sample Proxy Service",  "WSDL1", serviceUrl, targetMetadataFilePatUri);
                        

                    }
                    

                    createTargetArtifactFromTemplate(targetArtifactFileUri, targetArtifactName,
                                                     templateArtifactFilePath, artifactType, registryResource);

                    
                    await addNewArtifactToConfigArtifactXMLFile(targetArtifactName, targetFolder, type);
                    await updateCompositePomXmlFile(targetArtifactName, targetFolder, type);
                }
            });
        }

        //create registry resource
        if (workspace.workspaceFolders && registryResource) {

            let pattern = path.join("*", targetArtifactName + getFileExtension(registryResource));

            let subDirectory: string = workspace.workspaceFolders[0].name + SubDirectories.REGISTRY_RESOURCES;
            let cwd = path.join(workspace.workspaceFolders[0].uri.fsPath, subDirectory);

             //target metadata.yaml and swagger.yaml folder

            let newGlob = new glob(pattern, {cwd: cwd}, async function (err: any, files: any) {
                if (err) {
                    window.showErrorMessage("Error creating " + targetArtifactName + " registry resource!. ERROR: " + err);
                    return;
                }
                if (files.length > 0) {
                    // file name already exists in the project.
                    window.showErrorMessage("Error creating " + targetArtifactName + " registry resource!");
                } else {

                    let targetArtifactFilePath = path.join(pathToTargetFolder, targetArtifactName +
                        getFileExtension(registryResource));

                    const targetArtifactFileUri: Uri = Uri.file(targetArtifactFilePath);
                    let templateArtifactFilePath = path.join(dirName, '..', '..', 'templates', targetFolder,
                                                               templateFileName + getFileExtension(registryResource));

                    createTargetArtifactFromTemplate(targetArtifactFileUri, targetArtifactName,
                        templateArtifactFilePath, artifactType, registryResource);

                    await addNewArtifactToRegistryArtifactXMLFile(targetArtifactName, type, registryResource);
                    await updateCompositePomXmlFile(targetArtifactName, targetFolder, type);

                }
            });

            
        }
    }

    /**
     * Create the artifact from template.
     */
    function createTargetArtifactFromTemplate(targetArtifactFileUri: Uri, targetArtifactName: string,
                                              templateArtifactFilePath: string, artifactType: string,
                                              registryResource: RegistryResource | undefined) {
        let edit = new WorkspaceEdit();
        edit.createFile(targetArtifactFileUri);
        workspace.applyEdit(edit);

        // Read and buffer artifact template file.
        const buf: Buffer = fse.readFileSync(templateArtifactFilePath);
        let data = "";
        if (registryResource !== undefined) {
            switch(registryResource!.mediaType) {
                case "application/json": {
                    data = buf.toString();
                    break;
                }
                case "application/vnd.wso2.esb.localentry": {
                    data = updateSynapseArtifactTemplate("local-entry", buf, targetArtifactName);
                    break;
                }
                default: {
                    data = updateSynapseArtifactTemplate(artifactType, buf, targetArtifactName);
                    break;
                }
            }
        } else  {
            data = updateSynapseArtifactTemplate(artifactType, buf, targetArtifactName);
        }
        // Write the updated template content to the target file.
        fse.writeFileSync(targetArtifactFileUri.fsPath, data);

        // Open and show newly created artifact document in the editor.
        workspace.openTextDocument(targetArtifactFileUri).then(doc => window.showTextDocument(doc));
    }
    
    /**
     * Update the name/key attribute with the new artifact name.
     */
    function updateSynapseArtifactTemplate(artifactType: string, buf: Buffer, targetArtifactName: string): string {
        if (artifactType !== LocalEntryArtifactInfo.ARTIFACT_TYPE) {
            return updateAttribute(buf, "name", targetArtifactName);
        } else {
            return updateAttribute(buf, "key", targetArtifactName);
        }
    }

    /**
     * Add artifact info of the newly created artifact to synapse-config artifact.xml file.
     * Create dependancy and property in CompositeExporter pom.xml
     */
    async function addNewArtifactToConfigArtifactXMLFile(artifactName: string, targetFolder: string, type: string) {
        if (workspace.workspaceFolders) {
            const Configsdirectory: string = workspace.workspaceFolders[0].name + SubDirectories.CONFIGS;
            const compositeExporterDirectory: string = workspace.workspaceFolders[0].name + SubDirectories.COMPOSITE_EXPORTER;
            const pomFile: string = path.join(workspace.workspaceFolders[0].uri.fsPath, compositeExporterDirectory, "pom.xml");
            // read pom and get project group_id and version
            let project: Project = await getProjectInfoFromPOM(pomFile);
            const {groupId, version} = Object.assign(project);
            const configArtifactXmlFileLocation: string = path.join(workspace.workspaceFolders[0].uri.fsPath,
                                                                    Configsdirectory, "artifact.xml");
            // Read and buffer synapse-config artifact.xml file
            const buf: Buffer = fse.readFileSync(configArtifactXmlFileLocation);

            // Parse the artifact.xml file content to a DOM document.
            // Create new artifact DOM Element info to represent the newly created artifact.
            let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
            let parent = xmlDoc.getElementsByTagName("artifacts");
            let artifactFilePath: string = path.join("src", "main", "synapse-config", targetFolder, artifactName + ".xml");
            addSynapseArtifactData(parent, xmlDoc, artifactName, groupId, type, "1.0.0", ServerRoleInfo.ENTERPRISE_SERVICE_BUS, artifactFilePath, targetFolder);

            //add  metadata and swagger artifacts to artifact.xml for an api resource
            if(targetFolder.trim() === "api"){
                //metadata
                let metaDataName: string = artifactName + "_metadata";
                let metaDataFilePath: string = path.join("src", "main", "resources", "metadata", artifactName + "_metadata"+ ".yaml");
                addSynapseArtifactData(parent, xmlDoc, metaDataName, groupId, "synapse/metadata", "1.0.0", ServerRoleInfo.ENTERPRISE_SERVICE_BUS, metaDataFilePath, targetFolder);
                //swagger
                let swaggerName: string = artifactName + "_swagger";
                let swaggerFilePath: string = path.join("src", "main", "resources", "metadata", artifactName + "_swagger"+ ".yaml");
                addSynapseArtifactData(parent, xmlDoc, swaggerName,groupId, "synapse/metadata", "1.0.0", ServerRoleInfo.ENTERPRISE_SERVICE_BUS, swaggerFilePath, targetFolder);

            }
            else if(targetFolder.trim() === "proxy-services"){
                //metadata
                let metaDataName: string = artifactName + "_proxy_metadata";
                let metaDataFilePath: string = path.join("src", "main", "resources", "metadata", artifactName + "_proxy_metadata"+ ".yaml");
                addSynapseArtifactData(parent, xmlDoc, metaDataName, groupId, "synapse/metadata", "1.0.0", ServerRoleInfo.ENTERPRISE_SERVICE_BUS, metaDataFilePath, targetFolder);
            }
            // Update the synapse-config artifact.xml file.
            fse.writeFileSync(configArtifactXmlFileLocation, new XMLSerializer().serializeToString(xmlDoc));

        }
    }

    /**
     * Add artifact info of the newly created artifact to registry-resource artifact.xml file.
     */
    async function addNewArtifactToRegistryArtifactXMLFile(artifactName: string, type: string,
                                                     registryResource: RegistryResource | undefined) {

        if (workspace.workspaceFolders) {
            const registryResourcesDirectory: string = workspace.workspaceFolders[0].name + SubDirectories.REGISTRY_RESOURCES;
            const compositeExporterDirectory: string = workspace.workspaceFolders[0].name + SubDirectories.COMPOSITE_EXPORTER;
            const registryArtifactXML: string = path.join(workspace.workspaceFolders[0].uri.fsPath,
                                                          registryResourcesDirectory, "artifact.xml");

            // read pom and get project group_id and version
            const pomFile: string = path.join(workspace.workspaceFolders[0].uri.fsPath, compositeExporterDirectory, "pom.xml");
            let project: Project = await getProjectInfoFromPOM(pomFile);
            const {groupId, version} = Object.assign(project);

            const buf: Buffer = fse.readFileSync(registryArtifactXML);

            let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
            let parent = xmlDoc.getElementsByTagName("artifacts");
            let child = parent[0].appendChild(xmlDoc.createElement("artifact"));
            child.setAttribute("name", artifactName);
            let finalGroupId = groupId + "." + type.split("/")[1];
            child.setAttribute("groupId", finalGroupId);
            child.setAttribute("version","1.0.0")
            child.setAttribute("type", type);
            child.setAttribute("serverRole", ServerRoleInfo.ENTERPRISE_INTEGRATOR);

            let item = xmlDoc.createElement("item");
            let file = xmlDoc.createElement("file");
            file.textContent = registryResource!.file;

            let filePath = xmlDoc.createElement("path");
            filePath.textContent = registryResource!.path;

            let mediaType = xmlDoc.createElement("mediaType");
            mediaType.textContent = registryResource!.mediaType;
            let properties = xmlDoc.createElement("properties")

            item.appendChild(file);
            item.appendChild(filePath);
            item.appendChild(mediaType);
            item.appendChild(properties);
            child.appendChild(item);

            fse.writeFileSync(registryArtifactXML, new XMLSerializer().serializeToString(xmlDoc));
        }
    }

    async function updateCompositePomXmlFile(artifactName: string, targetFolder: string, type: string) {
        if (workspace.workspaceFolders) {
            const compositeExporterDirectory: string = workspace.workspaceFolders[0].name + SubDirectories.COMPOSITE_EXPORTER;
            // read pom and get project group_id and version
            const pomFile: string = path.join(workspace.workspaceFolders[0].uri.fsPath, compositeExporterDirectory, "pom.xml");
            let project: Project = await getProjectInfoFromPOM(pomFile);
            const {groupId, version} = Object.assign(project);
            // Read and buffer Composite Exporter pom.xml file
            const buff: Buffer = fse.readFileSync(pomFile);
            // Create new artifact DOM Element info to represent the newly created artifact.
            let pomXmlDoc = new DOM().parseFromString(buff.toString(), "text/xml");

            //add entry to properties
            let properties = pomXmlDoc.getElementsByTagName("properties");
            let artifatTagName:string = groupId + "." + type.split("/")[1] + "_._" + artifactName;
            addNewProperty(pomXmlDoc, artifatTagName, properties, ServerRoleInfo.ENTERPRISE_SERVICE_BUS)
            if(targetFolder.trim() === "api"){
                //metadata
                let meataDataTagName = groupId + ".metadata_._" + artifactName + "_metadata";
                addNewProperty(pomXmlDoc, meataDataTagName, properties, ServerRoleInfo.ENTERPRISE_SERVICE_BUS);
                //swagger
                let swaggerTagName = groupId + ".metadata_._" + artifactName + "_swagger";
                addNewProperty(pomXmlDoc, swaggerTagName, properties, ServerRoleInfo.ENTERPRISE_SERVICE_BUS);
            }
            else if(targetFolder.trim() === "proxy-services"){
                //metadata
                let meataDataTagName = groupId + ".proxy-service" + ".metadata_._" + artifactName + "_proxy_metadata";
                addNewProperty(pomXmlDoc, meataDataTagName, properties, ServerRoleInfo.ENTERPRISE_SERVICE_BUS);
            }


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

            let finalGroupId = groupId + "." + type.split("/")[1];
            let fileType: string;

            if(targetFolder.trim() === "registry-resources") fileType = "zip";
            else fileType = "xml";

            addNewDependancy(pomXmlDoc, dependencies, artifactName, finalGroupId, fileType);

            if(targetFolder.trim() === "api"){
                //metadata
                addNewDependancy(pomXmlDoc, dependencies, artifactName + "_metadata", groupId + ".metadata", "yaml");
                //swagger
                addNewDependancy(pomXmlDoc, dependencies, artifactName + "_swagger", groupId + ".metadata", "yaml");
            }
            if(targetFolder.trim() === "proxy-services"){
                //metadata
                addNewDependancy(pomXmlDoc, dependencies, artifactName + "_proxy_metadata", groupId + ".proxy-service.metadata", "yaml");
            }
            // Update the Composite Exporter pom.xml file.
            fse.writeFileSync(pomFile, new XMLSerializer().serializeToString(pomXmlDoc));
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
     * Delete the artifact info of the deleted artifact from the related 
     * -artifact.xml file
     * -pom.xml file
     * Delete the files
     * -metadata.yaml file
     * -swagger.yaml file
     */
    export function safeDeleteArtifact(deletedFile: Uri) {
        const filePath: string = deletedFile.fsPath;
        let array: string[] = filePath.split(path.sep);
        let deletedArtifact: string = array[array.length - 1];
        let artifactFolder: string = array[array.length - 2];
        let rawArtifactName: string[] = deletedArtifact.split(".");
        
        // Check if the deleted file is a synapse-config or a registry-resource file
        let artifactXmlFilePath: string;
        if (workspace.workspaceFolders) {

            let syapseSubDirectory: string = workspace.workspaceFolders[0].name + SubDirectories.CONFIGS;
            let resourceSubDirectory: string = workspace.workspaceFolders[0].name + SubDirectories.REGISTRY_RESOURCES;

            //artifact
            if (isExistDirectoryPattern(filePath, path.join(workspace.workspaceFolders[0].uri.fsPath, syapseSubDirectory, "src", "main", "synapse-config"))) {
                artifactXmlFilePath = path.join(workspace.workspaceFolders[0].uri.fsPath, syapseSubDirectory, "artifact.xml");

                deletefromArtifactXml(artifactXmlFilePath, rawArtifactName[0], artifactFolder);
                deleteArtifactFromPomXml(rawArtifactName[0], artifactFolder, workspace.workspaceFolders[0]);
                
            //resource
            } else if (isExistDirectoryPattern(filePath, path.join(workspace.workspaceFolders[0].uri.fsPath, resourceSubDirectory))) {
                artifactXmlFilePath = path.join(workspace.workspaceFolders[0].uri.fsPath, resourceSubDirectory, "artifact.xml");

                deletefromArtifactXml(artifactXmlFilePath, rawArtifactName[0], artifactFolder);
                deleteArtifactFromPomXml(rawArtifactName[0], artifactFolder, workspace.workspaceFolders[0]);
        
        }
    }
    }

    function deletefromArtifactXml(artifactXmlFilePath: string, artifactName: string, artifactFolder: string){

        let buf: Buffer = fse.readFileSync(artifactXmlFilePath);
        let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");

        let artifacts = xmlDoc.getElementsByTagName("artifacts");
        let elementList = artifacts[0].getElementsByTagName("artifact");
        let listLength: number = elementList.length;

        for (let i = 0; i < listLength; i++) {
            if ((elementList[i].getAttribute("name") === artifactName) || (elementList[i].getAttribute("name") === (artifactName + "_metadata")) ||
                (elementList[i].getAttribute("name") === (artifactName + "_swagger")) || 
                (elementList[i].getAttribute("name") === (artifactName + "_proxy_metadata"))) {
                artifacts[0].removeChild(elementList[i]);
            }
        }
        let data = new XMLSerializer().serializeToString(xmlDoc);
        fse.writeFileSync(artifactXmlFilePath, data);

    }

    //delete artifact related information from pom.xml
    function deleteArtifactFromPomXml(artifactName: string, artifactFolder: string, workspaceFolder: WorkspaceFolder){

        const pomSubdirectory: string = workspaceFolder.name + SubDirectories.COMPOSITE_EXPORTER;
        const pathToPomXml:string = path.join(workspaceFolder.uri.fsPath, pomSubdirectory, "pom.xml");
        let buffer: Buffer = fse.readFileSync(pathToPomXml);
        let pomXmlDoc = new DOM().parseFromString(buffer.toString(), "text/xml")
        let dependencies = pomXmlDoc.getElementsByTagName("dependencies");
        let dependencyList = dependencies[0].getElementsByTagName("dependency");
        let listLength: number = dependencyList.length;

        //delete metadata dependencies and properties in pom.xml
        let dependancy:string;
        for (let i = 0; i < listLength; i++) {
            dependancy = dependencyList[i].getElementsByTagName("artifactId")[0].textContent;
            if ((dependancy === artifactName) || (dependancy=== (artifactName + "_metadata")) || (dependancy === (artifactName + "_swagger"))
            || (dependancy === (artifactName + "_proxy_metadata"))) {
                let tagName: string = dependencyList[i].getElementsByTagName("groupId")[0].textContent + "_._" + dependencyList[i].getElementsByTagName("artifactId")[0].textContent;
                dependencies[0].removeChild(dependencyList[i]);
                let properties = pomXmlDoc.getElementsByTagName("properties");
                let property = pomXmlDoc.getElementsByTagName(tagName);
                properties[0].removeChild(property[0]);
            }
        }
        let data = new XMLSerializer().serializeToString(pomXmlDoc);
        fse.writeFileSync(pathToPomXml, data);

        //remove metadata files for api resource and proxy service
        if(artifactFolder === "api"){
            let syapseSubDirectory: string = workspaceFolder.name + SubDirectories.CONFIGS; 
            let metaDataDirectory: string = path.join(workspaceFolder.uri.fsPath, syapseSubDirectory, "src", "main", "resources", "metadata");
            fse.remove(path.join(metaDataDirectory, artifactName + "_metadata.yaml"));
            fse.remove(path.join(metaDataDirectory, artifactName + "_swagger.yaml"));
        }
        else if(artifactFolder === "proxy-services"){
            let syapseSubDirectory: string = workspaceFolder.name + SubDirectories.CONFIGS; 
            let metaDataDirectory: string = path.join(workspaceFolder.uri.fsPath, syapseSubDirectory, "src", "main", "resources", "metadata");
            fse.remove(path.join(metaDataDirectory, artifactName + "_proxy_metadata.yaml"));
        }
    }

    /**
     * Returns the suitable file extension based on the artifact mediatype.
     *
     * @param registryResource Registry Resource object.
     */
    function getFileExtension(registryResource: RegistryResource | undefined) {
        let extension = ".xml";
        if (registryResource !==  undefined) {
            switch(registryResource!.mediaType) {
                case "application/json": {
                    extension = ".json";
                    break;
                }
                default: {
                    // Setting .xml as the default extension
                    extension = ".xml";
                    break;
                }
            }
        }
        return extension;
    }

    function isExistDirectoryPattern(filePath: string, dirPattern: string): boolean {
        let regExpForDirPattern = new RegExp(dirPattern);
        return regExpForDirPattern.test(filePath);
    }

    

    export function updateMetadataforApi(filePath: string){
        if(workspace.workspaceFolders){
            const metadataSubDirectory: string = workspace.workspaceFolders[0].name + SubDirectories.CONFIGS;
            let array: string[] = filePath.split(path.sep);
            let rawFileName: string = array[array.length -1];
            let rawArtifactName: string = rawFileName.split(".")[0];
            let metadaFileName: string = rawArtifactName + "_metadata.yaml";
            const pathToMetadataYaml: string = path.join(workspace.workspaceFolders[0].uri.fsPath, metadataSubDirectory, "src", "main", "resources", "metadata",
                                                                                                                                     metadaFileName);

            //read xml file for artifact file
            const buf: Buffer = fse.readFileSync(filePath);
            let apiXmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
            let api = apiXmlDoc.getElementsByTagName("api");
            let context = api[0].getAttribute("context");
            let newServiceUrl: string = "https://{MI_HOST}:{MI_PORT}" + context;
        
            // Read metadata.yaml template file.
            const raw: Buffer = fse.readFileSync(pathToMetadataYaml);
            let data = YAML.load(raw)
            data.serviceUrl = newServiceUrl;

            // Write the updated template content to the target file.
            fse.writeFileSync(pathToMetadataYaml, YAML.dump(data, { quotingType: '"', forceQuotes: true }));

    }
}

    export function checkBuildPlugins(filePath: string, directory: string){
        let pathToPom: string = path.join(filePath, "pom.xml");

        //read pom xml
        const buf: Buffer = fse.readFileSync(pathToPom);
        let pomXmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
        let build = pomXmlDoc.getElementsByTagName("build")[0];
        
        let parentPluging = build.getElementsByTagName("plugins")[0];
        let plugins = build.getElementsByTagName("plugin");
        let currentPluginsArray: string[] = [plugins.length];
        for(let i=0; i<plugins.length; i++){
            currentPluginsArray[i] = plugins[i].getElementsByTagName("artifactId")[0].textContent.trim();
        }
        
        //read template file
        let buildTemplatePath: string = path.join(dirName, "..", "..", "templates", "pom");
        let fileName: string = directory + "Pom.xml";
        buildTemplatePath = path.join(buildTemplatePath, fileName);
        const buff: Buffer = fse.readFileSync(buildTemplatePath);
        let templateXmlDoc = new DOM().parseFromString(buff.toString(), "text/xml");
        let newBuild = templateXmlDoc.getElementsByTagName("build")[0];
        
        let newPlugins = newBuild.getElementsByTagName("plugin");
        let newPlugin;

        //check for required plugins
        for(let i=0; i<newPlugins.length; i++){
            newPlugin = newPlugins[i].getElementsByTagName("artifactId")[0].textContent.trim();
            if(currentPluginsArray.indexOf(newPlugin) === -1){
                parentPluging.appendChild(newPlugins[i]);

            }
        }

        let data = new XMLSerializer().serializeToString(pomXmlDoc);
        fse.writeFileSync(pathToPom, data);
    }

    //add artifact element to artifact.xml
    function addSynapseArtifactData(parent: any, xmlDoc: any, artifactName: string, groupId: string, type: string, version: string, serverRole: string,
                                                                                    filePath: string, targetFolder: string){

        let child = xmlDoc.createElement("artifact");
        parent[0].appendChild(child);
        child.setAttribute("name", artifactName);
        let finalGroupId: string;
        let category: string = type.split("/")[1];

        if((targetFolder.trim() === "proxy-services") && (category.trim() === "metadata")) finalGroupId = groupId + ".proxy-service." + category;
        else finalGroupId = groupId + "." + category;
        
        child.setAttribute("groupId", finalGroupId);
        child.setAttribute("version", version);
        child.setAttribute("type", type);
        child.setAttribute("serverRole", serverRole);

        let fileTag = xmlDoc.createElement("file");
        fileTag.textContent = filePath;
        child.appendChild(fileTag);

    }

    //add new property
    function addNewProperty(xmlDoc: any, tagName: string, properties: any, serverRole: string){
        let pomChild = xmlDoc.createElement(tagName);
        properties[0].appendChild(pomChild);
        pomChild.textContent = path.join("capp", serverRole);
    }

    //add new dependancy
    function addNewDependancy(xmlDoc: any, dependencies: any, artifactName: string, groupId: string, type: string){
        let dependancy = xmlDoc.createElement("dependency");
        dependencies[0].appendChild(dependancy);
        createAndAppendElement(xmlDoc, dependancy,"groupId", groupId);
        createAndAppendElement(xmlDoc, dependancy,"artifactId", artifactName);
        createAndAppendElement(xmlDoc, dependancy,"version","1.0.0");
        createAndAppendElement(xmlDoc, dependancy,"type",type);

    }

    function createAndAppendElement(xmlDoc: any, parent: any, childName: string, content: string){
        let childElement = xmlDoc.createElement(childName);
        childElement.textContent = content;
        parent.appendChild(childElement);
    }

    function createMetaDataYaml(templateFilePath: string, artifactName: string, description: string, definitionType: string,
                                                                    serviceUrl: string,targetFilePathUri: Uri){
          // Read and buffer metadata.yaml template file.
          const raw: Buffer = fse.readFileSync(templateFilePath);
          let data = YAML.load(raw);
          data.key = artifactName + "-1.0.0";
          data.name = artifactName;
          data.displayName = artifactName;
          data.description = description;
          data.serviceUrl = serviceUrl;
          data.definitionType = definitionType;

          // Write the updated template content to the target file.
          fse.writeFileSync(targetFilePathUri.fsPath, YAML.dump(data, { quotingType: '"', forceQuotes: true }));
    }

}
