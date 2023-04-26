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

import { Visitor } from './base-visitor';
import { STNode } from './syntax-tree-interfaces';

const metaNodes = ['viewState', 'position', 'parent'];

export function traversNode(node: STNode, visitor: Visitor, parent?: STNode) {
    let beginVisitFn: any = (visitor as any)[`beginVisit${node.tag}`];
    if (!beginVisitFn) {
        beginVisitFn = visitor.beginVisitSTNode && visitor.beginVisitSTNode;
    }

    if (beginVisitFn) {
        beginVisitFn.bind(visitor)(node, parent);
    }

    const keys = Object.keys(node);
    keys.forEach((key) => {
        if (metaNodes.includes(key)) {
            return;
        }

        const childNode = (node as any)[key] as any;
        if (Array.isArray(childNode)) {
            childNode.forEach((elementNode) => {
                if (!elementNode?.tag) {
                    return;
                }

                traversNode(elementNode, visitor, node);
            });
            return;
        }

        if (!childNode.tag) {
            return;
        }

        traversNode(childNode, visitor, node);
    });

    let endVisitFn: any = (visitor as any)[`endVisit${node.tag}`];
    if (!endVisitFn) {
        endVisitFn = visitor.endVisitSTNode && visitor.endVisitSTNode;
    }

    if (endVisitFn) {
        endVisitFn.bind(visitor)(node, parent);
    }
}

export async function traversNodeAsync(node: STNode, visitor: Visitor, parent?: STNode) {
    let beginVisitFn: any = (visitor as any)[`beginVisit${node.tag}`];
    if (!beginVisitFn) {
        beginVisitFn = visitor.beginVisitSTNode && visitor.beginVisitSTNode;
    }

    if (beginVisitFn) {
        await beginVisitFn.bind(visitor)(node, parent);
    }

    const keys = Object.keys(node);
    for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        if (metaNodes.includes(key)) {
            return;
        }

        const childNode = (node as any)[key] as any;
        if (Array.isArray(childNode)) {
            for (let i = 0; i < childNode.length; i++) {
                const elementNode = childNode[i];
                if (!elementNode?.tag) {
                    return;
                }
                await traversNodeAsync(elementNode, visitor, node);

            }
            return;
        }
        if (!childNode.tag) {
            return;
        }
        await traversNodeAsync(childNode, visitor, node);
    }

    let endVisitFn: any = (visitor as any)[`endVisit${node.tag}`];
    if (!endVisitFn) {
        endVisitFn = visitor.endVisitSTNode && visitor.endVisitSTNode;
    }

    if (endVisitFn) {
        await endVisitFn.bind(visitor)(node, parent);
    }
}
