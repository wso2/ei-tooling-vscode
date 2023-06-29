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

import { DataMapperNodeFactory } from "./DataMapperNodes/DataMapperNodeFactory";
import { InputsNodeFactory } from "./InputsNodes/InputsNodeFactory";
import { JoinNodeFactory } from "./Boolean_StringJoin/JoinNodeFactory";
import { SplitNodeFactory } from "./String/Split/SplitNodeFactory";
import { SubStringNodeFactory } from "./String/SubString/SubStringNodeFactory";
import { TransformNodeFactory } from "./String_Transform_TypeConversion/TransformNodeFactory";

export const nodeFactories = [
    new InputsNodeFactory(),
    new DataMapperNodeFactory(),
    new JoinNodeFactory(),
    new TransformNodeFactory(),
    new SplitNodeFactory(),
    new SubStringNodeFactory(),
];
