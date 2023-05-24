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
export const DEFAULT_SHAPE_DIMENSION = 70;
export const COMPONENT_GAP = 20;
export class SizingVisitor {
    endVisitMediator(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitApi(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                        if (width < childVS.bBox.w) {
                            width += childVS.bBox.w;
                        }
                    }
                });
                viewState.bBox.h = height;
                viewState.bBox.w = width + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitProxy(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                        if (width < childVS.bBox.w) {
                            width += childVS.bBox.w;
                        }
                    }
                });
                viewState.bBox.h = height;
                viewState.bBox.w = width + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitInSequence(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h + COMPONENT_GAP;
                        }
                    }
                });
                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitOutSequence(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitResource(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                        if (width < childVS.bBox.w) {
                            width += childVS.bBox.w;
                        }
                    }
                });
                viewState.bBox.h = height;
                viewState.bBox.w = width + COMPONENT_GAP * 2;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitLog(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitRespond(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitSend(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitPublish(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitScript(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitSequence(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitSmooks(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitSpring(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitStore(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitTransaction(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitURLrewrite(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitXQuery(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitXSLT(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitBam(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitBean(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitBuilder(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitCallout(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitCallTemplate(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitClass(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitCommand(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitConditionalRouter(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitDataMapper(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitDataServiceCall(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitDBLookup(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitDBReport(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitDrop(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitEjb(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitEnqueue(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitEnrich(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitEvent(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitFastXSLT(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitFault(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitHeader(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitJsonTransform(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitLoopBack(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitNtlm(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitOauth(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitPayloadFactory(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitProperty(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitPropertyGroup(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                });
                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            }
            else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitForEach(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitIterate(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitRule(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitSwitch(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitThrottle(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitValidate(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitAggregate(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitCache(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitCall(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitClone(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitEntitlement(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
    endVisitFilter(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            }
            else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
}
//# sourceMappingURL=sizing-visitor.js.map