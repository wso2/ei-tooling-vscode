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

import {window, QuickPickItem, ProgressLocation} from "vscode";
import * as fse from "fs-extra";
import * as path from 'path';
import { ProjectNatures, SubDirectories } from "../artifacts/artifactUtils";
import { ServerRoleInfo, ConnectorInfo } from "./connectorUtils";
import {XMLSerializer as XMLSerializer} from 'xmldom';
import { Utils } from "../utils/Utils";

const axios = require('axios').default;
const { DownloaderHelper } = require('node-downloader-helper');
let DOM = require('xmldom').DOMParser;

export namespace ConnectorModule {

   const dirName = __dirname;
   
   export function createNewConnectorExporter(rootDirectory: string, projectName: string){
            let templatePomFilePath: string = path.join(dirName, "..", "..", "templates", "pom", "ConnectorExporterPom.xml");
            let templateProjNatureFilePath: string = path.join(dirName, "..", "..", "templates", "Conf", "connectorExporter.xml")
            Utils.createProject(projectName.trim(), "connector exporter", templatePomFilePath,
                            templateProjNatureFilePath, SubDirectories.CONNECTOR_EXPORTER,true, rootDirectory, ProjectNatures.CONNECTOR_EXPORTER);
   }

   //add ConnectorExporter module to root pom
   export function addConnectorExporterToRootPom(rootDirectory: string, projectName: string){
       
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
           let projectNature: string = Utils.getDirectoryType(configurationFilePath).trim();

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

   export async function getSuggestedConnectors(keyWord: string, rootDirectory: string){

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
                    downloadConnector(downloadLink, selected.label.trim(), selected.description!.trim(), rootDirectory);
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

   function downloadConnector(downloadLink: string, connectorName: string, version: string, rootDirectory: string){
        const connectorExporterFilePath: string = Utils.getDirectoryFromDirectoryType(SubDirectories.CONNECTOR_EXPORTER, rootDirectory).trim();
        if(connectorExporterFilePath.trim() !== "unidentified"){
            let urlSplit: string[] = downloadLink.split("/");
            let connectorFileName: string = urlSplit[urlSplit.length - 1].trim();

            if(fse.existsSync(path.join(connectorExporterFilePath, connectorFileName))){
                window.showErrorMessage(`${connectorName} already exists`);
                return;
            }

            const downloadHelper = new DownloaderHelper(downloadLink, connectorExporterFilePath);
            downloadHelper.on('end', () => {
                //update artifact.xml and composite pom.xml
                updateConfigurationFiles(connectorFileName, version, rootDirectory);
                window.showInformationMessage(`${connectorName} downloaded Successfully`);
            });

            window.withProgress({
                location: ProgressLocation.Notification,
                title: "Downloading the Connector..",
                cancellable: true
                }, async (progress) => {
                    progress.report({  increment: 0 });
                    await downloadHelper.start();
                    progress.report({ increment: 100 });
                }
            );
        } 
        
   }

   function updateConfigurationFiles(connectorFileName: string, version: string, rootDirectory: string){

            let nameSplit = connectorFileName.split("-");
            nameSplit.pop();
            let connectorName: string = nameSplit.join("-");

            const connectorExporterFilePath: string = Utils.getDirectoryFromDirectoryType(SubDirectories.CONNECTOR_EXPORTER, rootDirectory);
            //update artifact.xml
            let artifactXmlFilePath: string = path.join(connectorExporterFilePath, "artifact.xml");
            let rootPomFilePath: string = path.join(rootDirectory, "pom.xml");
            let project: Utils.Project = Utils.getProjectInfoFromPOM(rootPomFilePath);
            let groupId: string = project.groupId!;
            let finalGroupId: string = `${groupId}.${ConnectorInfo.TYPE.split("/")[1]}`;

            Utils.addArtifactToArtifactXml(artifactXmlFilePath, connectorName, finalGroupId, version, ConnectorInfo.TYPE, 
                                                    ServerRoleInfo.ENTERPRISE_SERVICE_BUS, connectorFileName, undefined,
                                                    undefined, undefined);

            //update composite pom
            let compositePomFilePath: string = path.join(Utils.getDirectoryFromDirectoryType(SubDirectories.COMPOSITE_EXPORTER,
                rootDirectory), "pom.xml");
            Utils.updateCompositePomXml(compositePomFilePath, connectorName, ConnectorInfo.TYPE,
                                        ServerRoleInfo.ENTERPRISE_SERVICE_BUS, finalGroupId);
   }

   export function safeDeleteConnector(deletedFile: string, rootDirectory: string){
       
        let array: string[] = deletedFile.split(path.sep);
        let deletedConnectorFileName: string = array[array.length - 1];
        
        let fileNameSplit: string[] = deletedConnectorFileName.split(".");
        let length: number = fileNameSplit.length;
        let fileExtension: string = fileNameSplit[length - 1];
        let nameSplit = deletedConnectorFileName.split("-");
        nameSplit.pop();
        let connectorName: string = nameSplit.join("-");

        if (fileExtension === "zip") {

            let artifactXmlFilePath: string = path.join(deletedFile, "..", "artifact.xml");
            Utils.deletefromArtifactXml(artifactXmlFilePath, connectorName.trim());
            Utils.deleteArtifactFromPomXml(connectorName.trim(), ConnectorInfo.DESTINATION_FOLDER, rootDirectory);

        }
   }
    
}