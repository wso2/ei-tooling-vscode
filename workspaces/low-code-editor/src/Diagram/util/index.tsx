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

import * as ShapeComponents from '../components/index';
import {STNode, Visitor} from "@wso2-ei/syntax-tree";
import {InitVisitor} from "@wso2-ei/low-code-diagram";
import {SizingVisitor} from "@wso2-ei/low-code-diagram";
import {PositioningVisitor} from "@wso2-ei/low-code-diagram";

export function getComponent(type: string, args: any) {
    console.log(ShapeComponents);
    const ShapeComponent = (ShapeComponents as any)[type];

    if (ShapeComponent) {
        return <ShapeComponent {...args} />
    }

    return <></>;
}

export function sizingAndPositioning(st: STNode): STNode {
    traverse(st, new InitVisitor());
    traverse(st, new SizingVisitor());
    traverse(st, new PositioningVisitor());
    const clone = { ...st };
    return clone;
}

export function recalculateSizingAndPositioning(st: STNode) {
    traverse(st, new SizingVisitor());
    traverse(st, new PositioningVisitor());
    const clone = { ...st };
    return clone;
}

export function traverse(el: STNode, visitor: Visitor): void {
    let str2 = el.tag;
    if (el.tag !== undefined) {
        str2 = el.tag.charAt(0).toUpperCase() + el.tag.slice(1);
    }

    let beginFunction = (visitor as any)[`beginVisit${str2}`];

    if (!beginFunction) { // check if specific visitor exist for shape
        beginFunction = visitor.beginVisitSTNode; // asign the default visit function
    }

    if (beginFunction) {
        beginFunction.bind(visitor)(el);
    }

    const keys = Object.keys(el);

    keys.forEach((key: string) => {
        const childEl: any = (el as any)[key];

        if (Array.isArray(childEl)) { // if the child is a type of collection
            childEl.forEach(obj => { // visit collection children
                if (!obj.tag) {
                    return;
                }

                traverse(obj, visitor);
            });
        }

        if (!childEl.tag) {
            return;
        }

        traverse(childEl, visitor);
    });


    let endFunction = (visitor as any)[`endVisit${str2}`];

    if (!endFunction) { // check if specific visit function exist for the element type
        endFunction = visitor.endVisitSTNode;
    }

    if (endFunction) {
        endFunction.bind(visitor)(el);
    }
}

export function getSTComponent(node: any): React.ReactElement {
    const ChildComp = (ShapeComponents as any)[node.tag];
    return <ChildComp model={node} />;
}
