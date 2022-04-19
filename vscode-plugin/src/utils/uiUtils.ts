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

import {OpenDialogOptions, QuickPickItem, Uri, window} from "vscode";

// file chooser dialog
export async function openDialogForFolder(customOptions: OpenDialogOptions): Promise<Uri | null> {
    const options: OpenDialogOptions = {
        canSelectMany: false
        
    };
    const result: Uri[] | undefined = await window.showOpenDialog(Object.assign(options, customOptions));
    if (result && result.length > 0) {
        return Promise.resolve(result[0]);
    } else {
        return Promise.resolve(null);
    }
}

// Input project ArtifactID
export async function showInputBoxForArtifactId(): Promise<string | undefined> {
    return await window.showInputBox({
                                         value: "",
                                         prompt: "Enter ArtifactId",
                                         placeHolder: "Enter ArtifactId here"
                                     }).then(text => text);
}

// Input project GroupID
export async function showInputBoxForGroupId(): Promise<string | undefined> {
    return await window.showInputBox({
                                         value: "",
                                         prompt: "Enter GroupId",
                                         placeHolder: "Enter GroupId here"
                                     }).then(text => text);
}

export async function showQuickPick(quickPickItems: QuickPickItem[]): Promise<string | undefined> {
    return await window.showQuickPick(
        quickPickItems,
        {matchOnDescription: true, placeHolder: "Select type..."}
    ).then(selected => (
        selected && selected.description

    ));
}

export async function showInputBox(promptMsg: string) {
    return await window.showInputBox({
                                         prompt: promptMsg
                                     }).then(text => text);
}

export async function chooseTargetFolder(entry: Uri | undefined): Promise<string | null> {
    const result: Uri | null = await openDialogForFolder({
                                                             defaultUri: entry,
                                                             openLabel: "Select Destination Folder",
                                                             canSelectFiles: false,
                                                             canSelectFolders: true,
                                                         });
    const targetLocation: string | null = result && result.fsPath;
    if (!targetLocation) {
        window.showErrorMessage("Target folder not selected. Operation aborted!");
    }
    return targetLocation;
}

export async function chooseTargetFile(entry: Uri | undefined): Promise<string | null> {
    const result: Uri | null = await openDialogForFolder({
                                                             defaultUri: entry,
                                                             openLabel: "Select Target Zip",
                                                             canSelectFiles: true,
                                                             canSelectFolders: false,
                                                             filters: {
                                                                'Zip files': ['zip']
                                                           }
                                                         });
    const targetLocation: string | null = result && result.fsPath;
    if (!targetLocation) {
        window.showErrorMessage("Target file not selected. Operation aborted!");
    }
    return targetLocation;
}
