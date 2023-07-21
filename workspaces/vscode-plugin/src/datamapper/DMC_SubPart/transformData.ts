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

import { datahandle } from "./datahandle";
import { DataModel } from "./models";

export function transformData(transformedData: DataModel[]): any[] {
    let inputID: {} = {};

    for (let i in transformedData) {
        let { sourcePort, targetPort } = transformedData[i];
        if (sourcePort.nodeId === "Input") {
            inputID = sourcePort.ID;
        } else if (targetPort.nodeId === "Input") {
            inputID = targetPort.ID;
        }
    }

    let transformDataArray: any[][] = [];
    let inputQueueArray1: any[][] = [];
    inputQueueArray1.push(["Input", inputID]);
    let b = 0;
    let data: any[] = [];

    const transformedDataLength = transformedData.length;
    const transformDataArraySet = new Set(transformDataArray);

    for (let i = 0; i < transformedDataLength; i++) {
        data = datahandle(transformedData, b, transformDataArray);
        if (!data || transformDataArraySet.has(data)) {
            continue;
        }
        transformDataArray.push(data);
        inputQueueArray1.push([`${data[0]}`, `${data[1]}`]);
        b++;
        transformDataArraySet.add(data);
    }

    let simplified_transformDataArray = transformDataArray.filter(j => j.length !== 0);

    let simplified_inputQueueArray1 = inputQueueArray1.filter(j => j[0] !== "undefined");

    return [simplified_transformDataArray, simplified_inputQueueArray1];
}
