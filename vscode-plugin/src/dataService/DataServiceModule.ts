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

import { Uri, window, workspace } from "vscode";
import * as fse from "fs-extra";
import * as path from 'path';
import { ServerRoleInfo, DataServiceInfo } from "./dataServiceUtils";
import { XMLSerializer as XMLSerializer } from 'xmldom';
import { SubDirectories, Common } from "../artifacts/artifactUtils";
import { Utils } from "../utils/Utils";

let DOM = require('xmldom').DOMParser;
var file_system = require('fs');

export namespace DataServiceModule {

    const dirName = __dirname;
    const POM = Common.POM;
    const CONF = Common.CONF;
    const TEMPLATES = Common.TEMPLATES;
    const POM_FILE = Common.POM_FILE;
    const ARTIFACT_FILE = Common.ARTIFACT_FILE;
    const MODULE = Common.MODULE;
    const MODULES = Common.MODULES;
    const PROJECT_FILE = Common.PROJECT_FILE;
    const VERSION = Common.VERSION;

    export async function createProject(projectName: string, rootDirectory: string) {

        //check whether data service project already exists
        let dSConfigsDirectory: string = path.join(rootDirectory, projectName);
        if (fse.existsSync(dSConfigsDirectory)) {
            window.showErrorMessage("Data Service project name already exists!");
            return;
        }

        let dSConfigsSubDirectory: string = path.join(dSConfigsDirectory, "dataservice");
        file_system.mkdirSync(dSConfigsSubDirectory, { recursive: true });

        //create artifact.xml, pom.xml and .project
        let templatePomFilePath: string = path.join(dirName, "..", "..", TEMPLATES, POM, "DataServiceConfigsPom.xml");
        let templateProjNatureFilePath: string = path.join(dirName, "..", "..", TEMPLATES, CONF, "dataService.xml")
        Utils.createConfigurationFiles(projectName, dSConfigsDirectory, templateProjNatureFilePath, templatePomFilePath, true);

        //add dataservice module to root pom
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
        let dsModule = rootPomXmlDoc.createElement(MODULE);
        dsModule.textContent = projectName.trim();

        let append: boolean = false;

        for (let i = 0; i < totalSubModules; i++) {
            let configurationFilePath: string = path.join(rootDirectory, subModules[i].textContent.trim(), PROJECT_FILE);
            let projectNature: string = Utils.getDirectoryType(configurationFilePath);

            if (projectNature === SubDirectories.CONFIGS) {
                rootPomXmlDoc.insertBefore(dsModule, subModules[i]);
                append = true;
                break;
            }
            else if (projectNature === SubDirectories.COMPOSITE_EXPORTER) {
                rootPomXmlDoc.insertBefore(dsModule, subModules[i]);
                append = true;
                break;
            }
        }

        if (!append) modules.appendChild(dsModule);

        fse.writeFileSync(rootPomFilePath, new XMLSerializer().serializeToString(rootPomXmlDoc));
    }

    /**
    * Create a data service file.
    */
    export async function createService(subDirectoryPath: string, dataServiceName: string) {

        if (workspace.workspaceFolders) {

            //check for artifact.xml and composite pom.xml
            let rootDirectory: string = workspace.workspaceFolders[0].uri.fsPath;
            let artifactXmlFilePath: string = path.join(subDirectoryPath, "..", ARTIFACT_FILE);
            let compositePomFilePath: string = path.join(Utils.getDirectoryFromDirectoryType(SubDirectories.COMPOSITE_EXPORTER, rootDirectory), POM_FILE);
            if ((!fse.existsSync(artifactXmlFilePath)) || (!fse.existsSync(compositePomFilePath))) {
                window.showErrorMessage("artifact.xml or composite pom.xml is missing, data service creation aborted...");
                return;
            }

            //create .dbs file
            let dSFilePath: string = path.join(subDirectoryPath, dataServiceName + ".dbs");
            if (fse.existsSync(dSFilePath)) {
                window.showErrorMessage("Data Service name already exists!");
                return;
            }
            let dSTemplateFilePath: string = path.join(dirName, "..", "..", TEMPLATES, "data-services", "dataService.xml");
            const buffer: Buffer = fse.readFileSync(dSTemplateFilePath);
            let dataService = new DOM().parseFromString(buffer.toString(), "text/xml");
            let data = dataService.getElementsByTagName("data")[0];
            data.setAttribute("name", dataServiceName);
            let fileUri: Uri = Utils.createXmlFile(dSFilePath, dataService);

            //update artifact.xml
            
            let rootPomFilePath: string = path.join(rootDirectory, POM_FILE);
            let project: Utils.Project = Utils.getProjectInfoFromPOM(rootPomFilePath);
            let groupId: string = project.groupId;
            let finalGroupId: string = `${groupId}.${DataServiceInfo.TYPE.split("/")[1]}`;
            let file: string = [DataServiceInfo.DATA_SERVICE_LABEL, dataServiceName + ".dbs"].join("/");
            
            Utils.addArtifactToArtifactXml(artifactXmlFilePath, dataServiceName, finalGroupId, VERSION, DataServiceInfo.TYPE,
                ServerRoleInfo.DATA_SERVICES_SERVER, file, undefined, undefined, undefined);

            //update composite pom.xml
            let compositeExporterDirectory: string = Utils.getDirectoryFromDirectoryType(SubDirectories.COMPOSITE_EXPORTER, rootDirectory);
            Utils.updateCompositePomXml(compositeExporterDirectory, dataServiceName, DataServiceInfo.TYPE,
                ServerRoleInfo.DATA_SERVICES_SERVER, finalGroupId);

            // Open and show newly created .dbs file in the editor.
            workspace.openTextDocument(fileUri).then(doc => window.showTextDocument(doc));
        }
    }

    /**
    * Delete dataservice related information from,
    * artifact.xml
    * composite pom.xml
    */
    export function safeDeleteDataService(deletedFile: string, rootDirectory: string) {

        let array: string[] = deletedFile.split(path.sep);
        let deletedDataService: string = array[array.length - 1];
        let fileExtension: string = deletedDataService.split(".")[1];
        let dataServiceFolder: string = array[array.length - 2];
        let rawDataServiceName: string = deletedDataService.split(".")[0];
        let artifactXmlFilePath: string = path.join(deletedFile, "..", "..", ARTIFACT_FILE);

        //check whether a .dbs file was deleted
        if ((dataServiceFolder === DataServiceInfo.DESTINATION_FOLDER) && (fileExtension === "dbs")) {
            Utils.deletefromArtifactXml(artifactXmlFilePath, rawDataServiceName.trim());
            Utils.deleteArtifactFromPomXml(rawDataServiceName.trim(), dataServiceFolder, rootDirectory, undefined);
        }
    }
}