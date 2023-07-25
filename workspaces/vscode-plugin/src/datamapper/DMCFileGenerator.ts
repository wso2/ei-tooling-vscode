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

/*
Description:
This file is used to generate DMC file from the UI data
*/

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { workspace } from 'vscode';

import { createinputDmcArray } from './dmcSubFunctions/createinputDmcArray';
import { createoutputDmcArray } from './dmcSubFunctions/createoutputDmcArray';
import { modifyDMCArrays } from './dmcSubFunctions/modifyDMCArrays';
import { transformData } from './dmcSubFunctions/transformData';

import { DataModel } from './dmcSubFunctions/models';

export default class DMCFile {

	// Two seperate Arrays are declared to record the nodes and links in the order they are added to the canvas
	static simplified_transformDataArray: any[][];
	static simplified_inputQueueArray1: any[][];

	public static fileCreation(linkData: [], registryFolderPath: vscode.Uri, projectName: string) {

		// Below is the model received from the canvas
		const transformedData: DataModel[] = linkData;

		var workspaceFolder = workspace.workspaceFolders?.[0];

		if (workspaceFolder) {

			this.simplified_transformDataArray = [];
			this.simplified_inputQueueArray1 = [];

			// Used to record all the nodes and ports involved in the data model
			[this.simplified_transformDataArray, this.simplified_inputQueueArray1] = transformData(transformedData);

			// In here, the whole data model received from canvas is divided into two, 
			// 1. The output ports and connected links
			// 2. The remaining ports and connected links.
			// The output ports and connected links are added to create the outputDMCArray
			// The remaining ports and connected links are added to create the inputDMCArray

			let outputObjectArray = transformedData.filter(j => j.targetPort.nodeId === "Output" || j.sourcePort.nodeId === "Output");
			let outputDMCArray = createoutputDmcArray(outputObjectArray);

			let inputObjectArray = transformedData.filter(j => j.targetPort.nodeId !== "Output" && j.sourcePort.nodeId !== "Output");
			let inputDMCArray = createinputDmcArray(inputObjectArray);

			// The contents of the inputDMCArray and outputDMCArray are modified to create the content of the DMC file.
			let content = modifyDMCArrays(outputDMCArray, inputDMCArray);

			// The DMC file is created in the registry folder of the project
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
