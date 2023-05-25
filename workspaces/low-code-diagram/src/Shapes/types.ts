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

import {ViewState} from "../ViewState";

export enum ShapeType {
    CIRCLE = 'Circle',
    TRIANGLE = 'Triangle',
    SQUARE = 'Square',
}

export interface Shape {
    name: string;
    type: string;
    tag: string;
    viewState: ViewState;
    start: number;
    end: number;
    startTagOpenOffset: number;
    startTagOffOffset: number;
    endTagOpenOffset: number;
    endTagOffOffset: number;
    hasTextNode: boolean;
    selfClosed: boolean;

}

export interface Square extends Shape {
    children: Square[] | Circle[];
}

export interface Circle extends Shape {
    children: Square[];
}
