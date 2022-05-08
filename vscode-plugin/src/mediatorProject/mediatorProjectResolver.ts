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

import {window, workspace} from "vscode";
import {MediatorProjectModule} from "./MediatorProjectModule";
import { MediatorProjectInfo} from "./mediarorProjectUtils";
import {showInputBox} from "../utils/uiUtils";
import {Utils} from "../utils/Utils";
import { ServerRoleInfo } from "../artifacts/artifactUtils";

export async function createMediatorProject() {
        
    let projectName = await showInputBox(MediatorProjectInfo.PROJECT_PROMPT_MESSAGE);

    while (typeof projectName !== "undefined" && !Utils.validate(projectName.trim())) {
        window.showErrorMessage("Enter valid Data Mediator Project name!!");
        projectName = await showInputBox(MediatorProjectInfo.PROJECT_PROMPT_MESSAGE);
    }

    let packageName = await showInputBox(MediatorProjectInfo.PACKAGE_PROMPT_MESSAGE);

    while (typeof packageName !== "undefined" && !Utils.validateGroupId(packageName.trim())) {
        window.showErrorMessage("Enter valid Package name!!");
        packageName = await showInputBox(MediatorProjectInfo.PACKAGE_PROMPT_MESSAGE);
    }

    let className = await showInputBox(MediatorProjectInfo.CLASS_PROMPT_MESSAGE);

    while (typeof className !== "undefined" && !Utils.validate(className.trim())) {
        window.showErrorMessage("Enter valid Class name!!");
        className = await showInputBox(MediatorProjectInfo.CLASS_PROMPT_MESSAGE);
    }

    if (projectName && packageName && className && workspace.workspaceFolders) {
        let rootDirectory: string = workspace.workspaceFolders[0].uri.fsPath;
        MediatorProjectModule.createProject(rootDirectory, projectName.trim(), packageName.trim(), "1.0.0", ServerRoleInfo.ENTERPRISE_INTEGRATOR, className.trim());
    }
}


