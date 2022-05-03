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
import {DataServiceModule} from "./DataServiceModule";
import {
    DataServiceProjectInfo,
    DataServiceInfo
} from "./dataServiceUtils";
import {showInputBox, showQuickPick} from "../utils/uiUtils";
import {Utils} from "../utils/Utils";

export async function createDataServiceProject() {
        
    let projectName = await showInputBox(DataServiceProjectInfo.PROMPT_MESSAGE);

    while (typeof projectName !== "undefined" && !Utils.validate(projectName.trim())) {
        window.showErrorMessage("Enter valid Data Service Project name!!");
        projectName = await showInputBox(DataServiceProjectInfo.PROMPT_MESSAGE);
    }

    if (projectName && workspace.workspaceFolders) {
        DataServiceModule.createProject(projectName.trim(), workspace.workspaceFolders[0].uri.fsPath);
    }
}

export async function createNewDataService(filePath: string){

    let dataServiceName = await showInputBox(DataServiceInfo.PROMPT_MESSAGE);

    while (typeof dataServiceName !== "undefined" && !Utils.validate(dataServiceName.trim())) {
        window.showErrorMessage("Enter valid Data Service name!!");
        dataServiceName = await showInputBox(DataServiceInfo.PROMPT_MESSAGE);
    }

    if (dataServiceName) {
        DataServiceModule.createService(filePath, dataServiceName);
    }
}
