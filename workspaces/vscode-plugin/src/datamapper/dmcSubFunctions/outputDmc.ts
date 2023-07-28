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
* Description:
* This file is used to record the respective nodes and ports which are connected to output nodes and ports
*/

import datamapperFileUpload from "../datamapperFileUpload";
import { portOutput } from "./portOutput";
import { trimTheStringFromColumnToEnd, trimTheStringUptoColon } from "./trimTheString";

export function outputDMC(sourcePortPortID: {}, targetPortNodeID: {}, targetPortPortID: {}, targetPortID: {}): string {
    let arrayOutput = datamapperFileUpload.arrayOutput;
    let e: string = "";
    let f: string = "";
    for (let row of arrayOutput) {
        let outputPort = trimTheStringUptoColon(sourcePortPortID);
        if (outputPort.endsWith(row[1])) {
            f = row[0];
            row[2] = true;
        }
    }
    switch (targetPortNodeID) {
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
            e = portOutput(targetPortNodeID, targetPortID, targetPortPortID);
            break;
        default:
            if (trimTheStringFromColumnToEnd(sourcePortPortID) === trimTheStringFromColumnToEnd(targetPortPortID)) {
                e = targetPortNodeID + "." + trimTheStringUptoColon(targetPortPortID);
            } else if (trimTheStringFromColumnToEnd(sourcePortPortID).endsWith("string")) {
                e = targetPortNodeID + "." + trimTheStringUptoColon(targetPortPortID) + ".toString()";
            } else if (trimTheStringFromColumnToEnd(sourcePortPortID).endsWith("integer")) {
                e = "parseInt((" + targetPortNodeID + "." + trimTheStringUptoColon(targetPortPortID) + "),10)";
            }
    }
    return `${f} = ${e};`;
}
