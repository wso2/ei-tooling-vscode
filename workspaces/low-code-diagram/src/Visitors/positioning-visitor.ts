import {Api, InSequence, Log, Mediator, OutSequence, Proxy, Resource, Send, Visitor} from "@wso2-ei/syntax-tree";
import { MediatorViewState } from "../ViewState";
import {COMPONENT_GAP} from "./sizing-visitor";
import {ApiViewState} from "../ViewState/api";
import {ProxyViewState} from "../ViewState/proxy";
import {LogViewState} from "../ViewState/log";
import {ResourceViewState} from "../ViewState/resource";
import { OutSequenceViewState } from "../ViewState/out-sequence";
import { InSequenceViewState } from "../ViewState/in-sequence";
import { RespondViewState } from "../ViewState/respond";

export class PositioningVisitor implements Visitor {

    beginVisitMediator(el: Mediator) {
        if (el.viewState) {
            const viewState: MediatorViewState = el.viewState as MediatorViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (el.children === undefined) {
                return;
            }

            el.children.forEach((child, index) => {
                const childVS: MediatorViewState = child.viewState as MediatorViewState;

                // childVS.shapeName.y = height;
                // childVS.shapeName.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;

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
            })
        }
    }

    beginVisitApi?(node: Api) {
        if (node.viewState) {
            const viewState: ApiViewState = node.viewState as ApiViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            let width = viewState.bBox.x ;

            node.children.forEach((child) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = width + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                width += viewState.bBox.x + childVS.bBox.w + COMPONENT_GAP

                // set worker line positions
                // switch (index) {
                //     case 0:
                //         viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                //         viewState.workerLine.y1 = height;
                //         viewState.workerLine.x2 = viewState.workerLine.x1;
                //         viewState.workerLine.y2 = viewState.workerLine.y1;
                //         break;
                //     case node.children.length - 1:
                //         viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                //         viewState.workerLine.y2 = height;
                //         break;
                //     default:
                // }

                // height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

    beginVisitProxy?(node: Proxy) {
        if (node.viewState) {
            const viewState: ProxyViewState = node.viewState as ProxyViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

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
            })
        }
    }


    beginVisitInSequence?(node: InSequence) {
        if (node.viewState) {
            const viewState: InSequenceViewState = node.viewState as InSequenceViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

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
            })
        }
    }

    beginVisitOutSequence?(node: OutSequence) {
        if (node.viewState) {
            const viewState: OutSequenceViewState = node.viewState as OutSequenceViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        viewState.workerLine.x2 = viewState.workerLine.x1;
                        viewState.workerLine.y2 = height + COMPONENT_GAP;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }

                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

    beginVisitLog?(node: Send) {
        if (node.viewState) {
            const viewState: LogViewState = node.viewState as LogViewState;
            // const shapeName = viewState.shapeName;
            // shapeName.x = 10;
            // shapeName.y = 10;
            console.log("r: " + viewState.bBox.r);
            console.log("x: " + viewState.bBox.x);
            console.log("y: " + viewState.bBox.y);
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
            // viewState.bBox.x = shapeName.h;
            // viewState.bBox.y = 0;

            // let height = viewState.bBox.x + COMPONENT_GAP;
            // node.children.forEach((child, index) => {
            //     const childVS: ShapeViewState = child.viewState as ShapeViewState;
            //
            //     childVS.shapeName.y = height;
            //     childVS.shapeName.x = viewState.bBox.r - (childVS.bBox.w / 2);
            //
            //     childVS.bBox.x = viewState.bBox.r - (childVS.bBox.w / 2);
            //     childVS.bBox.y = height + childVS.shapeName.h;
            //
            //     // set worker line positions
            //     switch (index) {
            //         case 0:
            //             viewState.workerLine.x1 = viewState.bBox.r;
            //             viewState.workerLine.y1 = height + childVS.shapeName.h;
            //             break;
            //         case node.children.length - 1:
            //             viewState.workerLine.x2 = viewState.bBox.r;
            //             viewState.workerLine.y2 = height + childVS.shapeName.h;
            //             break;
            //         default:
            //     }
            //
            //
            //     height += childVS.bBox.h + COMPONENT_GAP + childVS.shapeName.h;
            // })
        }
    }

    beginVisitRespond?(node: Send) {
        if (node.viewState) {
            const viewState: RespondViewState = node.viewState as RespondViewState;
            // const shapeName = viewState.shapeName;
            // shapeName.x = 10;
            // shapeName.y = 10;
            console.log("r: " + viewState.bBox.r);
            console.log("x: " + viewState.bBox.x);
            console.log("y: " + viewState.bBox.y);
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitResource?(node: Log) {
        if (node.viewState) {
            const viewState: LogViewState = node.viewState as LogViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            let width = viewState.bBox.x ;

            node.children.forEach((child) => {
                const childVS = child.viewState as any;

                // childVS.bBox.x = width + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.x = width + COMPONENT_GAP;
                childVS.bBox.y = height;

                width += viewState.bBox.x + childVS.bBox.w + COMPONENT_GAP

                // // set worker line positions
                // switch (index) {
                //     case 0:
                //         viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                //         viewState.workerLine.y1 = height;
                //         break;
                //     case node.children.length - 1:
                //         viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                //         viewState.workerLine.y2 = height;
                //         break;
                //     default:
                // }

                // height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

    beginVisitSend?(node: Resource) {
        if (node.viewState) {
            const viewState: ResourceViewState = node.viewState as ResourceViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

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
            })
        }
    }

}