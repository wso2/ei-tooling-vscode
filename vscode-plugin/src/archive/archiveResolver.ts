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

import {workspace, Uri, window, commands, WorkspaceEdit} from "vscode";
import * as path from 'path';
import * as fse from "fs-extra";
import {executeProjectBuildCommand} from "../mavenInternals/commandHandler";
import { ArtifactModule } from "../artifacts/ArtifactModule";
import { DataServiceModule } from "../dataService/DataServiceModule";
import {APIArtifactInfo, ArtifactInfo, EndpointArtifactInfo, InboundEndpointArtifactInfo, LocalEntryArtifactInfo, MessageProcessorArtifactInfo, MessageStoreArtifactInfo, MetadataInfo, ProjectNatures, ProxyArtifactInfo, RegistryResourceInfo, SequenceArtifactInfo, SubDirectories, TaskArtifactInfo, TemplateArtifactInfo} from "../artifacts/artifactUtils";
import {chooseTargetFolder, chooseTargetFile, showInputBox, showInputBoxForArtifactId, showInputBoxForGroupId} from "../utils/uiUtils";
import {Utils} from "../utils/Utils";
import {XMLSerializer as XMLSerializer} from 'xmldom';
import { ConnectorInfo } from "../connector/connectorUtils";
import { ConnectorModule } from "../connector/ConnectorModule";
import { DataServiceInfo } from "../dataService/dataServiceUtils";
import { MediatorProjectInfo } from "../mediatorProject/mediarorProjectUtils";
import { MediatorProjectModule } from "../mediatorProject/MediatorProjectModule";

let DOM = require('xmldom').DOMParser;
var fileSystem = require('fs');
var archiver = require('archiver');
const extract = require('extract-zip');
var AdmZip = require('adm-zip');
const fernflower = require("fernflower");

let dataServiceProjectCreated: boolean = false;

/*
* Build the project and create the .car file in the target folder
* */
export function createDeployableArchive() {

    let projectNatures: string[] = [SubDirectories.COMPOSITE_EXPORTER, SubDirectories.CONFIGS, SubDirectories.CONNECTOR_EXPORTER,
         SubDirectories.REGISTRY_RESOURCES, SubDirectories.DATA_SERVICE];
    

    if (workspace.workspaceFolders) {
        let rootDirectory: string = workspace.workspaceFolders[0].uri.fsPath;
        fileSystem.readdir(rootDirectory, (err: any, files: any) => {
            if (err)
              console.log(err);
            else {
              files.forEach( (file: any) => {
                let projConfigFilePath: string = path.join(rootDirectory, file, ".project");
                let pomFilePath: string = path.join(rootDirectory, file, "pom.xml");
                ArtifactModule.checkPathExistence(pomFilePath).then(exists => {
                    if (exists) {
                        let projectNature: string = ArtifactModule.getProjectNature(projConfigFilePath);
                        if(projectNatures.indexOf(projectNature) !== -1){
                            ArtifactModule.checkBuildPlugins(pomFilePath, projectNature);
                        }
                    }
                });

              })
            }
            executeProjectBuildCommand(rootDirectory);
          });
        }
}

export async function createZipArchive(){

    // Set home dir as the target folder hint.
    const homedir: string = require('os').homedir();
    const targetFolderHint = Uri.file(homedir);

    let zipFileName = await showInputBox("Enter zip archive name");

    if((typeof zipFileName === "undefined") || (zipFileName === "") ) {
        zipFileName = "untitled";
    }

    //get the destination folder
    const targetLocation: string | null = await chooseTargetFolder(targetFolderHint);

    if(workspace.workspaceFolders && targetLocation){

        let rootDirectory: string = workspace.workspaceFolders[0].uri.fsPath;
        let projectName: string = workspace.workspaceFolders[0].name;

        let zipFilePath: string = path.join(targetLocation, zipFileName+".zip");
        let output = fileSystem.createWriteStream(zipFilePath);
        let archive = archiver('zip');

        archive.on('error', function(err: any){
            window.showErrorMessage("Zip Archive Creation Failed");
            return;
            
        });

        // pipe archive data to the file
        archive.pipe(output);

        // append files from a sub-directory and naming it <project-name> within the archive
        archive.directory(rootDirectory, projectName);
        
        // finalize the archive (ie we are done appending files but streams have to finish yet)
        archive.finalize();
        window.showInformationMessage("Zip Archive Created Successfully");
            

    }
}

export async function unzipArchive(){

    try {
        // Set home dir as the target folder hint.
        const homedir: string = require('os').homedir();
        const targetFolderHint = Uri.file(homedir);

        //get the target folder
        const targetLocation: string | null = await chooseTargetFile(targetFolderHint, "Select ZIP Archive...", {'ZIP files': ['zip']});

        var zip = new AdmZip(targetLocation);
        var zipEntries = zip.getEntries(); // an array of ZipEntry records
        
        if(targetLocation){

            //get the destination directory
            const destinationLocation: string | null = await chooseTargetFolder(targetFolderHint);

            if(destinationLocation){
                await extract(targetLocation, { dir: destinationLocation })

                window.showInformationMessage("Zip Archive Imported Successfully");
    
                let projectName: string = zipEntries[0].entryName.split(path.sep)[0].trim();
                let projectFilePath: string = path.join(destinationLocation, projectName);
                commands.executeCommand('vscode.openFolder', Uri.file(projectFilePath), true);

            }
           
        }
        
      } catch (err) {
            window.showErrorMessage("Zip Archive Extraction Failed");
      }
}

export async function createProjectFromCar(){

    const dirName = __dirname;

    try {
        // Set home dir as the target folder hint.
        const homedir: string = require('os').homedir();
        const targetFolderHint = Uri.file(homedir);

        //get the target folder
        const targetLocation: string | null = await chooseTargetFile(targetFolderHint, "Select CAR Archive...", {'car files': ['car']});
        
        if(targetLocation){

            let artifactID: string | undefined = await showInputBoxForArtifactId();
            let groupID: string | undefined = await showInputBoxForGroupId();

            // Ensure that artifactID name is valid.
            while (typeof artifactID !== "undefined" && !Utils.validate(artifactID)) {
                window.showErrorMessage("Enter valid ArtifactId name!!");
                artifactID = await showInputBoxForArtifactId();
            }

            // Ensure that groupID name is valid.
            while (typeof groupID !== "undefined" && !Utils.validate(groupID)) {
                window.showErrorMessage("Enter valid GroupId name!!");
                groupID = await showInputBoxForGroupId();
            }

            if (typeof artifactID === "undefined" || typeof groupID === "undefined") {
                return;
            }

            //get the destination directory
            const destinationLocation: string | null = await chooseTargetFolder(targetFolderHint);

            if(destinationLocation){

                //create new project directory
                let newProjectDirectory: string = path.join(destinationLocation, artifactID);
                if(fse.existsSync(newProjectDirectory)){
                    window.showErrorMessage("Project directory already exists...!");
                    return;
                }
                fileSystem.mkdirSync(newProjectDirectory);

                //extract zip archive
                let tmpDirectory: string = path.join(newProjectDirectory, "tmp");
                fse.mkdirSync(tmpDirectory);
                await extract(targetLocation, { dir: tmpDirectory });

                //read root metadata file
                let rootArtifactsPath: string = path.join(tmpDirectory, "artifacts.xml");
                if(!fse.existsSync(rootArtifactsPath)){
                    window.showErrorMessage("Can not find root artifacts file.New project creation failed...!");
                    return;
                }
                const buffer: Buffer = fse.readFileSync(rootArtifactsPath);
                let medatadaXml = new DOM().parseFromString(buffer.toString(), "text/xml");
                let artifacts = medatadaXml.getElementsByTagName("artifact");
                if(artifacts.length > 0){
                    let name: string = artifacts[0].getAttribute("name");
                    let version: string = artifacts[0].getAttribute("version");
                    let dependencies = artifacts[0].getElementsByTagName("dependency");
                    createProjectNatureFile(destinationLocation, artifactID);
                    createRootPomXml(destinationLocation, groupID, artifactID, version);
                    //create settings.json
                    let settingsDirectory: string = path.join(newProjectDirectory,".vscode");
                    let settingsFilePath: string = path.join(settingsDirectory, "settings.json");
                    let templateSettingsFilePath: string = path.join(dirName, "..", "..", "templates", "Conf", "settings.json");
                    fse.mkdirSync(settingsDirectory);

                    let edit = new WorkspaceEdit();
                    edit.createFile(Uri.file(settingsFilePath));
                    workspace.applyEdit(edit);
                    let settings: Buffer = fse.readFileSync(templateSettingsFilePath);
                    fse.writeFileSync(settingsFilePath, settings);
                    
                    //create composite exporter project
                    ArtifactModule.CreateNewCompositeExporterProject(newProjectDirectory, name.trim());

                    if(dependencies.length === 0){
                        window.showInformationMessage("No dependencies for the project...!");
                        return;
                    }

                    //create esb configs project
                    let esbConfigsName: string = `${artifactID}Configs`;
                    ArtifactModule.CreateNewESBConfigProject(newProjectDirectory, esbConfigsName);

                    //create registry resouces project
                    let registryResourcesName: string = `${artifactID}RegistryResources`;
                    ArtifactModule.CreateNewRegistryResourcesProject(newProjectDirectory, registryResourcesName);

                    //create connector exporter project
                    let connectorExporterName: string = `${artifactID}ConnectorExporter`;
                    ConnectorModule.createNewConnectorExporter(newProjectDirectory, connectorExporterName);

                    for(let i=0; i<dependencies.length; i++){
                        let artifactName: string = dependencies[i].getAttribute("artifact");
                        let version: string = dependencies[i].getAttribute("version");
                        let include: string = dependencies[i].getAttribute("include").trim();
                        if(include === "true"){
                            let artifactXmlFilePath: string = path.join(tmpDirectory, `${artifactName}_${version}`, "artifact.xml");
                            if(fse.existsSync(artifactXmlFilePath)){
                                //create artifacts
                                let esbConfigseDirctory: string = path.join(newProjectDirectory, esbConfigsName);
                                let compositeDirectory: string = path.join(newProjectDirectory, name.trim());
                                let connectorExporterDirectory: string = path.join(newProjectDirectory, connectorExporterName);
                                let registryResourcesDirectory: string = path.join(newProjectDirectory, registryResourcesName);
                                let metadataDirectory: string = path.join(tmpDirectory, "metadata");
                                let rootMetadataFilePath: string = path.join(tmpDirectory, "metadata.xml");
                                copyArtifactFile(newProjectDirectory, artifactID, esbConfigseDirctory, compositeDirectory, connectorExporterDirectory, 
                                    registryResourcesDirectory, metadataDirectory, rootMetadataFilePath, artifactXmlFilePath, groupID);
                                
                            }
                        }
                    }
                }

                commands.executeCommand('vscode.openFolder', Uri.file(newProjectDirectory), true);

                

                //window.showInformationMessage("Zip Archive Imported Successfully");
    
                //let projectName: string = zipEntries[0].entryName.split(path.sep)[0].trim();
                //let projectFilePath: string = path.join(destinationLocation, projectName);
                //commands.executeCommand('vscode.openFolder', Uri.file(projectFilePath), true);

            }
           
        }
        
      } catch (err) {
            window.showErrorMessage("Project Creation Failed");
      }

}

function createRootPomXml(directory: string,groupID: string, artifactID: string, version: string){
    let templatePomFilePath: string = path.join(__dirname, "..", "..", "templates", "pom", "rootPom.xml");
    let pomFilePath: string = path.join(directory, artifactID, "pom.xml");
    const rootPomBuffer: Buffer = fse.readFileSync(templatePomFilePath);
    let rootPomXmlDoc = new DOM().parseFromString(rootPomBuffer.toString(), "text/xml");
    let rootGroupId = rootPomXmlDoc.getElementsByTagName("groupId")[0];
    let rootArtifactId = rootPomXmlDoc.getElementsByTagName("artifactId")[0];
    let rootVersion = rootPomXmlDoc.getElementsByTagName("version")[0];
    let name = rootPomXmlDoc.getElementsByTagName("name")[0];
    let description = rootPomXmlDoc.getElementsByTagName("description")[0];
    rootGroupId.textContent = groupID;
    rootArtifactId.textContent = artifactID;
    rootVersion.textContent = version;
    name.textContent = artifactID;
    description.textContent = artifactID;
    DataServiceModule.createFile(pomFilePath, rootPomXmlDoc);
}

function createProjectNatureFile(directory: string, artifactId: string){
    let templateFilePath: string = path.join(__dirname, "..", "..", "templates", "Conf", "multiModuleProject.xml");
    let newFilePath: string = path.join(directory, artifactId, ".project");
    const buffer: Buffer = fse.readFileSync(templateFilePath);
    let xmlDoc = new DOM().parseFromString(buffer.toString(), "text/xml");
    let name = xmlDoc.getElementsByTagName("name")[0];
    name.textContent = artifactId;
    DataServiceModule.createFile(newFilePath, xmlDoc);
}

async function copyArtifactFile(rootDirectory: string, projectName: string, configsDirecrory: string, compositeDirectory: string, connectorExporterDirectory: string, registryResourcesDirectory: string,
     metadataDirectory: string, metadataFilePath: string, artifactXmlFilePath: string, groupId: string){

    const buffer: Buffer = fse.readFileSync(artifactXmlFilePath);
    let xmlDoc = new DOM().parseFromString(buffer.toString(), "text/xml");
    let artifact = xmlDoc.getElementsByTagName("artifact");
    if(artifact.length > 0){
        
        let type: string = artifact[0].getAttribute("type").trim();
    
        let artifactTypes: string[] = [APIArtifactInfo.TYPE, ProxyArtifactInfo.TYPE, EndpointArtifactInfo.TYPE, InboundEndpointArtifactInfo.TYPE,
            LocalEntryArtifactInfo.TYPE, MessageStoreArtifactInfo.TYPE, MessageProcessorArtifactInfo.TYPE, TemplateArtifactInfo.TYPE, 
            SequenceArtifactInfo.TYPE, TaskArtifactInfo.TYPE];
    
        let index: number = artifactTypes.indexOf(type);

        let name: string = artifact[0].getAttribute("name").trim();
        let version: string = artifact[0].getAttribute("version").trim();
        let serverRole: string = artifact[0].getAttribute("serverRole").trim();
        let fileName: string = artifact[0].getElementsByTagName("file")[0].textContent.trim();

        if(index !== -1){//synapse artifact

            let newFileName: string = `${name}.${ArtifactInfo.fileTypes.get(type)}`;

            let artifcatFolders: string[] = [APIArtifactInfo.DESTINATION_FOLDER, ProxyArtifactInfo.PROXY_DESTINATION_FOLDER, EndpointArtifactInfo.DESTINATION_FOLDER,
            InboundEndpointArtifactInfo.DESTINATION_FOLDER, LocalEntryArtifactInfo.DESTINATION_FOLDER, MessageStoreArtifactInfo.DESTINATION_FOLDER,
            MessageProcessorArtifactInfo.DESTINATION_FOLDER, TemplateArtifactInfo.DESTINATION_FOLDER, SequenceArtifactInfo.DESTINATION_FOLDER,
            TaskArtifactInfo.DESTINATION_FOLDER];

            let destinationFolder: string = artifcatFolders[index];
            let destinationFilePath: string = path.join(configsDirecrory, "src", "main", "synapse-config", destinationFolder, newFileName);
        
            let curruntArtifactPath: string = path.join(artifactXmlFilePath, "..", fileName);

            let edit = new WorkspaceEdit();
            edit.createFile(Uri.file(destinationFilePath));
            workspace.applyEdit(edit);

            fse.copySync(curruntArtifactPath, destinationFilePath);

            //update artifact.xml
            let configsArtifactfilePath: string = path.join(configsDirecrory, "artifact.xml");
            const buf: Buffer = fse.readFileSync(configsArtifactfilePath);
            let xmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
            let parent = xmlDoc.getElementsByTagName("artifacts");
            let filePath: string = path.join("src", "main", "synapse-config", destinationFolder, newFileName);
            ArtifactModule.addSynapseArtifactData(parent, xmlDoc, name, groupId, type, version, serverRole, filePath, destinationFolder);
            fse.writeFileSync(configsArtifactfilePath, new XMLSerializer().serializeToString(xmlDoc));

            //update composite pom.xml
            let finalGroupId = groupId + "." + type.split("/")[1];
            updateCompositePomXml(compositeDirectory, name, type, serverRole, finalGroupId);

            if((type === APIArtifactInfo.TYPE) || (type === ProxyArtifactInfo.TYPE)){
                copySynapseMetadataFiles(metadataDirectory, metadataFilePath, name, configsDirecrory, compositeDirectory, 
                    groupId, destinationFolder);
            }
        }
        else if(type === RegistryResourceInfo.TYPE){//registry resource

            let registryInfoFilePath: string = path.join(artifactXmlFilePath, "..", fileName);
            const buff: Buffer = fse.readFileSync(registryInfoFilePath);
            let xmlDoc = new DOM().parseFromString(buff.toString(), "text/xml");
            let items = xmlDoc.getElementsByTagName("item");
            if(items.length>0){
                let resourceFileName: string = items[0].getElementsByTagName("file")[0].textContent.trim();
                let resouceFilePath: string = path.join(artifactXmlFilePath, "..", "resources", resourceFileName);
                let destinationFilePath: string = path.join(registryResourcesDirectory, resourceFileName);

                let edit = new WorkspaceEdit();
                edit.createFile(Uri.file(destinationFilePath));
                workspace.applyEdit(edit);

                fse.copySync(resouceFilePath, destinationFilePath);

                //update artifact.xml
                let artifactfilePath: string = path.join(registryResourcesDirectory, "artifact.xml");
                const buf: Buffer = fse.readFileSync(artifactfilePath);
                let artifactXmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
                let artifacts = artifactXmlDoc.getElementsByTagName("artifacts")[0];
                let artifact = artifactXmlDoc.createElement("artifact");
                artifacts.appendChild(artifact);
                artifact.setAttribute("name", name);
                let finalGroupId: string = `${groupId}.${type.split("/")[1]}`;
                artifact.setAttribute("groupId", finalGroupId);
                artifact.setAttribute("version", version);
                artifact.setAttribute("type", type);
                artifact.setAttribute("serverRole", serverRole);
                artifact.appendChild(items[0]);

                fse.writeFileSync(artifactfilePath, new XMLSerializer().serializeToString(artifactXmlDoc));

                //update composite pom.xml
                updateCompositePomXml(compositeDirectory, name, type, serverRole, finalGroupId);
                }
        }
        else if(type === ConnectorInfo.TYPE){//connector

            let connectorFilePath: string = path.join(artifactXmlFilePath, "..", fileName);
            let destinationFilePath: string = path.join(connectorExporterDirectory, fileName);

            let edit = new WorkspaceEdit();
            edit.createFile(Uri.file(destinationFilePath));
            workspace.applyEdit(edit);

            fse.copySync(connectorFilePath, destinationFilePath);

            //update artifact.xml
            let artifactfilePath: string = path.join(connectorExporterDirectory, "artifact.xml");
            const buf: Buffer = fse.readFileSync(artifactfilePath);
            let artifactXmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
            let artifacts = artifactXmlDoc.getElementsByTagName("artifacts")[0];
            let artifact = artifactXmlDoc.createElement("artifact");
            artifacts.appendChild(artifact);
            artifact.setAttribute("name", name);
            let finalGroupId: string = `${groupId}.${type.split("/")[1]}`;
            artifact.setAttribute("groupId", finalGroupId);
            artifact.setAttribute("version", version);
            artifact.setAttribute("type", type);
            artifact.setAttribute("serverRole", serverRole);
            let file = artifactXmlDoc.createElement("file");
            file.textContent = fileName;
            artifact.appendChild(file);

            fse.writeFileSync(artifactfilePath, new XMLSerializer().serializeToString(artifactXmlDoc));

            //update composite pom.xml
            updateCompositePomXml(compositeDirectory, name, type, serverRole, finalGroupId);

        }
        else if(type === DataServiceInfo.TYPE){//data-service

            let dataServiceFilePath: string = path.join(artifactXmlFilePath, "..", fileName);
            let newFileName: string = `${name}.${ArtifactInfo.fileTypes.get(type)}`;
            let dataServiceProjectName: string = `${projectName}DataService`;
            if(!dataServiceProjectCreated){
                DataServiceModule.createProject(dataServiceProjectName, rootDirectory);
                dataServiceProjectCreated = true;
            }

            let destinationFilePath = path.join(rootDirectory, dataServiceProjectName, "dataservice", newFileName);

            let edit = new WorkspaceEdit();
            edit.createFile(Uri.file(destinationFilePath));
            workspace.applyEdit(edit);

            fse.copySync(dataServiceFilePath, destinationFilePath);

            //update artifact.xml
            let artifactfilePath: string = path.join(rootDirectory, dataServiceProjectName, "artifact.xml");
            const buf: Buffer = fse.readFileSync(artifactfilePath);
            let artifactXmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
            let artifacts = artifactXmlDoc.getElementsByTagName("artifacts")[0];
            let artifact = artifactXmlDoc.createElement("artifact");
            artifacts.appendChild(artifact);
            artifact.setAttribute("name", name);
            let finalGroupId: string = `${groupId}.${type.split("/")[1]}`;
            artifact.setAttribute("groupId", finalGroupId);
            artifact.setAttribute("version", version);
            artifact.setAttribute("type", type);
            artifact.setAttribute("serverRole", serverRole);
            let file = artifactXmlDoc.createElement("file");
            file.textContent = newFileName;
            artifact.appendChild(file);

            fse.writeFileSync(artifactfilePath, new XMLSerializer().serializeToString(artifactXmlDoc));

            //update composite pom.xml
            updateCompositePomXml(compositeDirectory, name, type, serverRole, finalGroupId);

        }
        else if(type === MediatorProjectInfo.TYPE){//mediator project

            let jarFilePath: string = path.join(artifactXmlFilePath, "..", fileName);
            let extractDirectory: string = path.join(artifactXmlFilePath, "..", "tmp");
            let decompiledDirectory: string = path.join(extractDirectory, "decompiled");
            let manifestDirectory: string = path.join(decompiledDirectory, "META-INF");
            let manifestFilePath: string = path.join(manifestDirectory, "MANIFEST.MF");

            fernflower(jarFilePath,extractDirectory)
            .then((decompiledDir: any) => {
                //get package name from MANIFEST.MF
                const buf: Buffer = fse.readFileSync(manifestFilePath);
                let manifest = buf.toString();
                let split1: string[] = manifest.split("Export-Package:");
                let split2: string = split1[split1.length - 1];
                let packageName: string = split2.split("DynamicImport-Package:")[0].trim();

                //remove manifest files
                if(fse.existsSync(manifestDirectory)) fse.removeSync(manifestDirectory);

                MediatorProjectModule.createProject(rootDirectory, name, packageName, version, serverRole);
                
                //copy java files
                let destinationDirectory: string = path.join(rootDirectory, name, "src", "main", "java");
                if(fse.existsSync(destinationDirectory)){
                    fse.copySync(decompiledDirectory, destinationDirectory);
                }
            })
            .catch((err: any) => console.log(err.stack));

            //extract .jar file
            /*if(fse.existsSync(jarFilePath)){
                await extract(jarFilePath, { dir: extractDirectory });
            }*/

            //get package name from MANIFEST.MF
            /*const buf: Buffer = fse.readFileSync(manifestFilePath);
            let manifest = buf.toString();
            let split1: string[] = manifest.split("Export-Package:");
            let split2: string = split1[split1.length - 1];
            let packageName: string = split2.split("DynamicImport-Package:")[0].trim();

            //remove manifest files
            if(fse.existsSync(manifestDirectory)) fse.removeSync(manifestDirectory);

            MediatorProjectModule.createProject(rootDirectory, name, packageName, version, serverRole);
            
            //copy java files
            let destinationDirectory: string = path.join(rootDirectory, name, "src", "main", "java");
            if(fse.existsSync(destinationDirectory)){
                fse.copySync(decompiledDirectory, destinationDirectory);
                //window.showWarningMessage("Mediator Projects contain .class files");
            }*/

        }
    }
}

function copySynapseMetadataFiles(metaDataDirectory: string, rootMetadataFilePath: string, artifactName: string, configsDirecrory: string, compositeDirectory:string, 
     groupId: string, destinationFolder: string){

        const metadataBuffer: Buffer = fse.readFileSync(rootMetadataFilePath);
        let metadataXmlDoc = new DOM().parseFromString(metadataBuffer.toString(), "text/xml");
        let artifacts = metadataXmlDoc.getElementsByTagName("artifact");
        if(artifacts.length > 0){
            let dependencyList = artifacts[0].getElementsByTagName("dependency");
            let metadataNameArray: string[] = [`${artifactName}_metadata`, `${artifactName}_swagger`, `${artifactName}_proxy_metadata`];
            let length: number = dependencyList.length;
            for(let i=0; i<length; i++){
                let metadataName: string = dependencyList[i].getAttribute("artifact");
                let metadataVersion: string = dependencyList[i].getAttribute("version");
                let include: string = dependencyList[i].getAttribute("include").trim();
               
                if(include === "true"){
                    let index: number = metadataNameArray.indexOf(metadataName);
                    if(index !== -1){
                        let folderName: string = `${metadataName}_${metadataVersion}`;
                        let artifactFilePath: string = path.join(metaDataDirectory, folderName, "artifact.xml");

                        if(!fse.existsSync(artifactFilePath)) continue;
                
                        const buff: Buffer = fse.readFileSync(artifactFilePath);
                        let xmlDoc = new DOM().parseFromString(buff.toString(), "text/xml");
                        let artifact = xmlDoc.getElementsByTagName("artifact")[0];
                        let name: string = artifact.getAttribute("name").trim();
                        let version: string = artifact.getAttribute("version").trim();
                        let type: string = artifact.getAttribute("type").trim();
                        let serverRole: string = artifact.getAttribute("serverRole").trim();
                        let fileName: string = artifact.getElementsByTagName("file")[0].textContent.trim();
                        let newFileName: string = `${name}.yaml`;
                
                        let metadataFilePath: string = path.join(metaDataDirectory, folderName, fileName);
                        if(!fse.existsSync(metadataFilePath)) continue;
                        let newMetadataFilePath: string = path.join(configsDirecrory, "src", "main", "resources", "metadata", newFileName);
                        let edit = new WorkspaceEdit();
                        edit.createFile(Uri.file(newMetadataFilePath));
                        workspace.applyEdit(edit); 
                        fse.copySync(metadataFilePath, newMetadataFilePath);
                
                         //update artifact.xml
                         let configsArtifactfilePath: string = path.join(configsDirecrory, "artifact.xml");
                         const buf: Buffer = fse.readFileSync(configsArtifactfilePath);
                         let artifactXmlDoc = new DOM().parseFromString(buf.toString(), "text/xml");
                         let parent = artifactXmlDoc.getElementsByTagName("artifacts");
                         let filePath: string = path.join("src", "main", "resources", "metadata", newFileName);
                         ArtifactModule.addSynapseArtifactData(parent, artifactXmlDoc, name, groupId, type, version, serverRole, filePath, destinationFolder);
                         fse.writeFileSync(configsArtifactfilePath, new XMLSerializer().serializeToString(artifactXmlDoc));
                 
                         //update composite pom.xml
                         //add entry to properties
                         let compositePomFilePath : string = path.join(compositeDirectory, "pom.xml");
                         const buffer: Buffer = fse.readFileSync(compositePomFilePath);
                         let pomXmlDoc = new DOM().parseFromString(buffer.toString(), "text/xml");
                         let properties = pomXmlDoc.getElementsByTagName("properties");
                         let finalGroupId: string;
                         if(destinationFolder === ProxyArtifactInfo.PROXY_DESTINATION_FOLDER){
                             finalGroupId = `${groupId}.proxy-service.${type.split("/")[1]}`;
                         }
                         else{
                            finalGroupId = `${groupId}.${type.split("/")[1]}`;
                         }
                         let artifactTagName: string = `${finalGroupId}_._${name}`;
                         ArtifactModule.addNewProperty(pomXmlDoc, artifactTagName, properties, serverRole);
                 
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
                 
                         ArtifactModule.addNewDependancy(pomXmlDoc, dependencies, name, finalGroupId, "yaml");
                         fse.writeFileSync(compositePomFilePath, new XMLSerializer().serializeToString(pomXmlDoc));
                        
                    }
                }

            }
        }

        
    }

    function updateCompositePomXml(compositeDirectory: string, name: string, type: string, serverRole: string, finalGroupId: string){
        //add entry to properties
        let compositePomFilePath : string = path.join(compositeDirectory, "pom.xml");
        const buffer: Buffer = fse.readFileSync(compositePomFilePath);
        let pomXmlDoc = new DOM().parseFromString(buffer.toString(), "text/xml");
        let properties = pomXmlDoc.getElementsByTagName("properties");
        let artifatTagName:string = `${finalGroupId}_._${name}`;
        ArtifactModule.addNewProperty(pomXmlDoc, artifatTagName, properties, serverRole);

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

        ArtifactModule.addNewDependancy(pomXmlDoc, dependencies, name, finalGroupId, ArtifactInfo.fileTypes.get(type));
        fse.writeFileSync(compositePomFilePath, new XMLSerializer().serializeToString(pomXmlDoc));
    }

