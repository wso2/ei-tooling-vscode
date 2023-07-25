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

/**
Description:
This file takes care of adding the nodes and ports connected to each other, excluding the output node and ports.
*/

import DMCFile from "../DMCFileGenerator";
import { inputDmcPush } from "./inputDmcPush";
import { DataModel } from "./models";

export function createinputDmcArray(inputObjectArray: DataModel[]): string[] {

    let simplified_inputQueueArray1 = DMCFile.simplified_inputQueueArray1;
    let inputDMCArray: string[] = [];

    for (let row1 of simplified_inputQueueArray1) {
        for (let row2 of inputObjectArray) {
            let [portLink, portAction]: [string, string] = ["", ""];
            let { sourcePort, targetPort } = row2;

            if (sourcePort.nodeId === row1[0] && sourcePort.alignment === "OUT") {
                [portLink, portAction] = inputDmcPush(targetPort.nodeId, targetPort.portId, sourcePort.ID, sourcePort.nodeId, sourcePort.portId, targetPort.ID);
            } else if (targetPort.nodeId === row1[0] && targetPort.alignment === "OUT") {
                [portLink, portAction] = inputDmcPush(sourcePort.nodeId, sourcePort.portId, targetPort.ID, targetPort.nodeId, targetPort.portId, sourcePort.ID);
            }

            if (portLink !== "") {
                inputDMCArray.push(portAction);
            }
            if (portAction !== "") {
                inputDMCArray.push(portLink + "\n");
            }
        }
    }
    return inputDMCArray;
}
