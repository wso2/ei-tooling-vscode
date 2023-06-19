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

import { window, workspace, Uri } from "vscode";
import { showInputBox, chooseTargetFile } from "../utils/uiUtils";
import { Utils } from "../utils/Utils";
import { ConnectorInfo } from "./connectorUtils";
import { ConnectorModule } from "./ConnectorModule";

export async function addNewConnectorExporter() {

    let projectName = await showInputBox(ConnectorInfo.CONNECTOR_EXPORTER_PROMPT_MESSAGE);

    while (typeof projectName !== "undefined" && !Utils.validate(projectName.trim())) {
        window.showErrorMessage("Enter valid Connector Exporter Name!!");
        projectName = await showInputBox(ConnectorInfo.CONNECTOR_EXPORTER_PROMPT_MESSAGE);
    }

    if (projectName && workspace.workspaceFolders) {
        var rootDirectory: string = "";
        await Utils.selectFolderFromWorkspace('Select a root project to add the connector')
            .then((result) => rootDirectory = result)
            .catch((error) => {
                window.showErrorMessage(String(error));
                throw String(error);
            })
        ConnectorModule.createNewConnectorExporter(rootDirectory, projectName.trim());
    }
}

export async function addNewConnectorFromStore() {

    let connectorName = await showInputBox(ConnectorInfo.CONNECTOR_PROMPT_MESSAGE);

    while (typeof connectorName !== "undefined" && !Utils.validate(connectorName.trim())) {
        window.showErrorMessage("Enter valid Connector name!!");
        connectorName = await showInputBox(ConnectorInfo.CONNECTOR_PROMPT_MESSAGE);
    }

    if (connectorName && workspace.workspaceFolders) {
        var rootDirectory: string = "";
        await Utils.selectFolderFromWorkspace('Select a root project to add the connector')
            .then((result) => rootDirectory = result)
            .catch((error) => {
                window.showErrorMessage(String(error));
                throw String(error);
            })
        ConnectorModule.getSuggestedConnectors(connectorName.trim(), rootDirectory);
    }
}

export async function addNewConnectorFromFileSystem() {

    try {
        // Set home dir as the target folder hint.
        const homedir: string = require('os').homedir();
        const targetFolderHint = Uri.file(homedir);

        //get the target folder
        const targetLocation: string | null = await chooseTargetFile(targetFolderHint, "Select a connector...", { 'ZIP files': ['zip'] });

        if (targetLocation && workspace.workspaceFolders) {
            var rootDirectory: string = "";
            await Utils.selectFolderFromWorkspace('Select a root project to add the connector')
            .then((result) => rootDirectory = result)
            .catch((error) => {
                window.showErrorMessage(String(error));
                throw String(error);
            })
            ConnectorModule.importConnectorFromFileSystem(targetLocation, rootDirectory);
        }

    } catch (err) {
        window.showErrorMessage("Could not import the connector...!");
    }
}
