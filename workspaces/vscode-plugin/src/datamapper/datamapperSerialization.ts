/**
 * Copyright (c) 2023, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

import { writeFile } from "fs";
import { window } from 'vscode';
import { workspace } from 'vscode';
import { join } from 'path';

export default class datamapperSerialization {

    public static serializingDiagram(fileContent: string,name:string) {
        var fileName = `${name}.datamapper.json`;
        var currentFolder = workspace.workspaceFolders?.[0];
        if (currentFolder) {
            var filePath = join(currentFolder.uri.fsPath, fileName);
            writeFile(filePath, fileContent, (err) => {
                if (err) {
                    window.showErrorMessage('Unable to save serialized data file.');
                }
            });
        }
    }
}



