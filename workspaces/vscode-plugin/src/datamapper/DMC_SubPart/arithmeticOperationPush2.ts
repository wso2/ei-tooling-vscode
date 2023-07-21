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

export function arithmeticOperationPush2(row: any[], action: {}): string {
    if (row[5] || !row[3]) {
        return "";
    }
    let f = "";
    switch (action) {
        case "Round": f = `round`;
            break;
        case "Floor": f = `floor`;
            break;
        case "Ceiling": f = `ceil`;
            break;
        case "AbsoluteValue": f = `abs`;
            break;
    }
    row[5] = true;
    return row[4] + ` = Math.` + f + `(${row[2]});`;
}