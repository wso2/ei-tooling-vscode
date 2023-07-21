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

import { DataModel } from "./models";
import datamapperFileUpload from "../datamapperFileUpload";
import { outputDMC } from "./outputDMC";

export function createoutputDMCArray(outputObjectArray: DataModel[]): string[] {
    let outputDMCArray: string[] = [];
    let arrayOutput = datamapperFileUpload.arrayOutput
    outputObjectArray.forEach((outputObj) => {
        const { sourcePort, targetPort } = outputObj;
        if (sourcePort.nodeId === "Output") {
            outputDMCArray.push(outputDMC(sourcePort.portId, targetPort.nodeId, targetPort.portId, targetPort.ID));
            outputObj.isChecked = true;
        } else if (targetPort.nodeId === "Output") {
            outputDMCArray.push(outputDMC(targetPort.portId, sourcePort.nodeId, sourcePort.portId, sourcePort.ID));
            outputObj.isChecked = true;
        }
    });

    for (let row of arrayOutput) {
        if (!row[2]) {
            outputDMCArray.push(`${row[0]} = {};`);
        }
    }
    return outputDMCArray;
}