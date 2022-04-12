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

import {Uri, window, workspace, WorkspaceEdit, WorkspaceFolder, languages} from "vscode";
import * as fse from "fs-extra";
import * as path from 'path';
import {ServerRoleInfo, DataServiceInfo} from "./dataServiceUtils";
import {XMLSerializer as XMLSerializer} from 'xmldom';
import {ArtifactModule} from "../artifacts/ArtifactModule";
import { dir } from "console";
import { version } from "process";
import { SubDirectories } from "../artifacts/artifactUtils";
import {SYNAPSE_LANGUAGE_ID, SYNAPSE_NAMESPACE} from "../language/languageUtils";

let DOM = require('xmldom').DOMParser;
let glob = require("glob");
const YAML = require("js-yaml");
var file_system = require('fs');
var filewatcher = require('filewatcher');

export namespace DataServiceModule {

    const dirName = __dirname;

    export async function createProject(projectName: string) {
        if (workspace.workspaceFolders) {

            //check whether data service project already exists
            let rootDirectory: string = workspace.workspaceFolders[0].uri.fsPath;
            let dSConfigsDirectory: string = path.join(rootDirectory, projectName);
            if(fse.existsSync(dSConfigsDirectory)){
                window.showErrorMessage("Data Service project name already exists!");
                return;
            }
            
            let dSConfigsSubDirectory: string = path.join(dSConfigsDirectory, "dataservice");
            fse.mkdirSync(dSConfigsDirectory);
            fse.mkdirSync(dSConfigsSubDirectory);

            let rootPomFilePath: string = path.join(rootDirectory, "pom.xml");
            let dsPomFilePath: string = path.join(dSConfigsDirectory, "pom.xml");
            let project: ArtifactModule.Project = await ArtifactModule.getProjectInfoFromPOM(rootPomFilePath);

            //add new pom.xml
            let templatePomFilePath: string = path.join(dirName, "..", "..", "templates", "pom", "DataServiceConfigsPom.xml");
            const buff: Buffer = fse.readFileSync(templatePomFilePath);
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

            createFile(dsPomFilePath, pomXmlDoc);

            //add new .project file
            //read template file
            let templateProjNatureFilePath: string = path.join(dirName, "..", "..", "templates", "Conf", "dataService.xml");
            const buf: Buffer = fse.readFileSync(templateProjNatureFilePath);
            let projectNature  = new DOM().parseFromString(buf.toString(), "text/xml");

            let name = projectNature.getElementsByTagName("name")[0];
            name.textContent = projectName.trim(); 

            let projectNatureFilePath: string = path.join(dSConfigsDirectory, ".project");
            createFile(projectNatureFilePath,projectNature);

            //create new artifact.xml
            //read template file
            let templateArtifactFilePath: string = path.join(dirName, "..", "..", "templates", "Conf", "artifact.xml");
            const buffer: Buffer = fse.readFileSync(templateArtifactFilePath);
            let artifacts  = new DOM().parseFromString(buffer.toString(), "text/xml");

            let artifactFilePath: string = path.join(dSConfigsDirectory, "artifact.xml");
            createFile(artifactFilePath,artifacts);

            //add dataservice module to root pom
            const rootPomBuffer: Buffer = fse.readFileSync(rootPomFilePath);
            let rootPomXmlDoc = new DOM().parseFromString(rootPomBuffer.toString(), "text/xml");
            let modules = rootPomXmlDoc.getElementsByTagName("modules")[0];
            let subModules = rootPomXmlDoc.getElementsByTagName("module");
            let totalSubModules: number = subModules.length;
            let dsModule = rootPomXmlDoc.createElement("module");
            dsModule.textContent = projectName.trim();

            let append: boolean = false;
           
            for(let i=0; i<totalSubModules; i++){
                let configurationFilePath: string = path.join(rootDirectory, subModules[i].textContent.trim(), '.project');
                let projectNature: string = ArtifactModule.getProjectNature(configurationFilePath);

                if(projectNature === SubDirectories.CONFIGS){
                    rootPomXmlDoc.insertBefore(dsModule, subModules[i]);
                    append = true;
                    break;
                }
                else if(projectNature === SubDirectories.COMPOSITE_EXPORTER){
                    rootPomXmlDoc.insertBefore(dsModule, subModules[i]);
                    append = true;
                    break;
                }    
            }

            if(!append) modules.appendChild(dsModule);

            fse.writeFileSync(rootPomFilePath, new XMLSerializer().serializeToString(rootPomXmlDoc));

            
        }
    }

    export function createFile(filePath: string, data: any): Uri{
        let fileUri:Uri = Uri.file(filePath);
        let edit = new WorkspaceEdit();
        edit.createFile(fileUri);
        workspace.applyEdit(edit);
        fse.writeFileSync(fileUri.fsPath, new XMLSerializer().serializeToString(data));

        return fileUri;

    }

    export function safeDeteteProject(subDirectory: string){
        if(workspace.workspaceFolders){
            let rootPomFilePath: string = path.join(workspace.workspaceFolders[0].uri.fsPath, "pom.xml");
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



            //delete child project data, if there are any
            const pathToPomXml:string = path.join(ArtifactModule.getDirectoryFromProjectNature(SubDirectories.COMPOSITE_EXPORTER), "pom.xml");
            let buff: Buffer = fse.readFileSync(pathToPomXml);
            let pomXmlDoc = new DOM().parseFromString(buff.toString(), "text/xml")
            let dependencies = pomXmlDoc.getElementsByTagName("dependencies");
            let dependencyList = dependencies[0].getElementsByTagName("dependency");
            let listLength: number = dependencyList.length;
            for(let i=0; i<listLength; i++){
                
                if(dependencyList[i].getElementsByTagName("type")[0].textContent.trim() === "dbs"){

                    let artifactName: string = dependencyList[i].getElementsByTagName("artifact")[0].textContent.trim();

                    let pattern = path.join("dataservice", artifactName + ".dbs");

                    let cwd: string = workspace.workspaceFolders[0].uri.fsPath;

                    let newGlob = new glob(pattern, {cwd: cwd}, async function (err: any, files: any) {
                
                        if (files.length > 0) {
                            // file name already exists in the project.
                            //remove from dependencies
                            dependencies.removeChild(dependencyList[i]);
                        } 
                    });
                    }
            
            
        }
    }
    }

    export async function createService(subDirectoryPath: string, dataServiceName: string){

        if(workspace.workspaceFolders){

            //create .dbs file
            let dSFilePath: string = path.join(subDirectoryPath, dataServiceName + ".dbs");
            if(fse.existsSync(dSFilePath)){
                window.showErrorMessage("Data Service name already exists!");
                return;
            }
            let dSTemplateFilePath: string = path.join(dirName, "..", "..", "templates", "data-services", "dataService.xml");
            const buffer: Buffer = fse.readFileSync(dSTemplateFilePath);
            let dataService = new DOM().parseFromString(buffer.toString(), "text/xml");
            let data = dataService.getElementsByTagName("data")[0];
            data.setAttribute("name", dataServiceName);
            let fileUri: Uri=  createFile(dSFilePath, dataService);

             // Open and show newly created artifact document in the editor.
            workspace.openTextDocument(fileUri).then(doc => window.showTextDocument(doc));

            //update artifact.xml
            let artifactXmlFilePath: string = path.join(subDirectoryPath, "..", "artifact.xml");
            
            const buff: Buffer = fse.readFileSync(artifactXmlFilePath);
            let artifactXmlDoc = new DOM().parseFromString(buff.toString(), "text/xml");
            let artifacts = artifactXmlDoc.getElementsByTagName("artifacts");

            let rootDirectory: string = workspace.workspaceFolders[0].uri.fsPath;
            let rootPomFilePath: string = path.join(rootDirectory, "pom.xml");
            let project: ArtifactModule.Project = await ArtifactModule.getProjectInfoFromPOM(rootPomFilePath);
            let groupId: string = project.groupId!;
            let file: string = path.join(DataServiceInfo.DATA_SERVICE_LABEL, dataServiceName + ".dbs");

            ArtifactModule.addSynapseArtifactData(artifacts, artifactXmlDoc, dataServiceName, groupId, DataServiceInfo.TYPE, "1.0.0", 
                        ServerRoleInfo.DATA_SERVICES_SERVER, file, DataServiceInfo.DESTINATION_FOLDER);
            fse.writeFileSync(artifactXmlFilePath, new XMLSerializer().serializeToString(artifactXmlDoc));

            //update composite pom
            let compositePomFilePath: string = path.join(ArtifactModule.getDirectoryFromProjectNature(SubDirectories.COMPOSITE_EXPORTER), "pom.xml");
            const pomBuff: Buffer = fse.readFileSync(compositePomFilePath);
            let pomXmlDoc = new DOM().parseFromString(pomBuff.toString(), "text/xml");

            //add new property
            let tagName: string = groupId + "." + DataServiceInfo.DATA_SERVICE_LABEL + "_._" + dataServiceName;
            let properties = pomXmlDoc.getElementsByTagName("properties");
            ArtifactModule.addNewProperty(pomXmlDoc, tagName, properties, ServerRoleInfo.DATA_SERVICES_SERVER);

            //add new dependancy
            let dependencies = pomXmlDoc.getElementsByTagName("dependencies");
            let finalGroupId: string = groupId + "." + DataServiceInfo.DATA_SERVICE_LABEL;
            ArtifactModule.addNewDependancy(pomXmlDoc, dependencies, dataServiceName, finalGroupId, "dbs");
            fse.writeFileSync(compositePomFilePath, new XMLSerializer().serializeToString(pomXmlDoc));

            
            
               

        }
    }

    export function safeDeleteDataService(deletedFile: string){

        
        let array: string[] = deletedFile.split(path.sep);
        let deletedDataService: string = array[array.length - 1];
        let dataServiceFolder: string = array[array.length - 2];
        let rawDataServiceName: string[] = deletedDataService.split(".");

        if (workspace.workspaceFolders) {

            // Check if the deleted file is a .dbs file
            if(rawDataServiceName[1].trim() === "dbs"){
                let artifactXmlFilePath: string = path.join(deletedFile, "..", "..", "artifact.xml");
                ArtifactModule.deletefromArtifactXml(artifactXmlFilePath, rawDataServiceName[0].trim());
                ArtifactModule.deleteArtifactFromPomXml(rawDataServiceName[0].trim(), dataServiceFolder);

            }


        }
    }

    
}