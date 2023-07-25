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

export function StringOperationPush2(row: any[], action: {}, j: integer, h4: string): string {
    if (!row[j + 2] || !row[j] || row[j + 4]) {
        return "";
    }
    let f = "";
    let action2 = action.toString().charAt(0).toLowerCase() + action.toString().slice(1);
    if (action === "Concat") {
        f = ".";
    }
    row[j + 4] = true;
    return `${row[j + 3]} = ${row[j - 1]}${h4}.${action2}` + f + `(${row[j + 1]}${h4});`;
}