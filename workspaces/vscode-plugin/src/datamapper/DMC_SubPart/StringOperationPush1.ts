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

export function StringOperationPush1(row: any[], action: {}): string {
    if (row[5] || !row[3]) {
        return "";
    }
    let f = "";
    let g = ".toString().";
    switch (action) {
        case "StringToBoolean":
            f = row[2] + g + `toLowerCase() === true;`;
            break;
        case "StringToNumber":
            f = `Number(${row[2]});`;
            break;
        case "Trim":
            f = row[2] + g + `trim();`;
            break;
        case "StringLength":
            f = row[2] + g + `length();`;
            break;
        case "LowerCase":
        case "UpperCase":
            f = row[2] + g + `to${action}();`;
            break;
        case "Split":
            f = row[2] + g + `split(" ");`;
            break;
        case "NOT":
            f = `!${row[2]};`;
            break;
    }
    row[5] = true;
    return row[4] + " = " + f;
}