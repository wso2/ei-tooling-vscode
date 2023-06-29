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
import toJsonSchema = require("to-json-schema");

export default class datamapperFileUpload {

  public static handleFileUpload(fileContent: string, fileName: string, extension: string, callback: (message: any) => void) {
    var jsonObj = JSON.parse(fileContent);
    var schema = toJsonSchema(jsonObj);
    var schemaJson = JSON.stringify(schema);
    var node: string;
    if (fileName.endsWith('Input')) {
      node = 'Input';
    } else if (fileName.endsWith('Output')) {
      node = 'Output';
    }

    var currentFolder = workspace.workspaceFolders?.[0];
    if (currentFolder) {
      var filePath = join(currentFolder.uri.fsPath, `${fileName}_schema.json`);
      writeFile(filePath, schemaJson, (err) => {
        if (err) {
          window.showErrorMessage("Cant create Json schema");
        } else {
          window.showInformationMessage("Json schema file created");
          if (node === 'Input') {
            callback({ type: 'InputSchema', value: schema });
          } else {
            callback({ type: 'OutputSchema', value: schema });
          }
        }
      })
    } else {
      window.showErrorMessage("No current workspace");
    }
  }
}


