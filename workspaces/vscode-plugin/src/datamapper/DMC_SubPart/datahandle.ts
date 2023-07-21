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

import { integer } from "vscode-languageserver-protocol";
import { checkTransformDataArray } from "./checkTransformDataArray";
import { DataModel } from "./models";

export function datahandle(transformedData: DataModel[], i: integer, transformDataArray: any[][]): any[] {
    const { sourcePort, targetPort } = transformedData[i];
    const isInputSource = sourcePort.nodeId === "Input";
    const isOutputSource = sourcePort.nodeId === "Output";
    const isInputTarget = targetPort.nodeId === "Input";
    const isOutputTarget = targetPort.nodeId === "Output";
    if ((isInputSource && isOutputTarget) || (isOutputSource && isInputTarget)) {
        return [];
    }
    let data: any[] = [];
    let actionnode: {} = {},
        actionID: {} = {};
    if (isInputSource || isOutputSource) {
        actionnode = targetPort.nodeId;
        actionID = targetPort.ID;
    } else if (isInputTarget || isOutputTarget) {
        actionnode = sourcePort.nodeId;
        actionID = sourcePort.ID;
    } else {
        actionnode = sourcePort.nodeId;
        actionID = sourcePort.ID;
        data = checkTransformDataArray(actionnode, actionID, i, transformDataArray);
        actionnode = targetPort.nodeId;
        actionID = targetPort.ID;
    } 
    data = checkTransformDataArray(actionnode, actionID, i, transformDataArray);
    return data;
}
