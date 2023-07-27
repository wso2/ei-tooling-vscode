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
* This file will add all the nodes and ports connected to each other, 
* starting from the input node, using the breadth first search algorithm.
* If all the ports connected to the input ports of a particular node are identified, 
* then it will record the function performed by the respective node, to the DMCArray.
*/

import { StringOperationPush1 } from "./actionPush/StringOperationPush1";
import { andOrActionPush } from "./actionPush/andOrActionPush";
import { arithmeticOperationPush1 } from "./actionPush/arithmeticOperationPush1";
import { arithmeticOperationPush2 } from "./actionPush/arithmeticOperationPush2";
import { sourceEqualsTarget } from "./sourceEqualsTarget";
import { StringOperationPush2 } from "./actionPush/StringOperationPush2";
import DMCFile from "../dmcFileGenerator";

export function inputDmcPush(sourcePortNodeID: {}, sourcePortPortID: {}, sourcePortID: {}, targetPortNodeID: {}, targetPortPortID: {}, targetPortID: {}): [string, string] {
    let e: string = "";
    let f: string = "";
    let g: string = sourceEqualsTarget(targetPortPortID, targetPortNodeID, sourcePortID);
    let action = sourcePortNodeID;
    let simplified_transformDataArray = DMCFile.simplified_transformDataArray;

    for (let row of simplified_transformDataArray) {
        if (row[1] !== targetPortID) {
            continue;
        }

        let j = 3;
        let h1 = `let ${row[j - 1]} = ${g};`
        let h2 = `let ${row[j + 1]} = ${g};`
        let h3 = `let ${row[j + 3]} = ${g};`
        let h4 = `.toString()`;

        switch (action) {
            case "Split":
            case "StringToNumber":
            case "StringToBoolean":
            case "Trim":
            case "StringLength":
            case "UpperCase":
            case "LowerCase":
            case "NOT":
                if ((sourcePortPortID === "IN : [STRING] " || sourcePortPortID === " Result : [STRING]") && !row[j]) {
                    e = h1;
                    row[j] = true;
                }
                f = StringOperationPush1(row, action);
                break;
            case "Concat":
            case "StartsWith":
            case "EndsWith":
            case "Match":
            case "AND":
            case "OR":
                if (sourcePortPortID === "IN_1 : [STRING] " && !row[j]) {
                    e = h1;
                    row[j] = true;
                } else if (sourcePortPortID === "IN_2 : [STRING] " && !row[j + 2]) {
                    e = h2;
                    row[j + 2] = true;
                }
                f = action === "AND" || action === "OR" ?
                    andOrActionPush(row, action) :
                    StringOperationPush2(row, action, j, h4);
                break;
            case "Add":
            case "Multiply":
            case "Max":
            case "Min":
            case "Subtract":
            case "Division":
            case "Set Precision":
                if (sourcePortPortID === "IN_1 : [NUM] " && !row[j]) {
                    e = h1;
                    row[j] = true;
                } else if ((sourcePortPortID === "IN_2 : [NUM] " || sourcePortPortID === "NoOfDigits:NUM ") && !row[j + 2]) {
                    e = h2;
                    row[j + 2] = true;
                }
                f = arithmeticOperationPush1(row, action);
                break;
            case "ToString":
                if (sourcePortPortID === "IN : [BOOL/NUM] " && !row[j]) {
                    e = h1;
                    row[j] = true;
                }
                if (row[j] && !row[j + 2]) {
                    f = `${row[j + 1]} = ${row[j - 1]}${h4};`;
                    row[j + 2] = true;
                }
                break;
            case "Replace":
                if (sourcePortPortID === 'VALUE : [STRING] ' && !row[j]) {
                    e = h1;
                    row[j] = true;
                } else if (sourcePortPortID === 'TARGET ' && !row[j + 2]) {
                    e = h2;
                    row[j + 2] = true;
                } else if (sourcePortPortID === 'REPLACE WITH ' && !row[j + 4]) {
                    e = h3;
                    row[j + 4] = true;
                }
                if (row[j + 2] && row[j] && row[j + 4] && !row[j + 6]) {
                    f = row[j + 5] + ` = ${row[j - 1]}${h4}.replace(${row[j + 1]},${row[j + 3]});`;
                    row[j + 6] = true;
                }
                break;
            case "SubString":
                if (sourcePortPortID === 'VALUE : [STRING] ' && !row[j]) {
                    e = h1;
                    row[j] = true;
                } else if (sourcePortPortID === 'START: [NUM] ' && !row[j + 2]) {
                    e = h2;
                    row[j + 2] = true;
                } else if (sourcePortPortID === 'LENGTH : [NUM] ' && !row[j + 4]) {
                    e = h3;
                    row[j + 4] = true;
                }
                if (row[j + 2] && row[j] && row[j + 4] && !row[j + 6]) {
                    f = row[j + 5] + ` = ${row[j - 1]}${h4}.substring(${row[j + 1]},${row[j + 3]});`;
                    row[j + 6] = true;
                }
                break;
            case "IfElse":
                if (sourcePortPortID === 'CONDITION ' && !row[j]) {
                    e = h1;
                    row[j] = true;
                } else if (sourcePortPortID === 'THEN : STRING ' && !row[j + 2]) {
                    e = h2;
                    row[j + 2] = true;
                } else if (sourcePortPortID === 'ELSE : STRING ' && !row[j + 4]) {
                    e = h3;
                    row[j + 4] = true;
                }
                if (row[j + 2] && row[j] && row[j + 4] && !row[j + 6]) {
                    f = row[j + 5] + ` = (${row[j - 1]}) ? (${row[j + 1]}) : (${row[j + 3]});`;
                    row[j + 6] = true;
                }
                break;
            case "Round":
            case "Floor":
            case "Ceiling":
            case "AbsoluteValue":
                if (sourcePortPortID === "IN : [NUM] " && !row[j]) {
                    e = h1;
                    row[j] = true;
                }
                f = arithmeticOperationPush2(row, action);
                break;
        }
    }
    return [e, f];
}
