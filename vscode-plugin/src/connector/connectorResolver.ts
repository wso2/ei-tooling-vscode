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

import {QuickPickItem, window, workspace} from "vscode";
import {showInputBox, showQuickPick} from "../utils/uiUtils";
import {Utils} from "../utils/Utils";
import { ConnectorInfo } from "./connectorUtils";
import { ConnectorModule } from "./ConnectorModule";
import { SubDirectories } from "../artifacts/artifactUtils";
import * as path from 'path';

export async function addNewConnectorExporter(){

    const dirName = __dirname;

    let projectName = await showInputBox(ConnectorInfo.CONNECTOR_EXPORTER_PROMPT_MESSAGE);

    while (typeof projectName !== "undefined" && !Utils.validate(projectName.trim())) {
        window.showErrorMessage("Enter valid Connector Exporter Name!!");
        projectName = await showInputBox(ConnectorInfo.CONNECTOR_EXPORTER_PROMPT_MESSAGE);
    }

    if (projectName) {
        let templatePomFilePath: string = path.join(dirName, "..", "..", "templates", "pom", "ConnectorExporterPom.xml");
        let templateProjNatureFilePath: string = path.join(dirName, "..", "..", "templates", "Conf", "connectorExporter.xml")
        let status: boolean = ConnectorModule.createProject(projectName.trim(), "connector exporter", templatePomFilePath,
                         templateProjNatureFilePath, SubDirectories.CONNECTOR_EXPORTER,true);
        if(status) ConnectorModule.addProjectToRootPom(projectName.trim());
    }
}

export async function addNewConnector() {

    let connectorName = await showInputBox(ConnectorInfo.CONNECTOR_PROMPT_MESSAGE);

    while (typeof connectorName !== "undefined" && !Utils.validate(connectorName.trim())) {
        window.showErrorMessage("Enter valid Connector name!!");
        connectorName = await showInputBox(ConnectorInfo.CONNECTOR_PROMPT_MESSAGE);
    }

    if (connectorName) {
        ConnectorModule.getSuggestedConnectors(connectorName.trim());
    }

}
