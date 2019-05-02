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

import {Uri, window} from "vscode";
import {chooseTargetFolder, showInputBoxForProjectName} from "../utils/uiUtils";
import {Utils} from "../utils/Utils";
import {executeProjectCreateCommand} from "../mavenInternals/commandHandler";
import {ARCHETYPE_ARTIFACT_ID, ARCHETYPE_GROUP_ID, ARCHETYPE_VERSION, GROUP_ID_PREFIX} from "./archetypeUtils";

export namespace ArchetypeModule {

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
    export async function createESBProject(): Promise<void> {
        let projectName: string | undefined = await showInputBoxForProjectName();

        // Make sure the project name is valid.
        while (typeof projectName !== "undefined" && !Utils.validate(projectName)) {
            window.showErrorMessage("Enter valid ESB Project name!!");
            projectName = await showInputBoxForProjectName();
        }

        if (typeof projectName === "undefined") {
            return;
        }

        // Set home dir as the target folder hint.
        const homedir: string = require('os').homedir();
        const targetFolderHint = Uri.file(homedir);
        const targetLocation: string | null = await chooseTargetFolder(targetFolderHint);

        if (projectName && projectName.length > 0 && targetLocation) {

            const newProject: ESBProject = {
                archetypeGroupId: ARCHETYPE_GROUP_ID,
                archetypeArtifactId: ARCHETYPE_ARTIFACT_ID,
                archetypeVersion: ARCHETYPE_VERSION,
                groupId: GROUP_ID_PREFIX + projectName,
                artifactId: projectName
            };
            // Execute command handler that runs maven project generate.
            await executeProjectCreateCommand(newProject, targetLocation);
        }
    }
}

