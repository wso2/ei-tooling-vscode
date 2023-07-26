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

import { FileType, Uri, workspace } from 'vscode';
import { join } from 'path';
import { checkWorkspaceFolder } from './checkWorkspaceFolder';

// Checking if the registry proect folder name given by user is in the workspace
export default class registryProject {

  public static getRegistryFolder(registryName: string): Uri {
    var currentFolder = checkWorkspaceFolder();
    var registryFolderPathUri: Uri = Uri.parse("");
    if (currentFolder && registryName.length > 0) {
      var folderPath = currentFolder.uri.fsPath;
      var folderUri = Uri.file(folderPath);
      var registryFolderPath = join(folderPath, registryName);
      var registryResourcePath = join(registryFolderPath, 'Registry Resources View');
      registryFolderPathUri = Uri.file(registryFolderPath);

      workspace.fs.readDirectory(folderUri).then(entries => {
        console.log("all projects : ", entries);
        var matchingFolders = entries.filter(entry => {
          return entry[1] === FileType.Directory && entry[0] === registryName;
        });

        if (matchingFolders.length <= 0) {
          workspace.fs.createDirectory(registryFolderPathUri);
          workspace.fs.createDirectory(Uri.file(registryResourcePath));
        }
      });
    }
    return registryFolderPathUri;
  }

}



