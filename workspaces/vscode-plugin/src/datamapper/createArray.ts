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

let arrayOutput1: any[][] = [];

export function createArray(outputJSON: any, string1: string): any[][] {
    let string = string1;
    let myArray: any[] = [];

    for (let prop in outputJSON.properties) {
        myArray.length = 0;
        myArray[0] = string;
        let i = 1;
        includePropToArray(outputJSON, myArray, prop, i, string1);
    }

    let arrayOutput2 = arrayOutput1;
    arrayOutput1 = [];
    return arrayOutput2;
}

function includePropToArray(JSONobject: any, array: any[], prop: any, k: number, string1: string) {
    array[k] = prop;
    const str: string = array.join(".");
    arrayOutput1.push([
        str, prop, false, JSONobject.properties[prop].type
    ]);
    var object: any;

    if (JSONobject.properties[prop].type === 'object' || JSONobject.properties[prop].type === 'array') {
        object = JSONobject.properties[prop].type === 'object' ? JSONobject.properties[prop] : JSONobject.properties[prop].items;
        for (let prop in object.properties) {
            includePropToArray(object, array, prop, k + 1, string1);
        }
        for (let j = k; j < array.length; j++) {
            array.length = k + 1;
        }
    }
}
