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

export interface STNode {
    tag: string;
    value?: any;
    parent?: STNode;
    viewState?: any;
    position?: any;
}

export interface Mediator extends STNode {
    children: Mediator[];
}

export interface Connector extends STNode {

}

export interface Api extends STNode {
    children: Resource[];
}

export interface Proxy extends STNode {
    children: STNode[];
}

export interface InSequence extends STNode {
    children: STNode[];
}

export interface OutSequence extends STNode {
    children: STNode[];
}

export interface Resource extends STNode {
    children: STNode[];
}

export interface Send extends STNode {
    children: STNode[];
}

export interface Respond extends STNode {
    children: STNode[];
}

export interface Log extends STNode {
    children: STNode[];
}

export interface NodePosition {
    startLine?: number;
    startColumn?: number;
    endLine?: number;
    endColumn?: number;
}
