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
import {LocalEntryArtifactInfo, ServerRoleInfo, SubDirectories, ProjectNatures, APIArtifactInfo, ProxyArtifactInfo, ArtifactInfo, RegistryResourceInfo, EndpointArtifactInfo, InboundEndpointArtifactInfo, MessageProcessorArtifactInfo, MessageStoreArtifactInfo, SequenceArtifactInfo, TaskArtifactInfo, TemplateArtifactInfo } from "./artifactUtils";
import { ConnectorModule } from "../connector/ConnectorModule";
import {XMLSerializer as XMLSerializer} from 'xmldom';
import {RegistryResource} from "./artifactResolver";
import { DataServiceModule } from "../dataService/DataServiceModule";
import { Utils } from "../utils/Utils";

let DOM = require('xmldom').DOMParser;
let glob = require("glob");
const YAML = require("js-yaml");
var file_system = require('fs');

export namespace ArtifactModule {

    const dirName = __dirname;

    /**
     * Create new config artifact in ESB Configs.
     */
    export function createArtifact(pathToTargetFolder: string | undefined, targetFolder: string, templateFileName: string, targetArtifactName: string,
        artifactType: string, type: string) {

        if (workspace.workspaceFolders && (typeof pathToTargetFolder !== "undefined")) {

            // Create target folder path where the new config artifact is going to be added in the project.
            let directoryPattern: string = path.join("src", "main", "synapse-config");
            const esbConfigsDirectory: string = pathToTargetFolder.split(`${path.sep}${directoryPattern}`)[0];
            /*const pathToTargetFolder = path.join(esbConfigsDirectory, "src", "main", "synapse-config",
                                                 targetFolder);*/

            // Check if the path really exists. If not exists, the project is not a standard Synapse muilti-module Project
            Utils.checkPathExistence(pathToTargetFolder).then(exists => {
                if (exists) {
                    createArtifactFromTemplate(esbConfigsDirectory, targetFolder, templateFileName, targetArtifactName, artifactType, type,
                        pathToTargetFolder, "synapse-config", undefined);
                }
            });
        }
    }

    /**
    * Create new resource in Registry Resources.
    */
    export function createResource(targetFolder: string, templateFileName: string, targetArtifactName: string,
        artifactType: string, type: string, registryResource: RegistryResource) {

        if (workspace.workspaceFolders) {
            const registryResourceSubDirectory:string = Utils.getDirectoryFromDirectoryType(SubDirectories.REGISTRY_RESOURCES, 
                workspace.workspaceFolders[0].uri.fsPath);
            // Check if the path really exists. If not exists, the project is not a standard Synapse muilti-module Project
            Utils.checkPathExistence(registryResourceSubDirectory).then(exists => {
                if (exists) {
                    createArtifactFromTemplate(registryResourceSubDirectory, targetFolder, templateFileName, targetArtifactName, artifactType, type,
                        registryResourceSubDirectory, "registry-resources", registryResource);
                }
            });
        }
    }

    /**
    * Create artifact from template.
    */
    function createArtifactFromTemplate(subDirectory: string, targetFolder: string, templateFileName: string, targetArtifactName: string,
                                        artifactType: string, type: string, pathToTargetFolder: string, resourceType: string,
                                        registryResource: RegistryResource | undefined) {
        
        let rootDirectory: string = path.join(subDirectory, "..");
        
        if (typeof registryResource === "undefined"){//synapse artifact

            let pattern = path.join("*", targetArtifactName + getFileExtension(registryResource));
            let cwd = path.join(subDirectory, "src", "main", resourceType);

             //target metadata.yaml and swagger.yaml folder
             let pathtoResourcesFile = path.join(subDirectory, "src", "main", "resources", "metadata");

            let newGlob = new glob(pattern, {cwd: cwd}, async function (err: any, files: any) {
                if (err) {
                    window.showErrorMessage("Error creating " + targetArtifactName + " artifact!. ERROR: " + err);
                    return;
                }
                if (files.length > 0) {
                    // file name already exists in the project.
                    window.showErrorMessage("Artifact Name " + targetArtifactName + " already exists!");
                } else {
                    let targetArtifactFilePath = path.join(pathToTargetFolder, targetArtifactName +
                        getFileExtension(registryResource));

                    const targetArtifactFileUri: Uri = Uri.file(targetArtifactFilePath);
                    let templateArtifactFilePath = path.join(dirName, '..', '..', 'templates', targetFolder,
                                                            templateFileName + getFileExtension(registryResource));
                    //create metadata and swagger files for API
                    if(targetFolder.trim() === APIArtifactInfo.DESTINATION_FOLDER){
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
                    else if(targetFolder.trim() === ProxyArtifactInfo.PROXY_DESTINATION_FOLDER){
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
                        createMetaDataYaml(templateMetadataFilePath,targetArtifactName, "Sample Proxy Service",  "WSDL1", serviceUrl,
                                            targetMetadataFilePatUri);
                    }

                    createTargetArtifactFromTemplate(targetArtifactFileUri, targetArtifactName,
                                                        templateArtifactFilePath, artifactType, registryResource);

                    addNewArtifactToConfigArtifactXMLFile(subDirectory, targetArtifactName, targetFolder, type);
                    updateCompositePomXmlFile(rootDirectory, targetArtifactName, targetFolder, type);
                }
            });
        }
        else{//create registry resource

            let pattern = path.join(targetArtifactName + getFileExtension(registryResource));
            let cwd: string = subDirectory;

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

                    let targetArtifactFilePath = path.join(pathToTargetFolder, targetArtifactName + getFileExtension(registryResource));

                    const targetArtifactFileUri: Uri = Uri.file(targetArtifactFilePath);
                    let templateArtifactFilePath = path.join(dirName, '..', '..', 'templates', targetFolder,
                                                               templateFileName + getFileExtension(registryResource));

                    createTargetArtifactFromTemplate(targetArtifactFileUri, targetArtifactName,
                                                        templateArtifactFilePath, artifactType, registryResource);

                    let rootPomFilePath: string = path.join(subDirectory, "..", "pom.xml");
                    let project: Utils.Project = Utils.getProjectInfoFromPOM(rootPomFilePath);
                    const {groupId, version} = Object.assign(project);
                    let artifactXmlFilePath: string = path.join(subDirectory, "artifact.xml");
                    let finalGroupId: string = `${groupId}.${RegistryResourceInfo.TYPE.split("/")[1]}`;
                    
                    Utils.addArtifactToArtifactXml(artifactXmlFilePath, targetArtifactName, finalGroupId, "1.0.0", type, 
                                                    ServerRoleInfo.ENTERPRISE_INTEGRATOR, registryResource.file!, registryResource.path,
                                                    registryResource.mediaType);
                    updateCompositePomXmlFile(rootDirectory, targetArtifactName, targetFolder, type);
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
        Utils.createXmlFile(targetArtifactFileUri.fsPath, data);

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
    function addNewArtifactToConfigArtifactXMLFile(esbConfigsDirectory: string, artifactName: string, targetFolder: string, type: string) {
            const pomFile: string = path.join(esbConfigsDirectory, "..", "pom.xml");
            const configArtifactXmlFileLocation: string = path.join(esbConfigsDirectory, "artifact.xml");
            if( (!fse.existsSync(pomFile)) || (!fse.existsSync(configArtifactXmlFileLocation)) ) return;

            // read pom and get project group_id and version
            let project: Utils.Project = Utils.getProjectInfoFromPOM(pomFile);
            const {groupId, version} = Object.assign(project);
            
            // Read and buffer synapse-config artifact.xml file
            const buf: Buffer = fse.readFileSync(configArtifactXmlFileLocation);

            // Parse the artifact.xml file content to a DOM document.
            // Create new artifact DOM Element info to represent the newly created artifact.
            let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
            let parent = xmlDoc.getElementsByTagName("artifacts");
            let artifactFilePath: string = path.join("src", "main", "synapse-config", targetFolder, artifactName + ".xml");
            addSynapseArtifactData(parent, xmlDoc, artifactName, groupId, type, "1.0.0", ServerRoleInfo.ENTERPRISE_SERVICE_BUS, artifactFilePath, targetFolder);

            //add  metadata and swagger artifacts to artifact.xml for an api resource
            if(targetFolder.trim() === APIArtifactInfo.DESTINATION_FOLDER){
                //metadata
                let metaDataName: string = artifactName + "_metadata";
                let metaDataFilePath: string = path.join("src", "main", "resources", "metadata", artifactName + "_metadata"+ ".yaml");
                addSynapseArtifactData(parent, xmlDoc, metaDataName, groupId, "synapse/metadata", "1.0.0", ServerRoleInfo.ENTERPRISE_SERVICE_BUS, metaDataFilePath, targetFolder);
                //swagger
                let swaggerName: string = artifactName + "_swagger";
                let swaggerFilePath: string = path.join("src", "main", "resources", "metadata", artifactName + "_swagger"+ ".yaml");
                addSynapseArtifactData(parent, xmlDoc, swaggerName,groupId, "synapse/metadata", "1.0.0", ServerRoleInfo.ENTERPRISE_SERVICE_BUS, swaggerFilePath, targetFolder);

            }
            else if(targetFolder.trim() === ProxyArtifactInfo.PROXY_DESTINATION_FOLDER){
                //metadata
                let metaDataName: string = artifactName + "_proxy_metadata";
                let metaDataFilePath: string = path.join("src", "main", "resources", "metadata", artifactName + "_proxy_metadata"+ ".yaml");
                addSynapseArtifactData(parent, xmlDoc, metaDataName, groupId, "synapse/metadata", "1.0.0", ServerRoleInfo.ENTERPRISE_SERVICE_BUS, metaDataFilePath, targetFolder);
            }
            // Update the synapse-config artifact.xml file.
            fse.writeFileSync(configArtifactXmlFileLocation, new XMLSerializer().serializeToString(xmlDoc));
    }

    /**
     * Add artifact info of the newly created artifact to registry-resource artifact.xml file.
     */
    function addNewArtifactToRegistryArtifactXMLFile(registryResourcesDirectory: string, artifactName: string, type: string,
                                                     registryResource: RegistryResource | undefined) {

            const registryArtifactXML: string = path.join(registryResourcesDirectory, "artifact.xml");
            // read pom and get project group_id and version
            const pomFile: string = path.join(registryResourcesDirectory, "..", "pom.xml");
            if( (!fse.existsSync(pomFile)) || (!fse.existsSync(registryArtifactXML)) ) return;

            let project: Utils.Project = Utils.getProjectInfoFromPOM(pomFile);
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

    function updateCompositePomXmlFile(rootDirectory: string, artifactName: string, targetFolder: string, type: string) {

            // read pom and get project group_id and version
            let compositeExporterDirectory: string = Utils.getDirectoryFromDirectoryType(SubDirectories.COMPOSITE_EXPORTER, rootDirectory);
            const pomFile: string = path.join(compositeExporterDirectory, "pom.xml");
            
            let serverRole: string;
            let project: Utils.Project =  Utils.getProjectInfoFromPOM(pomFile);
            const {groupId, version} = Object.assign(project);
            let finalGroupId: string = groupId + "." + type.split("/")[1];
            if(targetFolder.trim() === "registry-resources") serverRole = ServerRoleInfo.ENTERPRISE_INTEGRATOR;
            else serverRole = ServerRoleInfo.ENTERPRISE_SERVICE_BUS;

            Utils.updateCompositePomXml(compositeExporterDirectory, artifactName, type, serverRole, finalGroupId);

            if(type === APIArtifactInfo.TYPE){
                finalGroupId = groupId + ".metadata";
                //metadata
                let metadataArtifactName: string = artifactName + "_metadata";
                Utils.updateCompositePomXml(compositeExporterDirectory, metadataArtifactName, "synapse/metadata", serverRole, finalGroupId);
                //swagger
                let swaggerArtifactName: string = artifactName + "_swagger";
                Utils.updateCompositePomXml(compositeExporterDirectory, swaggerArtifactName, "synapse/metadata", serverRole, finalGroupId);
            }
            else if(type === ProxyArtifactInfo.ARTIFACT_TYPE){
                finalGroupId = groupId + ".proxy-service.metadata";
                //metadata
                let metadataArtifactName: string = artifactName + "_proxy_metadata";
                Utils.updateCompositePomXml(compositeExporterDirectory, metadataArtifactName, "synapse/metadata", serverRole, finalGroupId);
            }
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
    export function safeDeleteArtifact(filePath: string) {
       
        if (workspace.workspaceFolders) {
            let array: string[] = filePath.split(path.sep);
            let deletedArtifact: string = array[array.length - 1];
            let artifactFolder: string = array[array.length - 2];
            let rawArtifactName: string[] = deletedArtifact.split(".");
            
            // Check if the deleted file is a synapse-config or a registry-resource file
            let artifactXmlFilePath: string;
            let rootDirectory: string = workspace.workspaceFolders[0].uri.fsPath;
            let synapseDirectoryPattern: string = path.join("src", "main", "synapse-config");
            
            let resourceSubDirectory: string = path.join(filePath, "..");
            let resourcesProjectNaturePath: string = path.join(resourceSubDirectory, ".project");
            let resourceDirectoryType: string = "";
            if(fse.existsSync(resourcesProjectNaturePath)){
                resourceDirectoryType = Utils.getDirectoryType(path.join(resourceSubDirectory, ".project"));
            }
            //artifact
            if (Utils.isExistDirectoryPattern(filePath, synapseDirectoryPattern)) {
                let syapseSubDirectory: string = filePath.split(synapseDirectoryPattern)[0];
                artifactXmlFilePath = path.join(syapseSubDirectory, "artifact.xml");
                Utils.deletefromArtifactXml(artifactXmlFilePath, rawArtifactName[0]);

                let artifactType = ArtifactInfo.artifactTypes.get(artifactFolder);
                if(typeof artifactType !== "undefined") Utils.deleteArtifactFromPomXml(rawArtifactName[0], artifactType.split("/")[1], rootDirectory);
            //resource
            }else if (resourceDirectoryType === SubDirectories.REGISTRY_RESOURCES) {
                artifactXmlFilePath = path.join(resourceSubDirectory, "artifact.xml");

                Utils.deletefromArtifactXml(artifactXmlFilePath, rawArtifactName[0]);
                Utils.deleteArtifactFromPomXml(rawArtifactName[0], RegistryResourceInfo.TYPE.split("/")[1], rootDirectory);
            }
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

     /**
     * Dynamically update metadata.yaml for API resource 
     */
    export function updateMetadataforApi(esbConfigsDirectory: string, filePath: string){
        let array: string[] = filePath.split(path.sep);
        let rawFileName: string = array[array.length -1];
        let rawArtifactName: string = rawFileName.split(".")[0];
        let metadaFileName: string = rawArtifactName + "_metadata.yaml";
        const pathToMetadataYaml: string = path.join(esbConfigsDirectory, "src", "main", "resources", "metadata",metadaFileName);

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

    /**
     * Add artifact element to artifact.xml DOM. 
     */
    export function addSynapseArtifactData(parent: any, xmlDoc: any, artifactName: string, groupId: string, type: string, 
        version: string, serverRole: string, filePath: string, targetFolder: string){

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

    /**
     * Create metadata.yaml for API/Proxy resource.
     */
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

    /**
     * Create new ESB Configs project.
     */
    export function CreateNewESBConfigProject(rootDirectory: string, projectName: string){
        
        //create new sub-directory
        //create pom.xml, artifact.xml and .project files
        let templatePomFilePath: string = path.join(dirName, "..", "..", "templates", "pom", "ConfigsPom.xml");
        let templateProjNatureFilePath: string = path.join(dirName, "..", "..", "templates", "Conf", "esbConfigs.xml")
        ConnectorModule.createProject(projectName, "ESB Configs Project", templatePomFilePath, templateProjNatureFilePath,
                                        SubDirectories.CONFIGS, true, rootDirectory, ProjectNatures.CONFIGS);
    }

    /**
     * Add ESB Configs project into correct module possition in root pom.xml.
     */
    export function addESBConfigsToRootPom(rootDirectory: string, projectName: string){

        //create additional sub-directories
        let metadataPath: string = path.join(rootDirectory, projectName, "src", "main", "resources", "metadata");
        file_system.mkdirSync(metadataPath, {recursive: true});

        let artifactSubFolders: string[] = [APIArtifactInfo.DESTINATION_FOLDER, EndpointArtifactInfo.DESTINATION_FOLDER, InboundEndpointArtifactInfo.DESTINATION_FOLDER,
            LocalEntryArtifactInfo.DESTINATION_FOLDER, MessageProcessorArtifactInfo.DESTINATION_FOLDER, MessageStoreArtifactInfo.DESTINATION_FOLDER, ProxyArtifactInfo.PROXY_DESTINATION_FOLDER,
            SequenceArtifactInfo.DESTINATION_FOLDER, TaskArtifactInfo.DESTINATION_FOLDER, TemplateArtifactInfo.DESTINATION_FOLDER];

        for(let i=0; i< artifactSubFolders.length; i++){
            let subFolderPath: string = path.join(rootDirectory, projectName, "src", "main", "synapse-config", artifactSubFolders[i].trim());
            file_system.mkdirSync(subFolderPath, {recursive: true});
        }

        let rootPomFilePath: string = path.join(rootDirectory, "pom.xml");
            if(!fse.existsSync(rootPomFilePath)){
                window.showErrorMessage("No root pom.xml found...!");
                return;
            }
            const rootPomBuffer: Buffer = fse.readFileSync(rootPomFilePath);
            let rootPomXmlDoc = new DOM().parseFromString(rootPomBuffer.toString(), "text/xml");
            let modules = rootPomXmlDoc.getElementsByTagName("modules")[0];
            let subModules = rootPomXmlDoc.getElementsByTagName("module");
            let totalSubModules: number = subModules.length;
            let ESBModule = rootPomXmlDoc.createElement("module");
            ESBModule.textContent = projectName.trim();

            let append: boolean = false;
            
            for(let i=0; i<totalSubModules; i++){
                let configurationFilePath: string = path.join(rootDirectory, subModules[i].textContent.trim(), '.project');
                let projectNature: string = Utils.getDirectoryType(configurationFilePath).trim();

                if(projectNature === SubDirectories.COMPOSITE_EXPORTER){
                    rootPomXmlDoc.insertBefore(ESBModule, subModules[i]);
                    append = true;
                    break;
                }          
            }

            if(!append) modules.appendChild(ESBModule);
            fse.writeFileSync(rootPomFilePath, new XMLSerializer().serializeToString(rootPomXmlDoc));
    }

    /**
     * Create new Registry Resources project.
     */
    export function CreateNewRegistryResourcesProject(rootDirectory: string, projectName: string){
    
        //create new sub-directory
        //create pom.xml, artifact.xml and .project files
        let templatePomFilePath: string = path.join(dirName, "..", "..", "templates", "pom", "RegistryResourcesPom.xml");
        let templateProjNatureFilePath: string = path.join(dirName, "..", "..", "templates", "Conf", "registryResources.xml");
        ConnectorModule.createProject(projectName, "Registry Resources Project", templatePomFilePath, templateProjNatureFilePath,
                                        SubDirectories.REGISTRY_RESOURCES, true, rootDirectory, ProjectNatures.REGISTRY_RESOURCES);
    }

    /**
     * Add Registry Resources project into correct module possition in root pom.xml.
     */
    export function addRegistryResourcesToRootPom(rootDirectory: string, projectName: string){

        //create .classpath file
        let templateConfigFilePath: string = path.join(dirName, "..", "..", "templates", "Conf", "registryClassPath.xml")
        const buf: Buffer = fse.readFileSync(templateConfigFilePath);
        let classPath  = new DOM().parseFromString(buf.toString(), "text/xml");
        let configFilePath: string = path.join(rootDirectory, projectName, ".classpath");
        Utils.createXmlFile(configFilePath, classPath);

        let rootPomFilePath: string = path.join(rootDirectory, "pom.xml");
            if(!fse.existsSync(rootPomFilePath)){
                window.showErrorMessage("No root pom.xml found...!");
                return;
            }
            const rootPomBuffer: Buffer = fse.readFileSync(rootPomFilePath);
            let rootPomXmlDoc = new DOM().parseFromString(rootPomBuffer.toString(), "text/xml");
            let modules = rootPomXmlDoc.getElementsByTagName("modules")[0];
            let subModules = rootPomXmlDoc.getElementsByTagName("module");
            let totalSubModules: number = subModules.length;
            let registryModule = rootPomXmlDoc.createElement("module");
            registryModule.textContent = projectName.trim();

            let append: boolean = false;
            
            for(let i=0; i<totalSubModules; i++){
                let configurationFilePath: string = path.join(rootDirectory, subModules[i].textContent.trim(), '.project');
                let projectNature: string = Utils.getDirectoryType(configurationFilePath).trim();

                if(projectNature === SubDirectories.CONNECTOR_EXPORTER){
                    rootPomXmlDoc.insertBefore(registryModule, subModules[i]);
                    append = true;
                    break;
                }
                else if(projectNature === SubDirectories.DATA_SOURCE){
                    rootPomXmlDoc.insertBefore(registryModule, subModules[i]);
                    append = true;
                    break;
                }
                else if(projectNature === SubDirectories.DATA_SERVICE){
                    rootPomXmlDoc.insertBefore(registryModule, subModules[i]);
                    append = true;
                    break;
                }
                else if(projectNature === SubDirectories.CONFIGS){
                    rootPomXmlDoc.insertBefore(registryModule, subModules[i]);
                    append = true;
                    break;
                }
                else if(projectNature === SubDirectories.COMPOSITE_EXPORTER){
                    rootPomXmlDoc.insertBefore(registryModule, subModules[i]);
                    append = true;
                    break;
                }                             
            }

            if(!append) modules.appendChild(registryModule);
            fse.writeFileSync(rootPomFilePath, new XMLSerializer().serializeToString(rootPomXmlDoc));
    }
}
