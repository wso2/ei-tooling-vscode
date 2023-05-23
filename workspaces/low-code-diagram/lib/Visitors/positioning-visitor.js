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
import { COMPONENT_GAP } from "./sizing-visitor";
export class PositioningVisitor {
    beginVisitMediator(el) {
        if (el.viewState) {
            const viewState = el.viewState;
            let height = viewState.bBox.y + COMPONENT_GAP;
            if (el.children === undefined) {
                return;
            }
            el.children.forEach((child, index) => {
                const childVS = child.viewState;
                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;
                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case el.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }
                height += childVS.bBox.h + COMPONENT_GAP;
            });
        }
    }
    beginVisitApi(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }
            let width = viewState.bBox.x;
            node.children.forEach((child) => {
                const childVS = child.viewState;
                childVS.bBox.x = width + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;
                width += viewState.bBox.x + childVS.bBox.w + COMPONENT_GAP;
            });
        }
    }
    beginVisitProxy(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }
            node.children.forEach((child, index) => {
                const childVS = child.viewState;
                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;
                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }
                height += childVS.bBox.h + COMPONENT_GAP;
            });
        }
    }
    beginVisitInSequence(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            // let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }
            let width = viewState.bBox.x;
            node.children.forEach((child, index) => {
                const childVS = child.viewState;
                childVS.bBox.x = width + COMPONENT_GAP;
                childVS.bBox.y = viewState.bBox.y + viewState.bBox.h / 2 - childVS.bBox.h / 2;
                width = childVS.bBox.x + childVS.bBox.w;
                if (index == 0) {
                    viewState.workerLine.x1 = viewState.bBox.x;
                    viewState.workerLine.y1 = childVS.bBox.y + childVS.bBox.h / 2;
                }
                if (index == node.children.length - 1) {
                    viewState.workerLine.x2 = childVS.bBox.x;
                    viewState.workerLine.y2 = childVS.bBox.y + childVS.bBox.h / 2;
                }
            });
        }
    }
    beginVisitOutSequence(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children === undefined) {
                return;
            }
            let width = viewState.bBox.x;
            node.children.forEach((child, index) => {
                const childVS = child.viewState;
                childVS.bBox.x = width + COMPONENT_GAP;
                childVS.bBox.y = viewState.bBox.y + viewState.bBox.h / 2 - childVS.bBox.h / 2;
                width = childVS.bBox.x + childVS.bBox.w;
                if (index == 0) {
                    viewState.workerLine.x1 = viewState.bBox.x;
                    viewState.workerLine.y1 = childVS.bBox.y + childVS.bBox.h / 2;
                }
                if (index == node.children.length - 1) {
                    viewState.workerLine.x2 = childVS.bBox.x;
                    viewState.workerLine.y2 = childVS.bBox.y + childVS.bBox.h / 2;
                }
            });
        }
    }
    beginVisitLog(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitRespond(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitResource(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            if (node.children === undefined) {
                return;
            }
            let height = viewState.bBox.y;
            let width = viewState.bBox.x;
            node.children.forEach((child) => {
                const childVS = child.viewState;
                childVS.bBox.x = width + COMPONENT_GAP;
                childVS.bBox.y = height + COMPONENT_GAP;
                height = childVS.bBox.y + childVS.bBox.h;
            });
        }
    }
    beginVisitSend(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }
            node.children.forEach((child, index) => {
                const childVS = child.viewState;
                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;
                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }
                height += childVS.bBox.h + COMPONENT_GAP;
            });
        }
    }
}
//# sourceMappingURL=positioning-visitor.js.map