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

import datamapperFileUpload from "../datamapperFileUpload";
import { portOutput } from "./portOutput";
import { trimTheStringUptoColon } from "./trimTheString";

export function sourceEqualsTarget(targetPortPortID: {}, targetPortNodeID: {}, targetPortID: {}): string {
    let arrayInput = datamapperFileUpload.arrayInput;
    let string = "";
    let action = targetPortNodeID;
    switch (action) {
        case "Split":
        case "Concat":
        case "StartsWith":
        case "EndsWith":
        case "Match":
        case "OR":
        case "AND":
        case "Add":
        case "Multiply":
        case "Max":
        case "Min":
        case "Subtract":
        case "Division":
        case "Set Precision":
        case "UpperCase":
        case "LowerCase":
        case "StringLength":
        case "Trim":
        case "StringToNumber":
        case "StringToBoolean":
        case "ToString":
        case "NOT":
        case "Round":
        case "Ceiling":
        case "Floor":
        case "AbsoluteValue":
        case "Replace":
        case "SubString":
        case "IfElse":
            string = portOutput(action, targetPortID, targetPortPortID);
            break;
        case "Input":
            for (let row of arrayInput) {
                if (trimTheStringUptoColon(targetPortPortID).endsWith(row[1])) {
                    string = row[0];
                }
            }
            break;
        default:
            string = `${targetPortNodeID}.${trimTheStringUptoColon(targetPortPortID)}`;
    }
    return string;
}