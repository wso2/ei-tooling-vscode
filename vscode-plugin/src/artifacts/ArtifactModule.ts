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
    LocalEntryArtifactInfo, ServerRoleInfo, SubDirectories, ProjectNatures, APIArtifactInfo, ProxyArtifactInfo,
    ArtifactInfo, RegistryResourceInfo, EndpointArtifactInfo, InboundEndpointArtifactInfo, MessageProcessorArtifactInfo,
    MessageStoreArtifactInfo, SequenceArtifactInfo, TaskArtifactInfo, TemplateArtifactInfo, MetadataInfo,
    ESBArtifactPath, Common
} from "./artifactUtils";
import { XMLSerializer as XMLSerializer } from 'xmldom';
import { RegistryResource } from "./artifactResolver";
import { Utils } from "../utils/Utils";



let DOM = require('xmldom').DOMParser;
let glob = require("glob");
const YAML = require("js-yaml");
var file_system = require('fs');

export namespace ArtifactModule {

    const dirName = __dirname;
    const SRC = ESBArtifactPath.SRC;
    const MAIN = ESBArtifactPath.MAIN;
    const SYNAPSE_CONFIG = ESBArtifactPath.SYNAPSE_CONFIG;
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

    /**
     * Create new config artifact in ESB Configs.
     */
    export function createArtifact(pathToTargetFolder: string | undefined, targetFolder: string, templateFileName: string,
        targetArtifactName: string, artifactType: string, type: string) {

        if (workspace.workspaceFolders && (typeof pathToTargetFolder !== "undefined")) {

            // Create target folder path where the new config artifact is going to be added in the project.
            let directoryPattern: string = path.join(SRC, MAIN, SYNAPSE_CONFIG);
            const esbConfigsDirectory: string = pathToTargetFolder.split(`${path.sep}${directoryPattern}`)[0];

            // Check if the path really exists. If not exists, the project is not a standard Synapse muilti-module Project
            Utils.checkPathExistence(pathToTargetFolder).then(exists => {
                if (exists) {
                    createArtifactFromTemplate(esbConfigsDirectory, targetFolder, templateFileName, targetArtifactName, artifactType, type,
                        pathToTargetFolder, SYNAPSE_CONFIG, undefined);
                }
            });
        }
        else {
            window.showErrorMessage("No workspace folder found");
        }
    }

    /**
    * Create new resource in Registry Resources.
    */
    export function createResource(targetFolder: string, templateFileName: string, targetArtifactName: string,
        artifactType: string, type: string, registryResource: RegistryResource) {

        if (workspace.workspaceFolders) {
            const registryResourceSubDirectory: string = Utils.getDirectoryFromDirectoryType(SubDirectories.REGISTRY_RESOURCES,
                workspace.workspaceFolders[0].uri.fsPath);
            // Check if the path really exists. If not exists, the project is not a standard Synapse muilti-module Project
            Utils.checkPathExistence(registryResourceSubDirectory).then(exists => {
                if (exists) {
                    createArtifactFromTemplate(registryResourceSubDirectory, targetFolder, templateFileName, targetArtifactName, artifactType, type,
                        registryResourceSubDirectory, "registry-resources", registryResource);
                }
            });
        }
        else {
            window.showErrorMessage("No workspace folder found");
        }
    }

    /**
    * Create artifact from template.
    */
    function createArtifactFromTemplate(subDirectory: string, targetFolder: string, templateFileName: string, targetArtifactName: string,
        artifactType: string, type: string, pathToTargetFolder: string, resourceType: string,
        registryResource: RegistryResource | undefined) {

        let rootDirectory: string = path.join(subDirectory, "..");

        if (typeof registryResource === "undefined") {//synapse artifact

            let pattern = path.join("*", targetArtifactName + getFileExtension(registryResource));
            let cwd = path.join(subDirectory, SRC, MAIN, resourceType);

            //target metadata.yaml and swagger.yaml folder
            let pathtoResourcesFile = path.join(subDirectory, SRC, MAIN, RESOURECS, METADATA);

            let newGlob = new glob(pattern, { cwd: cwd }, async function (err: any, files: any) {
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
                    let templateArtifactFilePath = path.join(dirName, '..', '..', TEMPLATES, targetFolder,
                        templateFileName + getFileExtension(registryResource));
                    //create metadata and swagger files for API
                    if (type === APIArtifactInfo.TYPE) {
                        //path to metadata template
                        let templateMetadataFilePath = path.join(dirName, '..', '..', TEMPLATES, METADATA, `${METADATA}.yaml`);
                        //path to swagger template
                        let templateSwaggerFilePath = path.join(dirName, '..', '..', TEMPLATES, METADATA, `${SWAGGER}.yaml`);
                        //path to metadata file
                        let targetMetadataFilePath = path.join(pathtoResourcesFile, `${targetArtifactName}_${METADATA}.yaml`);
                        //path to swagger file
                        let targetSwaggerFilePath = path.join(pathtoResourcesFile, `${targetArtifactName}_${SWAGGER}.yaml`);

                        let edit = new WorkspaceEdit();
                        let targetMetadataFilePatUri = Uri.file(targetMetadataFilePath);
                        edit.createFile(targetMetadataFilePatUri);
                        workspace.applyEdit(edit);

                        //create and update metadata.yaml
                        let serviceUrl: string = "https://{MI_HOST}:{MI_PORT}/context_here";
                        createMetaDataYaml(templateMetadataFilePath, targetArtifactName, "Sample API", "OAS3", serviceUrl, targetMetadataFilePatUri);

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
                    else if (type === ProxyArtifactInfo.TYPE) {//create metadata file for proxy service
                        //path to metadata template
                        let templateMetadataFilePath = path.join(dirName, '..', '..', TEMPLATES, METADATA, `${METADATA}.yaml`);
                        //path to metadata file
                        let targetMetadataFilePath = path.join(pathtoResourcesFile, `${targetArtifactName}_proxy_${METADATA}.yaml`);

                        let edit = new WorkspaceEdit();
                        let targetMetadataFilePatUri = Uri.file(targetMetadataFilePath);
                        edit.createFile(targetMetadataFilePatUri);
                        workspace.applyEdit(edit);

                        //create and update metadata.yaml
                        let serviceUrl: string = "https://{MI_HOST}:{MI_PORT}/services/" + targetArtifactName;
                        createMetaDataYaml(templateMetadataFilePath, targetArtifactName, "Sample Proxy Service", "WSDL1", serviceUrl,
                            targetMetadataFilePatUri);
                    }

                    createTargetArtifactFromTemplate(targetArtifactFileUri, targetArtifactName,
                        templateArtifactFilePath, artifactType, registryResource);
                    addNewArtifactToArtifactXmlFile(subDirectory, targetArtifactName, targetFolder, type);
                    updateCompositePomXmlFile(rootDirectory, targetArtifactName, type);
                }
            });
        }
        else {//create registry resource

            let targetArtifactFilePath = path.join(pathToTargetFolder, targetArtifactName + getFileExtension(registryResource));

            if (fse.existsSync(targetArtifactFilePath)) {
                // file name already exists in the project.
                window.showErrorMessage("Artifact Name " + targetArtifactName + " already exists!");
                return;
            }

            const targetArtifactFileUri: Uri = Uri.file(targetArtifactFilePath);
            let templateArtifactFilePath = path.join(dirName, '..', '..', TEMPLATES, targetFolder,
                templateFileName + getFileExtension(registryResource));

            createTargetArtifactFromTemplate(targetArtifactFileUri, targetArtifactName,
                templateArtifactFilePath, artifactType, registryResource);

            let rootPomFilePath: string = path.join(subDirectory, "..", POM_FILE);
            let project: Utils.Project = Utils.getProjectInfoFromPOM(rootPomFilePath);
            const { groupId, version } = Object.assign(project);
            let artifactXmlFilePath: string = path.join(subDirectory, ARTIFACT_FILE);
            let finalGroupId: string = `${groupId}.${RegistryResourceInfo.TYPE.split("/")[1]}`;

            Utils.addArtifactToArtifactXml(artifactXmlFilePath, targetArtifactName, finalGroupId, VERSION, type,
                ServerRoleInfo.ENTERPRISE_INTEGRATOR, registryResource.file!, registryResource.path,
                registryResource.mediaType, undefined);
            updateCompositePomXmlFile(rootDirectory, targetArtifactName, type);
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
            switch (registryResource!.mediaType) {
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
        } else {
            data = updateSynapseArtifactTemplate(artifactType, buf, targetArtifactName);
        }
        // Write the updated template content to the target file.
        let xmlData = new DOM().parseFromString(data, "text/xml");
        let fileUri: Uri = Utils.createXmlFile(targetArtifactFileUri.fsPath, xmlData);

        // Open and show newly created artifact document in the editor.
        workspace.openTextDocument(fileUri).then(doc => window.showTextDocument(doc));
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
     * Update the name attribute value in the buffered content.
     */
    function updateAttribute(buf: Buffer, attributeName: string, attributeValue: string): string {
        let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
        xmlDoc.lastChild.setAttribute(attributeName, attributeValue);
        return new XMLSerializer().serializeToString(xmlDoc);
    }

    /**
     * Add artifact info of the newly created artifact to synapse-config artifact.xml file.
     * Create dependancy and property in CompositeExporter pom.xml
     */
    function addNewArtifactToArtifactXmlFile(esbConfigsDirectory: string, artifactName: string, targetFolder: string, type: string) {

        const pomFile: string = path.join(esbConfigsDirectory, "..", POM_FILE);
        const configArtifactXmlFileLocation: string = path.join(esbConfigsDirectory, ARTIFACT_FILE);
        if ((!fse.existsSync(pomFile)) || (!fse.existsSync(configArtifactXmlFileLocation))) return;

        // read pom and get project group_id and version
        let project: Utils.Project = Utils.getProjectInfoFromPOM(pomFile);
        const { groupId, version } = Object.assign(project);
        let finalGroupId: string = `${groupId}.${type.split("/")[1]}`;
        let file: string = [SRC, MAIN, SYNAPSE_CONFIG, targetFolder, `${artifactName}.xml`].join("/");

        Utils.addArtifactToArtifactXml(configArtifactXmlFileLocation, artifactName, finalGroupId, VERSION, type,
            ServerRoleInfo.ENTERPRISE_SERVICE_BUS, file, undefined,
            undefined, undefined);

        //add  metadata and swagger artifacts to artifact.xml for an api resource
        if (type === APIArtifactInfo.TYPE) {

            finalGroupId = `${groupId}.${METADATA}`;

            //metadata
            let metaDataName: string = `${artifactName}_${METADATA}`;
            let metaDataFilePath: string = [SRC, MAIN, RESOURECS, METADATA, `${metaDataName}.yaml`].join("/");
            Utils.addArtifactToArtifactXml(configArtifactXmlFileLocation, metaDataName, finalGroupId, VERSION, MetadataInfo.SYNAPSE_MEATADATA_TYPE,
                ServerRoleInfo.ENTERPRISE_SERVICE_BUS, metaDataFilePath, undefined,
                undefined, undefined);
            //swagger
            let swaggerName: string = `${artifactName}_${SWAGGER}`;
            let swaggerFilePath: string = [SRC, MAIN, RESOURECS, METADATA, `${swaggerName}.yaml`].join("/");
            Utils.addArtifactToArtifactXml(configArtifactXmlFileLocation, swaggerName, finalGroupId, VERSION, MetadataInfo.SYNAPSE_MEATADATA_TYPE,
                ServerRoleInfo.ENTERPRISE_SERVICE_BUS, swaggerFilePath, undefined,
                undefined, undefined);
        }
        else if (type === ProxyArtifactInfo.TYPE) {

            finalGroupId = `${groupId}.proxy-service.${METADATA}`;

            //metadata
            let metaDataName: string = `${artifactName}_proxy_${METADATA}`;
            let metaDataFilePath: string = [SRC, MAIN, RESOURECS, METADATA, `${metaDataName}.yaml`].join("/");

            Utils.addArtifactToArtifactXml(configArtifactXmlFileLocation, metaDataName, finalGroupId, VERSION, MetadataInfo.SYNAPSE_MEATADATA_TYPE,
                ServerRoleInfo.ENTERPRISE_SERVICE_BUS, metaDataFilePath, undefined,
                undefined, undefined);
        }
    }

    /**
     * Update composite pom.xml with new artifact related information.
     */
    function updateCompositePomXmlFile(rootDirectory: string, artifactName: string, type: string) {

        // read pom and get project group_id and version
        let compositeExporterDirectory: string = Utils.getDirectoryFromDirectoryType(SubDirectories.COMPOSITE_EXPORTER, rootDirectory);
        const pomFile: string = path.join(compositeExporterDirectory, POM_FILE);

        let serverRole: string;
        let project: Utils.Project = Utils.getProjectInfoFromPOM(pomFile);
        const { groupId, version } = Object.assign(project);
        let finalGroupId: string = groupId + "." + type.split("/")[1];
        if (type === RegistryResourceInfo.TYPE) serverRole = ServerRoleInfo.ENTERPRISE_INTEGRATOR;
        else serverRole = ServerRoleInfo.ENTERPRISE_SERVICE_BUS;

        Utils.updateCompositePomXml(compositeExporterDirectory, artifactName, type, serverRole, finalGroupId);

        if (type === APIArtifactInfo.TYPE) {
            finalGroupId = `${groupId}.${METADATA}`;
            //metadata
            let metadataArtifactName: string = `${artifactName}_${METADATA}`;
            Utils.updateCompositePomXml(compositeExporterDirectory, metadataArtifactName, MetadataInfo.SYNAPSE_MEATADATA_TYPE, serverRole, finalGroupId);
            //swagger
            let swaggerArtifactName: string = `${artifactName}_${SWAGGER}`;
            Utils.updateCompositePomXml(compositeExporterDirectory, swaggerArtifactName, MetadataInfo.SYNAPSE_MEATADATA_TYPE, serverRole, finalGroupId);
        }
        else if (type === ProxyArtifactInfo.TYPE) {
            finalGroupId = groupId + ".proxy-service." + METADATA;
            //metadata
            let metadataArtifactName: string = artifactName + "_proxy_" + METADATA;
            Utils.updateCompositePomXml(compositeExporterDirectory, metadataArtifactName, MetadataInfo.SYNAPSE_MEATADATA_TYPE, serverRole, finalGroupId);
        }
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
            let synapseDirectoryPattern: string = path.join(SRC, MAIN, SYNAPSE_CONFIG);

            let resourceSubDirectory: string = path.join(filePath, "..");
            let resourcesProjectNaturePath: string = path.join(resourceSubDirectory,);
            let resourceDirectoryType: string = "";
            if (fse.existsSync(resourcesProjectNaturePath)) {
                resourceDirectoryType = Utils.getDirectoryType(path.join(resourceSubDirectory, PROJECT_FILE));
            }
            //artifact
            if (filePath.includes(synapseDirectoryPattern)) {
                let syapseSubDirectory: string = filePath.split(synapseDirectoryPattern)[0];
                artifactXmlFilePath = path.join(syapseSubDirectory, ARTIFACT_FILE);
                Utils.deletefromArtifactXml(artifactXmlFilePath, rawArtifactName[0]);

                let artifactType = ArtifactInfo.artifactTypes.get(artifactFolder);
                if (typeof artifactType !== "undefined") Utils.deleteArtifactFromPomXml(rawArtifactName[0], artifactType.split("/")[1], rootDirectory, undefined);
                //resource
            } else if (resourceDirectoryType === SubDirectories.REGISTRY_RESOURCES) {
                artifactXmlFilePath = path.join(resourceSubDirectory, ARTIFACT_FILE);

                Utils.deletefromArtifactXml(artifactXmlFilePath, rawArtifactName[0]);
                Utils.deleteArtifactFromPomXml(rawArtifactName[0], RegistryResourceInfo.TYPE.split("/")[1], rootDirectory, undefined);
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
        if (registryResource !== undefined) {
            switch (registryResource!.mediaType) {
                case "application/json": {
                    extension = ".json";
                    break;
                }
                case "text/css": {
                    extension = ".css";
                    break;
                }
                case "application/datamapper": {
                    extension = ".dmc";
                    break;
                }
                case "text/html": {
                    extension = ".html";
                    break;
                }
                case "application/javascript": {
                    extension = ".js";
                    break;
                }
                case "application/wsdl+xml": {
                    extension = ".wsdl";
                    break;
                }
                case "application/x-xsd+xml": {
                    extension = ".xsd";
                    break;
                }
                case "application/xsl+xml": {
                    extension = ".xsl";
                    break;
                }
                case "application/xslt+xml": {
                    extension = ".xslt";
                    break;
                }
                case "application/yaml": {
                    extension = ".yaml";
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
    export function updateMetadataforApi(esbConfigsDirectory: string, filePath: string) {
        let array: string[] = filePath.split(path.sep);
        let rawFileName: string = array[array.length - 1];
        let rawArtifactName: string = rawFileName.split(".")[0];
        let metadaFileName: string = `${rawArtifactName}_${METADATA}.yaml`;
        const pathToMetadataYaml: string = path.join(esbConfigsDirectory, SRC, MAIN, RESOURECS, METADATA, metadaFileName);
        if (!fse.existsSync(pathToMetadataYaml)) return;

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
     * Create metadata.yaml for API/Proxy resource.
     */
    function createMetaDataYaml(templateFilePath: string, artifactName: string, description: string, definitionType: string,
        serviceUrl: string, targetFilePathUri: Uri) {
        // Read and buffer metadata.yaml template file.
        const raw: Buffer = fse.readFileSync(templateFilePath);
        let data = YAML.load(raw);
        data.key = `${artifactName}-${VERSION}`;
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
    export function CreateNewESBConfigProject(rootDirectory: string, projectName: string) {

        //create new sub-directory
        //create pom.xml, artifact.xml and .project files
        let templatePomFilePath: string = path.join(dirName, "..", "..", TEMPLATES, POM, "ConfigsPom.xml");
        let templateProjNatureFilePath: string = path.join(dirName, "..", "..", TEMPLATES, CONF, "esbConfigs.xml")
        Utils.createProject(projectName, "ESB Configs Project", templatePomFilePath, templateProjNatureFilePath,
            SubDirectories.CONFIGS, true, rootDirectory, ProjectNatures.CONFIGS);

        //create additional sub-directories
        let metadataPath: string = path.join(rootDirectory, projectName, SRC, MAIN, RESOURECS, METADATA);
        file_system.mkdirSync(metadataPath, { recursive: true });

        let artifactSubFolders: string[] = [APIArtifactInfo.DESTINATION_FOLDER, EndpointArtifactInfo.DESTINATION_FOLDER, InboundEndpointArtifactInfo.DESTINATION_FOLDER,
        LocalEntryArtifactInfo.DESTINATION_FOLDER, MessageProcessorArtifactInfo.DESTINATION_FOLDER, MessageStoreArtifactInfo.DESTINATION_FOLDER, ProxyArtifactInfo.PROXY_DESTINATION_FOLDER,
        SequenceArtifactInfo.DESTINATION_FOLDER, TaskArtifactInfo.DESTINATION_FOLDER, TemplateArtifactInfo.DESTINATION_FOLDER];

        for (let i = 0; i < artifactSubFolders.length; i++) {
            let subFolderPath: string = path.join(rootDirectory, projectName, SRC, MAIN, SYNAPSE_CONFIG, artifactSubFolders[i].trim());
            file_system.mkdirSync(subFolderPath, { recursive: true });
        }
    }

    /**
     * Add ESB Configs project into correct module possition in root pom.xml.
     */
    export function addESBConfigsToRootPom(rootDirectory: string, projectName: string) {

        let rootPomFilePath: string = path.join(rootDirectory, POM_FILE);
        if (!fse.existsSync(rootPomFilePath)) {
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

        for (let i = 0; i < totalSubModules; i++) {
            let configurationFilePath: string = path.join(rootDirectory, subModules[i].textContent.trim(), PROJECT_FILE);
            let projectNature: string = Utils.getDirectoryType(configurationFilePath).trim();

            if (projectNature === SubDirectories.COMPOSITE_EXPORTER) {
                rootPomXmlDoc.insertBefore(ESBModule, subModules[i]);
                append = true;
                break;
            }
        }

        if (!append) modules.appendChild(ESBModule);
        fse.writeFileSync(rootPomFilePath, new XMLSerializer().serializeToString(rootPomXmlDoc));
    }

    /**
     * Create new Registry Resources project.
     */
    export function CreateNewRegistryResourcesProject(rootDirectory: string, projectName: string) {

        //create new sub-directory
        //create pom.xml, artifact.xml and .project files
        let templatePomFilePath: string = path.join(dirName, "..", "..", TEMPLATES, POM, "RegistryResourcesPom.xml");
        let templateProjNatureFilePath: string = path.join(dirName, "..", "..", TEMPLATES, CONF, "registryResources.xml");
        Utils.createProject(projectName, "Registry Resources Project", templatePomFilePath, templateProjNatureFilePath,
            SubDirectories.REGISTRY_RESOURCES, true, rootDirectory, ProjectNatures.REGISTRY_RESOURCES);

        //create .classpath file
        let templateConfigFilePath: string = path.join(dirName, "..", "..", TEMPLATES, CONF, "registryClassPath.xml")
        const buf: Buffer = fse.readFileSync(templateConfigFilePath);
        let classPath = new DOM().parseFromString(buf.toString(), "text/xml");
        let configFilePath: string = path.join(rootDirectory, projectName, ".classpath");
        Utils.createXmlFile(configFilePath, classPath);
    }

    /**
     * Add Registry Resources project into correct module possition in root pom.xml.
     */
    export function addRegistryResourcesToRootPom(rootDirectory: string, projectName: string) {

        let rootPomFilePath: string = path.join(rootDirectory, POM_FILE);
        if (!fse.existsSync(rootPomFilePath)) {
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

        for (let i = 0; i < totalSubModules; i++) {
            let configurationFilePath: string = path.join(rootDirectory, subModules[i].textContent.trim(), PROJECT_FILE);
            let projectNature: string = Utils.getDirectoryType(configurationFilePath).trim();

            if (projectNature === SubDirectories.CONNECTOR_EXPORTER) {
                rootPomXmlDoc.insertBefore(registryModule, subModules[i]);
                append = true;
                break;
            }
            else if (projectNature === SubDirectories.DATA_SOURCE) {
                rootPomXmlDoc.insertBefore(registryModule, subModules[i]);
                append = true;
                break;
            }
            else if (projectNature === SubDirectories.DATA_SERVICE) {
                rootPomXmlDoc.insertBefore(registryModule, subModules[i]);
                append = true;
                break;
            }
            else if (projectNature === SubDirectories.CONFIGS) {
                rootPomXmlDoc.insertBefore(registryModule, subModules[i]);
                append = true;
                break;
            }
            else if (projectNature === SubDirectories.COMPOSITE_EXPORTER) {
                rootPomXmlDoc.insertBefore(registryModule, subModules[i]);
                append = true;
                break;
            }
        }

        if (!append) modules.appendChild(registryModule);
        fse.writeFileSync(rootPomFilePath, new XMLSerializer().serializeToString(rootPomXmlDoc));
    }
}
