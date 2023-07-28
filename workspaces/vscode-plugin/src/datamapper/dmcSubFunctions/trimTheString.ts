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
There are two functions in the file.
First function will crop the string from the begining to the colon.
Second function will crop the string from the colon to the end.
*/

export function trimTheStringUptoColon(str: {}): string {
    let str1 = str.toString();
    return str1.substring(0, str1.indexOf(" : "));
}

export function trimTheStringFromColumnToEnd(str: {}): string {
    let str1 = str.toString();
    return str1.substring(str1.indexOf(" : ") + 1, str1.length);
}
