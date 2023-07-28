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

import { Uri, workspace } from 'vscode';
import { readFile } from 'fs';
import { join } from 'path';

// deserializing the diagram json format data.
export default class datamapperDeserialization {

    public static deserializingDiagram(name: string, registryFolderPath: Uri, callback: (message: any) => void) {
        var fileName = `${name}.datamapper.json`;
        var currentFolder = workspace.workspaceFolders?.[0];
        
        if (currentFolder) {
            var filePath = join(registryFolderPath.fsPath, fileName);

            readFile(filePath, 'utf8', (err, data) => {
                if (!err) {
                    callback({ command: 'serialized', data: data });
                }
            });
        }
    }

}



