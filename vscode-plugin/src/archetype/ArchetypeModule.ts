// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as fse from "fs-extra";
import * as os from "os";
import * as path from "path";
import { Uri, window, workspace} from "vscode";
import * as vscode from 'vscode';
import { executeInTerminal } from "../utils/mavenUtils";
import { openDialogForFolder } from "../utils/uiUtils";
import { Utils } from "../utils/Utils";          
import { Archetype } from "./Archetype";
import { Runner } from "../mavenInternals/mavenRunner";
import { executeCommandHandler } from "../mavenInternals/commandHandler";

export namespace ArchetypeModule {

    export interface ESBProject{
        archetypeGroupId: string;
        archetypeArtifactId: string;
        groupId: string;
        artifactId: string;
        version?: string;
    }

    async function selectArchetype(): Promise<Archetype | undefined> {
        let selectedArchetype: Archetype | undefined = await showQuickPickForArchetypes();
        if (selectedArchetype && !selectedArchetype.artifactId) {
            selectedArchetype = await showQuickPickForArchetypes({ all: true });
        }
        if (!selectedArchetype) {
            // throw new OperationCanceledError("Archetype not selected.");
        }

        return selectedArchetype;
    }      

    async function chooseTargetFolder(entry: Uri | undefined): Promise<string | null> {
        const result: Uri | null = await openDialogForFolder({
            defaultUri: entry,
            openLabel: "Select Destination Folder"
        });
        const cwd: string | null = result && result.fsPath;
        if (!cwd) {
            // throw new OperationCanceledError("Target folder not selected.");
        }
        return cwd;
    }

    // async function executeInTerminalHandler(newProject: ESBProject, archetypeGroupId: string | null, archetypeArtifactId: string | null, cwd: string | null): Promise<void> {
    //     const cmd: string = [
    //         "archetype:generate",
    //         `-DarchetypeArtifactId="${archetypeArtifactId}"`,
    //         `-DarchetypeGroupId="${archetypeGroupId}"`,
    //         `-DgroupId="${newProject.groupId}"`,
    //         `-DartifactId="${newProject.artifactId}"`,
    //         `-DnewVersion="${newProject.version}"`,
    //         `-DinteractiveMode=false`
    //     ].join(" ");
    //     await executeInTerminal(newProject.artifactId, cmd, undefined, { cwd });
    // }


    export async function createESBProject(entry: Uri | undefined): Promise<void>  {
        
        const archetype  = await getESBArtifact();
        let projectName: string | undefined = await showInputBoxForProjectName();

        while(projectName === "") {
            window.showErrorMessage("ESB Project name is mandatory");
            projectName = await showInputBoxForProjectName();
        }

        if(archetype && archetype.groupId && archetype.artifactId &&  projectName && projectName.length > 0) {
            // choose target folder.
            const homedir: string = require('os').homedir();
            
            const targetFolderHint = Uri.file(homedir);
            targetFolderHint.scheme == 'file';
            targetFolderHint.path == homedir;
            targetFolderHint.fragment == '';

            const newProject: ESBProject = {archetypeGroupId: archetype.groupId, archetypeArtifactId: archetype.artifactId, groupId: "com.example." + projectName, artifactId:projectName};
            const cwd: string | null = await chooseTargetFolder(targetFolderHint);

            // await executeInTerminalHandler(newProject, archetype.groupId, archetype.artifactId, cwd);
            // await executeMavenCommandHandler(newProject, cwd);
            if(cwd) {
                await executeCommandHandler(newProject, cwd);
            }
        }else {

        }
    }

    function executeMavenCommandHandler(newProject: ESBProject, cwd: string | null) {
        let mavenRunner: Runner = new Runner();
        const args: string[] = [
            "archetype:generate",
            `-DarchetypeArtifactId="${newProject.archetypeArtifactId}"`,
            `-DarchetypeGroupId="${newProject.archetypeGroupId}"`,
            `-DgroupId="${newProject.groupId}"`,
            `-DartifactId="${newProject.artifactId}"`,
            `-DinteractiveMode=false`
        ];
        if(cwd) {
            // mavenRunner.runCommand("mvn", args, cwd, newProject.artifactId);
        }
    }

    export async function generateFromArchetype(entry: Uri | undefined): Promise<void> {
        // select archetype.
        // const { artifactId, groupId } = await selectArchetype();

        console.log("inside generateFromArchetype method");

        const a = await selectArchetype();

        if(typeof a !== "undefined") {
            const artifactId = a.artifactId;
            const groupId = a.groupId;

            // choose target folder.
            let targetFolderHint: Uri;
            if (entry) {
                targetFolderHint = entry;

            } else if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
                targetFolderHint = workspace.workspaceFolders[0].uri;

                const cwd: string | null = await chooseTargetFolder(targetFolderHint);
                // await executeInTerminalHandler(groupId, artifactId, cwd);

                // window.
            }
            // execute in terminal.
        }
    }

    async function showQuickPickForArchetypes(options?: { all: boolean }): Promise<Archetype | undefined> {
        return await window.showQuickPick(
            loadArchetypePickItems(options).then(items => items.map(item => ({
                value: item,
                label: item.artifactId ? `$(package) ${item.artifactId} ` : "More ...",
                description: item.groupId ? `${item.groupId}` : "",
                detail: item.description
            }))),
            { matchOnDescription: true, placeHolder: "Select an archetype ..." }
        ).then(selected => selected && selected.value);
    }

    async function showInputBoxForProjectName(): Promise<string | undefined> {
        return await window.showInputBox({ value: "", prompt: "Enter ESB Project Name", placeHolder: "Enter project name here"}).then(text => text);
    }

    // async function showInputBoxForProjectVerison(): Promise<string | undefined> {
    //     return await window.showInputBox({ value: "", prompt: "Enter ESB Project Version", placeHolder: "Enter version here"}).then(text => text);
    // }


    async function loadArchetypePickItems(options?: { all: boolean }): Promise<Archetype[]> {
        // from local catalog
        const localItems: Archetype[] = await getLocalArchetypeItems();
        // from cached remote-catalog
        // const remoteItems: Archetype[] = await getCachedRemoteArchetypeItems();
        // const localOnlyItems: Archetype[] = localItems.filter(localItem => !remoteItems.find(remoteItem => remoteItem.identifier === localItem.identifier));
        if (options && options.all) {
            const archTypeArr : Archetype[] = [];
            archTypeArr.concat(localItems);

            return archTypeArr;
        } else {
            // const recommendedItems: (Archetype | undefined)[] = await getRecomendedItems(remoteItems);
            // return [new Archetype({"gyfy", "hhg", "hvg", "Find more archetypes available in remote catalog."})];

            // if(typeof recommendedItems !== undefined) {
                return [new Archetype( null, null, undefined, "Find more archetypes available in remote catalog.")].concat(localItems);

            // }

            // return [new Archetype( null, null, undefined, "Find more archetypes available in remote catalog.")];

            
            // null, null, null, "Find more archetypes available in remote catalog.")].concat(localOnlyItems, recommendedItems)
        }
    }

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
            // do nothing
        }
        return [];
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

    async function getESBArtifact(): Promise<Archetype | undefined> {
        const localItems: Archetype[] = await getLocalArchetypeItems();
        let archetype = undefined;

        localItems.forEach(function(item) {
            let artifactId = item.artifactId;
            let groupId = item.groupId;

            if(artifactId === "wso2ei-tooling" && groupId === "wso2ei.vscode.tooling") {
                archetype = item;
                return archetype;
            }
        });
        return archetype;
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
}
