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

import * as fse from "fs-extra";
import * as os from "os";
import * as path from "path";
import {Uri, window} from "vscode";
import {chooseTargetFolder, showInputBoxForProjectName} from "../utils/uiUtils";
import {Utils} from "../utils/Utils";
import {Archetype} from "./Archetype";
import {executeCommandHandler} from "../mavenInternals/commandHandler";
import {GROUP_ID_PREFIX, ARCHETYPE_ARTIFACT_ID, ARCHETYPE_GROUP_ID} from "./archetypeUtils";

export namespace ArchetypeModule {

    export interface ESBProject {
        archetypeGroupId: string;
        archetypeArtifactId: string;
        groupId: string;
        artifactId: string;
        version?: string;
    }

    export async function createESBProject(): Promise<void> {
        // Select ESB artifact from local .m2 repo
        const archetype = await getESBArtifact();
        if (!archetype) {
            window.showErrorMessage("No matching archetype found!!");
            return;
        }
        let projectName: string | undefined = await showInputBoxForProjectName();

        // Loop until the project name is valid
        while (typeof projectName !== "undefined" && !Utils.validate(projectName)) {
            window.showErrorMessage("Enter valid ESB Project name!!");
            projectName = await showInputBoxForProjectName();
        }

        if (typeof projectName === "undefined") {
            return;
        }

        if (archetype && archetype.groupId && archetype.artifactId && projectName && projectName.length > 0) {
            // Set home dir as the target folder hint.
            const homedir: string = require('os').homedir();
            const targetFolderHint = Uri.file(homedir);
            targetFolderHint.scheme == 'file';
            targetFolderHint.path == homedir;
            targetFolderHint.fragment == '';

            const newProject: ESBProject = {
                archetypeGroupId: archetype.groupId,
                archetypeArtifactId: archetype.artifactId,
                groupId: GROUP_ID_PREFIX + projectName,
                artifactId: projectName
            };

            const targetLocation: string | null = await chooseTargetFolder(targetFolderHint);
            if (targetLocation) {
                await executeCommandHandler(newProject, targetLocation);
            }
        }
    }

    async function getESBArtifact(): Promise<Archetype | undefined> {
        const localItems: Archetype[] = await getLocalArchetypeItems();
        let archetype = undefined;

        localItems.forEach(function (item) {
            let artifactId = item.artifactId;
            let groupId = item.groupId;

            if (artifactId === ARCHETYPE_ARTIFACT_ID && groupId === ARCHETYPE_GROUP_ID) {
                archetype = item;
                return archetype;
            }
        });
        return archetype;
    }

    async function getLocalArchetypeItems(): Promise<Archetype[]> {
        const localCatalogPath: string = path.join(os.homedir(), ".m2", "repository", "archetype-catalog.xml");
        if (await fse.pathExists(localCatalogPath)) {
            const buf: Buffer = await fse.readFile(localCatalogPath);
            return listArchetypeFromXml(buf.toString());
        } else {
            return [];
        }
    }

    async function listArchetypeFromXml(xmlString: string): Promise<Archetype[]> {
        try {
            const xmlObject: any = await Utils.parseXmlContent(xmlString);
            const catalog: any = xmlObject && xmlObject["archetype-catalog"];
            const dict: { [key: string]: Archetype } = {};
            const archetypeList: any[] = catalog.archetypes[0].archetype;
            archetypeList.forEach(archetype => {
                const groupId: string = archetype.groupId && archetype.groupId[0];
                const artifactId: string = archetype.artifactId && archetype.artifactId[0];
                const description: string = archetype.description && archetype.description[0];
                const version: string = archetype.version && archetype.version[0];
                const repository: string = archetype.repository && archetype.repository[0];
                const identifier: string = `${groupId}:${artifactId}`;

                if (!dict[identifier]) {
                    dict[identifier] = new Archetype(artifactId, groupId, repository, description);
                }
                if (dict[identifier].versions.indexOf(version) < 0) {
                    dict[identifier].versions.push(version);
                }
            });
            return Object.keys(dict).map((k: string) => dict[k]);

        } catch (err) {
            console.log("Error occurred: " + err);
        }
        return [];
    }

    // async function getCachedRemoteArchetypeItems(): Promise<Archetype[]> {
    //     const contentPath: string = getPathToExtensionRoot("resources", "archetypes.json");
    //     if (await fse.pathExists(contentPath)) {
    //         return (await fse.readJSON(contentPath)).map(
    //             (rawItem: Archetype) => new Archetype(
    //                 rawItem.artifactId,
    //                 rawItem.groupId,
    //                 rawItem.repository,
    //                 rawItem.description,
    //                 rawItem.versions
    //             )
    //         );
    //     } else {
    //         return [];
    //     }
    // }
    //
    // async function getRecomendedItems(allItems: Archetype[]): Promise<Archetype[]> {
    //     // Top popular archetypes according to usage data
    //     let fixedList: string[];
    //     try {
    //         const rawlist: string = await Utils.downloadFile(POPULAR_ARCHETYPES_URL, true);
    //         fixedList = JSON.parse(rawlist);
    //     } catch (error) {
    //         fixedList = [];
    //     }
    //     return fixedList.map((fullname: string) => allItems.find((item: Archetype) => fullname === `${item.groupId}:${item.artifactId}`));
    // }
}

