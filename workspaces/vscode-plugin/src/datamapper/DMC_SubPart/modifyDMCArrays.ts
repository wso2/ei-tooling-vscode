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

export function modifyDMCArrays(outputDMCArray: string[], inputDMCArray: string[]): string {
    const inputdmc = inputDMCArray.filter(j => j.length !== 0).join('\n');
    const outputdmc = outputDMCArray.join('\n');
    const content = `map_S_Input_S_Output = function(){\n\n${inputdmc}\n\n${outputdmc}\n\nreturn Output;\n}`;
    return content;
}
