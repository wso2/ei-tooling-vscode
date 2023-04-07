import {Mediator, Visitor }  from '@wso2-ei/syntax-tree';
import { MediatorViewState } from '../ViewState';
// import { MediatorViewState } from '../ViewState';
// import * as Synapse from "@wso2-ei/syntax-tree";
// import {DefaultConfig} from "./default";

export const DEFAULT_SHAPE_DIMENSION = 100;
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

    // beginVisitConnector?(node: Synapse.Connector) {
    //
    // }
    //
    // endVisitConnector?(node: Synapse.Connector) {
    //
    // }
    //
    // endVisitSquare(el: Square) {
    //     if (el.viewState) {
    //         const viewState: SquareViewState = el.viewState as SquareViewState;
    //         viewState.shapeName.h = NAME_GAP + NAME_HEIGHT;
    //
    //         if (el.children.length > 0) {
    //             let height = COMPONENT_GAP;
    //
    //             el.children.forEach(child => {
    //                 const childVS: ShapeViewState = child.viewState as ShapeViewState;
    //                 height += childVS.bBox.h + childVS.shapeName.h + COMPONENT_GAP;
    //             })
    //
    //             viewState.bBox.h = height;
    //             viewState.bBox.w = height;
    //         } else {
    //             viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
    //             viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
    //         }
    //     }
    // }
    //
    // private sizeStatement(node: STNode) {
    //     const viewState: ViewState = node.viewState;
    //
    //     if (viewState instanceof MediatorViewState) {
    //
    //     } else if (viewState instanceof ConnectorViewState) {
    //         viewState.dataProcess.h = PROCESS_SVG_HEIGHT;
    //
    //         viewState.dataProcess.w = PROCESS_SVG_WIDTH;
    //         viewState.dataProcess.lw = PROCESS_SVG_WIDTH / 2;
    //         viewState.dataProcess.rw = PROCESS_SVG_WIDTH / 2;
    //
    //     }
    // }

}