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

import { Uri, window } from 'vscode';
import { writeFile } from "fs";
import { join } from 'path';

// serializing datamapper diagram data and storing it in json format.
export default class datamapperSerialization {

    public static serializingDiagram(registryPath: Uri,fileContent: string,name:string) {
        var fileName = `${name}.datamapper.json`;
       
        if (registryPath) {
            var filePath = join(registryPath.fsPath,fileName);
            writeFile(filePath, fileContent, (err) => {
                if (err) {
                    window.showErrorMessage('Unable to save serialized data file.');
                }
            });
        }
    }

}



