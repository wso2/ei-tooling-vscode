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
export function checkTransformDataArray(actionnode: any, actionID: any, i: any, transformDataArray: any[][]): any[] {
    if (transformDataArray.filter(item => item[1] === actionID).length !== 0) {
        return [];
    }
    
    let e = [];
    let f = `${actionnode}_${i + 1}_`;
    let g = f + "Input";
    e[0] = actionnode;
    e[1] = actionID;
    e[3] = false;

    switch (actionnode) {
        case "Split":
        case "UpperCase":
        case "LowerCase":
        case "Trim":
        case "StringLength":
        case "StringToNumber":
        case "ToString":
        case "StringToBoolean":
            e[2] = g;
            break;
        case "Concat":
            e[2] = f + "0";
            e[4] = f + "1";
            e[5] = false;
            break;
        case "StartsWith":
        case "EndsWith":
        case "Match":
            e[2] = g;
            e[4] = f + "Pattern";
            e[5] = false;
            break;
        case "Replace":
            e[2] = g;
            e[4] = f + "Target";
            e[5] = false;
            e[6] = f + "ReplaceWith";
            e[7] = false;
            break;
        case "SubString":
            e[2] = g;
            e[4] = f + "StartIndex";
            e[5] = false;
            e[6] = f + "length";
            e[7] = false;
            break;
        case "IfElse":
            e[2] = f + "Condition";
            e[4] = f + "Then";
            e[5] = false;
            e[6] = f + "Else";
            e[7] = false;
            break;
        case "AND":
        case "OR":
        case "Add":
        case "Multiply":
        case "Min":
        case "Max":
        case "Compare":
            e[2] = g + "_1";
            e[4] = g + "_2";
            e[5] = false;
            break;
        case "Subtract":
            e[2] = g;
            e[4] = f + "Subtrahend";
            e[5] = false;
            break;
        case "Division":
            e[2] = g;
            e[4] = f + "Divisor";
            e[5] = false;
            break;
        case "Set Precision":
            e[0] = "SetPrecision";
            e[2] = g;
            e[4] = f + "NumberOfDigits";
            e[5] = false;
            break;
        case "NOT":
        case "Round":
        case "Ceiling":
        case "Floor":
        case "AbsoluteValue":
            e[2] = g;
            break;
        default:
            break;
    }
    e.push(`${actionnode === "Set Precision" ? "SetPrecision" : actionnode}_${i + 1}_Output`);
    e.push(false);
    return e;
}
