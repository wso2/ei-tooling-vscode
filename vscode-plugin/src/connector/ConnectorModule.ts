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

import * as fse from "fs-extra";
import * as path from 'path';
import { ProgressLocation, QuickPickItem, window, WorkspaceEdit, Uri, workspace } from "vscode";
import { XMLSerializer } from 'xmldom';
import { ProjectNatures, SubDirectories, ESBArtifactPath, Common } from "../artifacts/artifactUtils";
import { Utils } from "../utils/Utils";
import { ConnectorInfo, ServerRoleInfo } from "./connectorUtils";

const axios = require('axios').default;
const { DownloaderHelper } = require('node-downloader-helper');
let DOM = require('xmldom').DOMParser;

export namespace ConnectorModule {

    const POM = Common.POM;
    const CONF = Common.CONF;
    const TEMPLATES = Common.TEMPLATES;
    const POM_FILE = Common.POM_FILE;
    const ARTIFACT_FILE = Common.ARTIFACT_FILE;
    const MODULE = Common.MODULE;
    const MODULES = Common.MODULES;

    /**
    * Add new connector exporter to the workspace.
    */
    export async function createNewConnectorExporter(rootDirectory: string, projectName: string) {
        let templatePomFilePath: string = path.join(__dirname, "..", "..", TEMPLATES, POM, "ConnectorExporterPom.xml");
        let templateProjNatureFilePath: string = path.join(__dirname, "..", "..", TEMPLATES, CONF, "connectorExporter.xml")
        await Utils.createProject(projectName.trim(), "connector exporter", templatePomFilePath,
            templateProjNatureFilePath, SubDirectories.CONNECTOR_EXPORTER, true, rootDirectory, ProjectNatures.CONNECTOR_EXPORTER);
    }

    /**
    * Add ConnectorExporter module to root pom.
    */
    export function addConnectorExporterToRootPom(rootDirectory: string, projectName: string) {

        let rootPomFilePath: string = path.join(rootDirectory, POM_FILE);
        if (!fse.existsSync(rootPomFilePath)) {
            window.showErrorMessage("No root pom.xml found...!");
            return;
        }
        const rootPomBuffer: Buffer = fse.readFileSync(rootPomFilePath);
        let rootPomXmlDoc = new DOM().parseFromString(rootPomBuffer.toString(), "text/xml");
        let modules = rootPomXmlDoc.getElementsByTagName(MODULES)[0];
        let subModules = rootPomXmlDoc.getElementsByTagName(MODULE);
        let totalSubModules: number = subModules.length;
        let connectorModule = rootPomXmlDoc.createElement(MODULE);
        connectorModule.textContent = projectName.trim();

        let append: boolean = false;

        for (let i = 0; i < totalSubModules; i++) {
            let configurationFilePath: string = path.join(rootDirectory, subModules[i].textContent.trim(), POM_FILE);
            let projectNature: string = Utils.getDirectoryType(configurationFilePath).trim();

            if (projectNature === SubDirectories.DATA_SOURCE) {
                rootPomXmlDoc.insertBefore(connectorModule, subModules[i]);
                append = true;
                break;
            }
            else if (projectNature === SubDirectories.DATA_SERVICE) {
                rootPomXmlDoc.insertBefore(connectorModule, subModules[i]);
                append = true;
                break;
            }
            else if (projectNature === SubDirectories.CONFIGS) {
                rootPomXmlDoc.insertBefore(connectorModule, subModules[i]);
                append = true;
                break;
            }
            else if (projectNature === SubDirectories.COMPOSITE_EXPORTER) {
                rootPomXmlDoc.insertBefore(connectorModule, subModules[i]);
                append = true;
                break;
            }
        }

        if (!append) modules.appendChild(connectorModule);

        fse.writeFileSync(rootPomFilePath, new XMLSerializer().serializeToString(rootPomXmlDoc));
    }

    /**
    * Get suggested connector based on a keyword.
    */
    export async function getSuggestedConnectors(keyWord: string, rootDirectory: string) {

        let suggestions;
        let connectorList: QuickPickItem[];
        let downloadLinkMap: Map<string, string>;
        let query: string = `"overview_name":"${keyWord}"`;
        const encodedUri = encodeURI(ConnectorInfo.CONNECTOR_SERVER_URL + ConnectorInfo.CONNECTOR_ASSETS_ES210_SEARCH + query);

        axios.get(encodedUri).then((response: any) => {
            // handle success
            suggestions = response.data.data;
            if (suggestions.length === 0) {
                window.showInformationMessage("No Connectors found...!");
                return;
            }
            [connectorList, downloadLinkMap] = createQuickPickList(suggestions);

            window.showQuickPick(connectorList, { matchOnDescription: true, placeHolder: "Select a connector..." })
                .then(selected => {
                    if (selected && downloadLinkMap.has(selected.label.trim())) {
                        let downloadLink: string = downloadLinkMap.get(selected.label.trim())!;
                        downloadConnector(downloadLink, selected.label.trim(), selected.description!.trim(), rootDirectory);
                    }
                    else {
                        window.showErrorMessage("Can not download the connector...!");
                    }
                });
        })
            .catch((error: any) => {
                // handle error
                window.showErrorMessage(error);
            });
    }

    /**
     * Create QuickPickItem list with connectors to dispay to the user.
     */
    function createQuickPickList(connectorList: any[]): [QuickPickItem[], Map<string, string>] {
        let suggestedConnectors: QuickPickItem[] = [];
        let downloadLinkMap: Map<string, string> = new Map();
        connectorList.forEach((element: any, index: number) => {
            let connector: QuickPickItem = {
                label: element.name,
                description: element.version
            }
            suggestedConnectors[index] = connector;
            let downloadLink: string | undefined = element.attributes.overview_downloadlink;
            if (typeof downloadLink !== "undefined") {
                downloadLinkMap.set(element.name.trim(), downloadLink.trim());
            }
        });
        return [suggestedConnectors, downloadLinkMap];
    }

    /**
     * Download and add a connector to the connector exporter project.
     */
    function downloadConnector(downloadLink: string, connectorName: string, version: string, rootDirectory: string) {
        const connectorExporterFilePath: string = Utils.getDirectoryFromDirectoryType(SubDirectories.CONNECTOR_EXPORTER, rootDirectory).trim();
        if (connectorExporterFilePath.trim() === "unidentified") {
            window.showErrorMessage("No Connector Exporter project found, download aborted");
        }
        else {
            let urlSplit: string[] = downloadLink.split("/");
            let connectorFileName: string = urlSplit[urlSplit.length - 1].trim();
            let connectorFilePath: string = path.join(connectorExporterFilePath, connectorFileName);

            if (fse.existsSync(connectorFilePath)) {
                window.showErrorMessage(`${connectorName} already exists`);
                return;
            }

            const downloadHelper = new DownloaderHelper(downloadLink, connectorExporterFilePath);
            downloadHelper.on('end', () => {
                //update artifact.xml and composite pom.xml
                let status: boolean = updateConfigurationFiles(connectorFileName, version, rootDirectory);
                if (!status) {
                    fse.removeSync(connectorFilePath);
                    window.showErrorMessage("artifact.xml or composite pom.xml is missing, downloaded connector deleted...");
                    return;
                }
                window.showInformationMessage(`${connectorName} downloaded Successfully`);
            });
            downloadHelper.on('error', (err: any) => console.log('Connector download Failed', err));

            window.withProgress({
                location: ProgressLocation.Notification,
                title: "Downloading the Connector..",
                cancellable: true
            }, async (progress) => {
                progress.report({ increment: 0 });
                await downloadHelper.start();
                progress.report({ increment: 100 });
            }
            );
        }

    }

    /**
     * Add a connector from file system.
     */
    export function importConnectorFromFileSystem(connectorLocation: string, rootDirectory: string){

        const connectorExporterFilePath: string = Utils.getDirectoryFromDirectoryType(SubDirectories.CONNECTOR_EXPORTER, rootDirectory).trim();
        if (connectorExporterFilePath === "unidentified") {
            window.showErrorMessage("No Connector Exporter project found, importing connector aborted");
            return;
        }

        let pathArray: string[] = connectorLocation.split(path.sep);
        let connectorFileName: string = pathArray[pathArray.length - 1];
        let targetConnectorFilePath: string = path.join(connectorExporterFilePath, connectorFileName);
        if(fse.existsSync(targetConnectorFilePath)){
            window.showErrorMessage("Connector already exists in the project");
            return;
        }

        let connectorName: string = connectorFileName.split(".zip")[0];
        let nameArray: string[] = connectorName.split("-");
        let version: string = nameArray[nameArray.length - 1];
        
        //copy the connector
        let edit = new WorkspaceEdit();
        edit.createFile(Uri.file(targetConnectorFilePath));
        workspace.applyEdit(edit);
        fse.copySync(connectorLocation, targetConnectorFilePath);

        let status: boolean = updateConfigurationFiles(connectorFileName, version, rootDirectory);

        if (!status) {
            fse.removeSync(targetConnectorFilePath);
            window.showErrorMessage("artifact.xml or composite pom.xml is missing, imported connector deleted...");
            return;
        }
        window.showInformationMessage(`${connectorName} imported Successfully`);

    }

    /**
     * Update artifact.xml and composite pom.xml.
     */
    function updateConfigurationFiles(connectorFileName: string, version: string, rootDirectory: string): boolean {

        //downloaded connector name --> {connectorName-version}
        //get the name of the connector
        let nameArray = connectorFileName.split("-");
        nameArray.pop();
        let connectorName: string = nameArray.join("-");

        const connectorExporterFilePath: string = Utils.getDirectoryFromDirectoryType(SubDirectories.CONNECTOR_EXPORTER, rootDirectory);
        const compositePomFilePath: string = path.join(Utils.getDirectoryFromDirectoryType(SubDirectories.COMPOSITE_EXPORTER, rootDirectory), POM_FILE);
        let artifactXmlFilePath: string = path.join(connectorExporterFilePath, ARTIFACT_FILE);
        if ((!fse.existsSync(compositePomFilePath)) || (!fse.existsSync(artifactXmlFilePath))) return false;

        //update artifact.xml
        let rootPomFilePath: string = path.join(rootDirectory, POM_FILE);
        let project: Utils.Project = Utils.getProjectInfoFromPOM(rootPomFilePath);
        let groupId: string = project.groupId!;
        let finalGroupId: string = `${groupId}.${ConnectorInfo.TYPE.split("/")[1]}`;

        Utils.addArtifactToArtifactXml(artifactXmlFilePath, connectorName, finalGroupId, version, ConnectorInfo.TYPE,
            ServerRoleInfo.ENTERPRISE_SERVICE_BUS, connectorFileName, undefined,
            undefined, undefined);

        //update composite pom
        let compositeDirectory: string = Utils.getDirectoryFromDirectoryType(SubDirectories.COMPOSITE_EXPORTER, rootDirectory);
        Utils.updateCompositePomXml(compositeDirectory, connectorName, ConnectorInfo.TYPE,
            ServerRoleInfo.ENTERPRISE_SERVICE_BUS, finalGroupId, version);

        return true;
    }

    /**
     * Delete connector related information from artifact.xml and composite pom.xml.
     */
    export function safeDeleteConnector(deletedFile: string, rootDirectory: string) {

        let array: string[] = deletedFile.split(path.sep);
        let deletedConnectorFileName: string = array[array.length - 1];

        let fileNameSplit: string[] = deletedConnectorFileName.split(".");
        let length: number = fileNameSplit.length;
        let fileExtension: string = fileNameSplit[length - 1];
        let nameArray = deletedConnectorFileName.split("-");
        nameArray.pop();
        let connectorName: string = nameArray.join("-");

        if (fileExtension === "zip") {

            let artifactXmlFilePath: string = path.join(deletedFile, "..", ARTIFACT_FILE);
            Utils.deletefromArtifactXml(artifactXmlFilePath, connectorName.trim());
            Utils.deleteArtifactFromPomXml(connectorName.trim(), ConnectorInfo.DESTINATION_FOLDER, rootDirectory,undefined, undefined);

        }
    }

}
