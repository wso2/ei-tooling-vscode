import {Api, InSequence, Log, Mediator, OutSequence, Proxy, Resource, Respond, Send, Visitor} from '@wso2-ei/syntax-tree';
import { MediatorViewState } from '../ViewState';
import { ApiViewState } from '../ViewState/api';
import { InSequenceViewState } from '../ViewState/in-sequence';
import { LogViewState } from '../ViewState/log';
import { OutSequenceViewState } from '../ViewState/out-sequence';
import { ProxyViewState } from '../ViewState/proxy';
import { ResourceViewState } from '../ViewState/resource';
import { RespondViewState } from '../ViewState/respond';
import { SendViewState } from '../ViewState/send';

export const DEFAULT_SHAPE_DIMENSION = 50;
export const COMPONENT_GAP = 20;
export const NAME_GAP = 5;
export const NAME_HEIGHT = 13;

export class SizingVisitor implements Visitor {

    // private getConnectorSize() {
    //     let size = 0;
    //     return size;
    // }

    // private getConnectorGap() {
    //     // const rw = (this.getConnectorSize() * (DefaultConfig.connectorEPWidth)) + (this.foundParentConnectors.size > 0 ? (this.getConnectorSize() === 1 ? DefaultConfig.epGap : 0) : DefaultConfig.epGap);
    //     const rw = this.getConnectorSize() * DefaultConfig.connectorEPWidth + DefaultConfig.epGap;
    //     if (this.getConnectorSize() > 0) {
    //         return rw;
    //     } else {
    //         return 0;
    //     }
    // }

    // endVisitSTNode?(node: STNode) {
    //     if (!node.viewState) {
    //         return;
    //     }
    //     // this.sizeStatement(node);
    // }
    //
    // beginVisitMediator?(node: Mediator) {
    //
    // }

    endVisitMediator?(node: Mediator) {
        if (node.viewState) {
            const viewState: MediatorViewState = node.viewState as MediatorViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS: MediatorViewState = child.viewState as MediatorViewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitApi?(node: Api) {
        if (node.viewState) {
            const viewState: ApiViewState = node.viewState as ApiViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                        if (width < childVS.bBox.w) {
                            width += childVS.bBox.w;
                        }
                    }
                })

                viewState.bBox.h = height;
                viewState.bBox.w = width + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitProxy?(node: Proxy) {
        if (node.viewState) {
            const viewState: ProxyViewState = node.viewState as ProxyViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                        if (width < childVS.bBox.w) {
                            width += childVS.bBox.w;
                        }
                    }
                })

                viewState.bBox.h = height;
                viewState.bBox.w = width + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitInSequence?(node: Resource) {
        if (node.viewState) {
            const viewState: InSequenceViewState = node.viewState as InSequenceViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                        if (width < childVS.bBox.w) {
                            width += childVS.bBox.w;
                        }
                    }
                })

                viewState.bBox.h = height;
                viewState.bBox.w = width + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitOutSequence?(node: InSequence) {
        if (node.viewState) {
            const viewState: OutSequenceViewState = node.viewState as OutSequenceViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                        if (width < childVS.bBox.w) {
                            width += childVS.bBox.w;
                        }
                    }
                })

                viewState.bBox.h = height;
                viewState.bBox.w = width + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitLog?(node: OutSequence) {
        if (node.viewState) {
            const viewState: LogViewState = node.viewState as LogViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitRespond?(node: Respond) {
        if (node.viewState) {
            const viewState: RespondViewState = node.viewState as RespondViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitResource?(node: Send) {
        if (node.viewState) {
            const viewState: ResourceViewState = node.viewState as ResourceViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                        if (width < childVS.bBox.w) {
                            width += childVS.bBox.w;
                        }
                    }
                })

                viewState.bBox.h = height;
                viewState.bBox.w = width + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitSend?(node: Log) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as SendViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                        if (width < childVS.bBox.w) {
                            width += childVS.bBox.w;
                        }
                    }
                })

                viewState.bBox.h = height;
                viewState.bBox.w = width + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

}