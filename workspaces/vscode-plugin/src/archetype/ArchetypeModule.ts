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

import { Uri, window, commands, workspace } from "vscode";
import { chooseTargetFolder } from "../utils/uiUtils";
import { Utils } from "../utils/Utils";
import * as path from 'path';
import { Common } from "../artifacts/artifactUtils";
import { ArtifactModule } from "../artifacts/ArtifactModule";
import { ConnectorModule } from "../connector/ConnectorModule";
import { DataServiceModule } from "../dataService/DataServiceModule";
import { MediatorProjectModule } from "../mediatorProject/MediatorProjectModule";
import { ServerRoleInfo } from "../artifacts/artifactUtils";
let DOM = require('xmldom').DOMParser;
const fs = require('fs');

export namespace ArchetypeModule {

    const POM = Common.POM;
    const CONF = Common.CONF;
    const TEMPLATES = Common.TEMPLATES;
    export interface ESBProject {
        archetypeGroupId: string;
        archetypeArtifactId: string;
        archetypeVersion: string;
        groupId: string;
        artifactId: string;
        version?: string;
    }

    /**
     * Create new ESB Project from esb-project-archetype.
     */
    export async function createESBProject(message: any): Promise<void> {
        const targetLocation: string = String(workspace.getConfiguration('wso2').get('workspace'));
        if (message.artifactID && message.artifactID.length > 0 && message.groupID && message.groupID.length > 0 && targetLocation) {
            let newProjectDirectory: string = path.join(targetLocation, message.artifactID);
            if (fs.existsSync(newProjectDirectory)) {
                window.showErrorMessage("Project name already exists...!");
                return;
            }
            let templatePomFilePath: string = path.join(__dirname, "..", "..", TEMPLATES, POM, "rootPom.xml");
            let templateProjNatureFilePath: string = path.join(__dirname, "..", "..", TEMPLATES, CONF, "multiModuleProject.xml");
            await Utils.createRootProject(targetLocation, message.artifactID, templatePomFilePath,
                templateProjNatureFilePath, message.groupID, message.version);

            // create sub modules
            let rootDirectory: string = path.join(targetLocation, message.artifactID);
            let projectName: string = message.artifactID.trim();
            if (message.enableEsbConfigs === true && message.configsProjectName) {
                ArtifactModule.CreateNewESBConfigProject(rootDirectory, message.configsProjectName.trim());
            }
            if (message.enableComposite === true && message.compositeProjectName) {
                Utils.CreateNewCompositeExporterProject(rootDirectory, message.compositeProjectName.trim());
            }
            if (message.enableRegistry === true && message.registryProjectName) {
                ArtifactModule.CreateNewRegistryResourcesProject(rootDirectory, message.registryProjectName.trim());
            }
            if (message.enableConnector === true && message.connectorProjectName) {
                ConnectorModule.createNewConnectorExporter(rootDirectory, message.connectorProjectName.trim());
            }
            if(message.enableDataService === true && message.dataServiceProjectName){
                DataServiceModule.createProject(message.dataServiceProjectName.trim(), rootDirectory);
            }
            if(message.enableMediator === true && message.mediatorProjectName && message.classGroupId && message.className){
                MediatorProjectModule.createProject(rootDirectory, message.mediatorProjectName.trim(), message.classGroupId.trim(), "1.0.0", ServerRoleInfo.ENTERPRISE_INTEGRATOR, message.className.trim());
            }
            // switch to file explorer view
            commands.executeCommand('workbench.view.explorer');
        }
    }

    export async function importProject() {
        const homedir: string = require('os').homedir();
        const targetFolderHint = Uri.file(homedir);

        //get the target folder
        const targetLocation: string | null = await chooseTargetFolder(targetFolderHint, "Select Destination Folder");

        if (targetLocation) {

            Utils.createVsCodeSettingsFile(targetLocation);

            commands.executeCommand('vscode.openFolder', Uri.file(targetLocation), true);
            window.showInformationMessage("Project Imported Successfully");

        }

    }
}
