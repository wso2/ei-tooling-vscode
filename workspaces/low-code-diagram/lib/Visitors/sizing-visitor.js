export const DEFAULT_SHAPE_DIMENSION = 100;
export const COMPONENT_GAP = 20;
export const NAME_GAP = 5;
export const NAME_HEIGHT = 13;
export class SizingVisitor {
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
                        // width += childVS.bBox.w + COMPONENT_GAP;
                        // if (height < childVS.bBox.h) {
                        //     height = childVS.bBox.h;
                        // }
                    }
                });
                viewState.bBox.h = height;
                viewState.bBox.w = width + COMPONENT_GAP;
                // viewState.bBox.w = width;
                // viewState.bBox.h = height + COMPONENT_GAP;
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
                        // width += childVS.bBox.w + COMPONENT_GAP;
                        // if (height < childVS.bBox.h) {
                        //     height = childVS.bBox.h;
                        // }
                    }
                });
                viewState.bBox.h = height;
                viewState.bBox.w = width + COMPONENT_GAP;
                // viewState.bBox.w = width;
                // viewState.bBox.h = height + COMPONENT_GAP;
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
                // let width = 0;
                let width = COMPONENT_GAP;
                node.children.forEach(child => {
                    const childVS = child.viewState;
                    if (childVS !== undefined) {
                        // height += childVS.bBox.h + COMPONENT_GAP;
                        // if (width < childVS.bBox.w) {
                        //     width += childVS.bBox.w;
                        // }
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h + COMPONENT_GAP;
                        }
                    }
                });
                // viewState.bBox.h = height;
                // viewState.bBox.w = width + COMPONENT_GAP;
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
                        // height += childVS.bBox.h + COMPONENT_GAP;
                        // if (width < childVS.bBox.w) {
                        //     width += childVS.bBox.w;
                        // }
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                // viewState.bBox.h = height;
                // viewState.bBox.w = width + COMPONENT_GAP;
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
                        // width += childVS.bBox.w + COMPONENT_GAP;
                        // if (height < childVS.bBox.h) {
                        //     height = childVS.bBox.h;
                        // }
                    }
                });
                viewState.bBox.h = height;
                viewState.bBox.w = width + COMPONENT_GAP * 2;
                // viewState.bBox.w = width;
                // viewState.bBox.h = height + COMPONENT_GAP;
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
                        // height += childVS.bBox.h + COMPONENT_GAP;
                        // if (width < childVS.bBox.w) {
                        //     width += childVS.bBox.w;
                        // }
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                });
                // viewState.bBox.h = height;
                // viewState.bBox.w = width + COMPONENT_GAP;
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