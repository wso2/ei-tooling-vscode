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

import toJsonSchema = require("to-json-schema");

export function csvToJson(fileContent: string): toJsonSchema.JSONSchema3or4 {
    var schema: any;
    const csvData: string = fileContent;
    const csvRows: string[] = csvData.split('\n');
    const headers: string[] = csvRows[0].split(';');

    const jsonData: any[] = [];
    for(let i = 1; i < csvRows.length; i++) {
        const row: string[] = csvRows[i].split(';');
        const obj: any = {};

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j];
        }

        jsonData.push(obj);
    }
    var jsonObj = jsonData;
    var schema1 = toJsonSchema(jsonObj);
    if(schema1.type === 'array') {
        schema = schema1.items;
    } else {
        schema = schema1;
    }
    return schema;
}
