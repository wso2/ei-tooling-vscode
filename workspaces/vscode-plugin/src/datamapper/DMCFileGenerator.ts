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

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { createinputDMCArray } from './DMC_SubPart/createinputDMCArray';
import { createoutputDMCArray } from './DMC_SubPart/createoutputDMCArray';
import { modifyDMCArrays } from './DMC_SubPart/modifyDMCArrays';
import { transformData } from './DMC_SubPart/transformData';
import { DataModel } from './DMC_SubPart/models';
import { workspace } from 'vscode';

export default class DMCFile {

	static simplified_transformDataArray: any[][];
	static simplified_inputQueueArray1: any[][];

	public static fileCreation(linkData: [],registryFolderPath: vscode.Uri,projectName : string) {

		const transformedData: DataModel[] = linkData;
		var workspaceFolder = workspace.workspaceFolders?.[0];
		
		if (workspaceFolder) {

			this.simplified_transformDataArray = [];
			this.simplified_inputQueueArray1 = [];
			[this.simplified_transformDataArray, this.simplified_inputQueueArray1] = transformData(transformedData);

			let outputObjectArray = transformedData.filter(j => j.targetPort.nodeId === "Output" || j.sourcePort.nodeId === "Output");
			let outputDMCArray = createoutputDMCArray(outputObjectArray);
			let inputObjectArray = transformedData.filter(j => j.targetPort.nodeId !== "Output" && j.sourcePort.nodeId !== "Output");
			let inputDMCArray = createinputDMCArray(inputObjectArray);

			let content = modifyDMCArrays(outputDMCArray, inputDMCArray);
			const fileName = `${projectName}.dmc`
			var filePath = path.join(registryFolderPath.fsPath, fileName);

			fs.writeFile(filePath, content, (err) => {
				if (err) {
					vscode.window.showErrorMessage('Unable to create file: ' + err.message);
					return;
				}
			});
		} 
	}
}
