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

import {Uri, window, workspace, WorkspaceEdit, WorkspaceFolder, languages, QuickPickItem} from "vscode";
import * as fse from "fs-extra";
import * as path from 'path';
import {showQuickPick} from "../utils/uiUtils";
import { ArtifactModule } from "../artifacts/ArtifactModule";
import { SubDirectories } from "../artifacts/artifactUtils";
import { ServerRoleInfo, ConnectorInfo } from "./connectorUtils";
import { DataServiceModule } from "../dataService/DataServiceModule";
import {XMLSerializer as XMLSerializer} from 'xmldom';

const axios = require('axios').default;
const { DownloaderHelper } = require('node-downloader-helper');
let DOM = require('xmldom').DOMParser;
var file_system = require('fs');

export namespace ConnectorModule {

   const dirName = __dirname;
   
   export function createProject(projectName: string){
        if(workspace.workspaceFolders){
            const currentConnectorExporterDirectory: string = ArtifactModule.getDirectoryFromProjectNature(SubDirectories.CONNECTOR_EXPORTER).trim();
            if(currentConnectorExporterDirectory !== "unidentified"){
                window.showInformationMessage("Can not add more than one connector exporter!");
                return;
            }
            
            let rootDirectory: string = workspace.workspaceFolders[0].uri.fsPath;
            let connectorexporterDirectory: string = path.join(rootDirectory, projectName);
            if(fse.existsSync(connectorexporterDirectory)){
                window.showErrorMessage("Connector exporter name already exists!");
                return;
            }

            fse.mkdirSync(connectorexporterDirectory);
            
            //add artifact.xml, pom.xml and .project
            let templatePomFilePath: string = path.join(dirName, "..", "..", "templates", "pom", "ConnectorExporterPom.xml");
            let templateProjNatureFilePath: string = path.join(dirName, "..", "..", "templates", "Conf", "connectorExporter.xml")
            DataServiceModule.createConfigurationFiles(projectName, connectorexporterDirectory, templateProjNatureFilePath, templatePomFilePath);

            //add ConnectorExporter module to root pom
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
            let connectorModule = rootPomXmlDoc.createElement("module");
            connectorModule.textContent = projectName.trim();

            let append: boolean = false;
           
            for(let i=0; i<totalSubModules; i++){
                let configurationFilePath: string = path.join(rootDirectory, subModules[i].textContent.trim(), '.project');
                let projectNature: string = ArtifactModule.getProjectNature(configurationFilePath).trim();

                if(projectNature === SubDirectories.DATA_SOURCE){
                    rootPomXmlDoc.insertBefore(connectorModule, subModules[i]);
                    append = true;
                    break;
                }
                else if(projectNature === SubDirectories.DATA_SERVICE){
                    rootPomXmlDoc.insertBefore(connectorModule, subModules[i]);
                    append = true;
                    break;
                }
                else if(projectNature === SubDirectories.CONFIGS){
                    rootPomXmlDoc.insertBefore(connectorModule, subModules[i]);
                    append = true;
                    break;
                }
                else if(projectNature === SubDirectories.COMPOSITE_EXPORTER){
                    rootPomXmlDoc.insertBefore(connectorModule, subModules[i]);
                    append = true;
                    break;
                }          
            }

            if(!append) modules.appendChild(connectorModule);

            fse.writeFileSync(rootPomFilePath, new XMLSerializer().serializeToString(rootPomXmlDoc)); 

        }

   }

   export async function getSuggestedConnectors(keyWord: string){

    let suggestions;
    let tmp: QuickPickItem[];
    let downloadLinkMap: Map<string,string>;
    let query: string = `"overview_name":"${keyWord}"`;
    const encodedUri = encodeURI(ConnectorInfo.CONNECTOR_SERVER_URL + ConnectorInfo.CONNECTOR_ASSETS_ES210_SEARCH + query);

    axios.get(encodedUri)
        .then((response: any) =>{
            // handle success
            suggestions = response.data.data;
            if(suggestions.length === 0){
                window.showInformationMessage("No Connectors found...!");
                return;
            }
            [tmp, downloadLinkMap] = createQuickPickList(suggestions);
            
            window.showQuickPick(
                tmp,
                {matchOnDescription: true, placeHolder: "Select a connector..."}
            ).then(selected => {
                if(selected && downloadLinkMap.has(selected.label.trim())) {
                    let downloadLink: string =  downloadLinkMap.get(selected.label.trim())!;
                    console.log(downloadLink);
                    downloadConnector(downloadLink, selected.label.trim(), selected.description!.trim());
                }
                else{
                    window.showErrorMessage("Can not download the connector...!");
                }
            });
        })
        .catch((error: any) =>{
            // handle error
            window.showErrorMessage(error);
        });

   }

   function createQuickPickList(connectorList: any[]): [QuickPickItem[], Map<string,string>]{
        let suggestedConnectors:QuickPickItem[] = [];
        let downloadLinkMap: Map<string,string> = new Map();
        connectorList.forEach( (element: any, index: number) => {
            let connector: QuickPickItem = {
                label: element.name,
                description: element.version
                
            }
            suggestedConnectors[index] = connector;
            let downloadLink: string | undefined = element.attributes.overview_downloadlink;
            if(downloadLink !== undefined){
                downloadLinkMap.set(element.name.trim(), downloadLink.trim());
            }
            
        });
        return [suggestedConnectors, downloadLinkMap];
   }

   function downloadConnector(downloadLink: string, connectorName: string, version: string){
        const connectorExporterFilePath: string = ArtifactModule.getDirectoryFromProjectNature(SubDirectories.CONNECTOR_EXPORTER).trim();
        if(connectorExporterFilePath.trim() !== "unidentified"){
            let urlSplit: string[] = downloadLink.split("/");
            let connectorFileName: string = urlSplit[urlSplit.length - 1].trim();

            if(fse.existsSync(path.join(connectorExporterFilePath, connectorFileName))){
                window.showErrorMessage(`${connectorName} already exists`);
                return;
            }

            const downloadHelper = new DownloaderHelper(downloadLink, connectorExporterFilePath);
            downloadHelper.on('end', () => {
                window.showInformationMessage(`${connectorName} downloaded Successfully`);
                //update artifact.xml and composite pom.xml
                updateConfigurationFiles(connectorFileName, version);
            })
            downloadHelper.start();
        } 
        
   }

   function updateConfigurationFiles(connectorFileName: string, version: string){

        if(workspace.workspaceFolders){

            let tmp = connectorFileName.split("-");
            tmp.pop();
            let connectorName: string = tmp.join("-");
            console.log(`downloadingConnector: ${connectorName}`);

            const connectorExporterFilePath: string = ArtifactModule.getDirectoryFromProjectNature(SubDirectories.CONNECTOR_EXPORTER);
            //update artifact.xml
            let artifactXmlFilePath: string = path.join(connectorExporterFilePath, "artifact.xml");
                    
            const buff: Buffer = fse.readFileSync(artifactXmlFilePath);
            let artifactXmlDoc = new DOM().parseFromString(buff.toString(), "text/xml");
            let artifacts = artifactXmlDoc.getElementsByTagName("artifacts");

            let rootDirectory: string = workspace.workspaceFolders[0].uri.fsPath;
            let rootPomFilePath: string = path.join(rootDirectory, "pom.xml");
            let project: ArtifactModule.Project = ArtifactModule.getProjectInfoFromPOM(rootPomFilePath);
            let groupId: string = project.groupId!;

            ArtifactModule.addSynapseArtifactData(artifacts, artifactXmlDoc, connectorName, groupId, ConnectorInfo.TYPE, version, 
                        ServerRoleInfo.ENTERPRISE_SERVICE_BUS, connectorFileName, ConnectorInfo.DESTINATION_FOLDER);
            fse.writeFileSync(artifactXmlFilePath, new XMLSerializer().serializeToString(artifactXmlDoc));

            //update composite pom
            let compositePomFilePath: string = path.join(ArtifactModule.getDirectoryFromProjectNature(SubDirectories.COMPOSITE_EXPORTER), "pom.xml");
            const pomBuff: Buffer = fse.readFileSync(compositePomFilePath);
            let pomXmlDoc = new DOM().parseFromString(pomBuff.toString(), "text/xml");

            //add new property
            let tagName: string = groupId + "." + ConnectorInfo.DATA_SERVICE_LABEL + "_._" + connectorName;
            let properties = pomXmlDoc.getElementsByTagName("properties");
            ArtifactModule.addNewProperty(pomXmlDoc, tagName, properties, ServerRoleInfo.ENTERPRISE_SERVICE_BUS);

            //add new dependancy
            let dependencies = pomXmlDoc.getElementsByTagName("dependencies");
            let finalGroupId: string = groupId + "." + ConnectorInfo.DATA_SERVICE_LABEL;
            ArtifactModule.addNewDependancy(pomXmlDoc, dependencies, connectorName, finalGroupId, "zip", version);
            fse.writeFileSync(compositePomFilePath, new XMLSerializer().serializeToString(pomXmlDoc));

        }
   }

   export function safeDeleteConnector(deletedFile: string){
       
        let array: string[] = deletedFile.split(path.sep);
        let deletedConnectorFileName: string = array[array.length - 1];
        
        let fileNameSplit: string[] = deletedConnectorFileName.split(".");
        let length: number = fileNameSplit.length;
        let fileExtension: string = fileNameSplit[length - 1];
        console.log(`file extension: ${fileExtension}`);
        let tmp = deletedConnectorFileName.split("-");
        tmp.pop();
        let connectorName: string = tmp.join("-");
        console.log(`connector name ${connectorName}`);

        if (workspace.workspaceFolders && (fileExtension === "zip")) {

            let artifactXmlFilePath: string = path.join(deletedFile, "..", "artifact.xml");
            console.log(`filePath: ${artifactXmlFilePath}`);
            
            ArtifactModule.deletefromArtifactXml(artifactXmlFilePath, connectorName.trim());
            ArtifactModule.deleteArtifactFromPomXml(connectorName.trim(), ConnectorInfo.DESTINATION_FOLDER);

        }
   }
    
}