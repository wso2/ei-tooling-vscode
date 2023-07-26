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
This file is used to add value to the right hand side of the string, to be uploaded to the relevant input/output DMC file. 
It checks whether the same node is available in the simplified_transformDataArray, before adding to the DMC file.
This function is called from following two functions.
1. outputDMC.ts
2. sourceequalstarget.ts
*/


import DMCFile from "../DMCFileGenerator";
import { trimTheStringUptoColon } from "./trimTheString";

export function portOutput(action: {}, targetPortID: {}, targetPortPortID: {}): string {
    let simplified_transformDataArray = DMCFile.simplified_transformDataArray;
    let string = "";
    for (let row of simplified_transformDataArray) {
        if (row[1] !== targetPortID) {
            continue;
        }
        switch (action) {
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
                string = row[6];
                break;
            case "Split":
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
                string = row[4];
                if (trimTheStringUptoColon(targetPortPortID) === " Result_1") {
                    string += "[0]";
                } else if (trimTheStringUptoColon(targetPortPortID) === " Result_2") {
                    string += "[1]";
                }
                break;
            case "Replace":
            case "SubString":
            case "IfElse":
                string = row[8];
                break;
        }
    }

    return string;
}
