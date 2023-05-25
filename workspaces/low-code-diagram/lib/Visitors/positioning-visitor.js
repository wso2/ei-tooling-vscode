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
    beginVisitProperty(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitPropertyGroup(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitPublish(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitScript(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitSequence(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitSmooks(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitSpring(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitStore(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitTransaction(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitURLrewrite(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitXQuery(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitXSLT(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitBam(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitBean(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitBuilder(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitCallout(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitCallTemplate(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitClass(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitCommand(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitConditionalRouter(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitDataMapper(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitDataServiceCall(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitDBLookup(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitDBReport(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitDrop(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitEjb(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitEnqueue(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitEnrich(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitEvent(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitFastXSLT(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitFault(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitHeader(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitJsonTransform(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitLoopBack(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitNtlm(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitOauth(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitPayloadFactory(node) {
        if (node.viewState) {
            const viewState = node.viewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitIterate(node) {
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
    beginVisitRule(node) {
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
    beginVisitSwitch(node) {
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
    beginVisitThrottle(node) {
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
    beginVisitValidate(node) {
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
    beginVisitAggregate(node) {
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
    beginVisitCache(node) {
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
    beginVisitCall(node) {
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
    beginVisitClone(node) {
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
    beginVisitEntitlement(node) {
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
    beginVisitFilter(node) {
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
    beginVisitForEach(node) {
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