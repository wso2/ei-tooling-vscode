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
}
//# sourceMappingURL=sizing-visitor.js.map