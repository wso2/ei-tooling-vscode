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

import { Uri } from 'vscode';
import { writeFile } from "fs";
import { join } from "path";
import { xmlToJson } from "./dataMapperFileConversion/xmlToJson";
import { jsonToSchema } from "./dataMapperFileConversion/jsonToSchema";
import { csvToJson } from "./dataMapperFileConversion/csvToJson";
import { createArray } from "./createArray";

interface Details {
  $id: string;
  $schema: string;
  title: string;
  type: string;
  properties?: object;
  items?: object;
}

export default class datamapperFileUpload {

  static arrayInput: any[][];
  static arrayOutput: any[][];

  public static handleFileUpload(registryPath: Uri, fileContent: string, fileName: string, extension: string, callback: (message: any) => void) {
    let arrayOutput1: any[][] = [];
    var fileContent1 = "";
    var schema: any;
    var filePath: string;

    switch (extension) {
      case 'xml': fileContent1 = xmlToJson(fileContent);
        schema = jsonToSchema(fileContent1);
        break;
      case 'json': schema = jsonToSchema(fileContent);
        break;
      case 'jsonschema': schema = JSON.parse(fileContent);
        break;
      case 'csv': schema = csvToJson(fileContent);
        break;
      case 'xsd':
        const Xsd2JSONSchema = require('xsd2jsonschema').Xsd2JsonSchema;
        const xs2js = new Xsd2JSONSchema();
        const convertedSchemas = xs2js.processAllSchemas({
          schemas: { 'hello_world.xsd': fileContent },
        });
        schema = convertedSchemas['hello_world.xsd'].getJsonSchema();
        break;
    }

    var schemaJson = JSON.stringify(schema);

    var node: string = "";
    if (fileName.endsWith('Input')) {
      node = 'Input';
    } else if (fileName.endsWith('Output')) {
      node = 'Output';
    }

    let json1: Details = JSON.parse(schemaJson);
    arrayOutput1 = createArray(json1, node);
    if (node === 'Input') {
      this.arrayInput = arrayOutput1;
    } else if (node === 'Output') {
      this.arrayOutput = arrayOutput1;
    }

    if (registryPath) {
      filePath = join(registryPath.fsPath, `${fileName}Schema.json`);
      writeFile(filePath, schemaJson, (err) => {
        if (!err) {
          if (node === 'Input') {
            callback({ type: 'InputSchema', value: schema });
          } else {
            callback({ type: 'OutputSchema', value: schema });
          }
        }
      })
    }
  }

}
