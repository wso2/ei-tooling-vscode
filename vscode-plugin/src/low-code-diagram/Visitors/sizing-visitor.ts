import { Visitor }  from '../../syntax-tree';
import * as Synapse from "../../syntax-tree/syntax-tree-interfaces";
import {DefaultConfig} from "./default";
import {STNode} from "../../syntax-tree/syntax-tree-interfaces";
import {ViewState} from "../ViewState/view-state";
import {MediatorViewState} from "../ViewState/mediator";
import {ConnectorViewState} from "../ViewState/connector";

export class SizingVisitor implements Visitor {

    private getConnectorSize() {
        let size = 0;
        return size;
    }

    private getConnectorGap() {
        // const rw = (this.getConnectorSize() * (DefaultConfig.connectorEPWidth)) + (this.foundParentConnectors.size > 0 ? (this.getConnectorSize() === 1 ? DefaultConfig.epGap : 0) : DefaultConfig.epGap);
        const rw = this.getConnectorSize() * DefaultConfig.connectorEPWidth + DefaultConfig.epGap;
        if (this.getConnectorSize() > 0) {
            return rw;
        } else {
            return 0;
        }
    }

    endVisitSTNode?(node: Synapse.STNode, parent?: Synapse.STNode) {
        if (!node.viewState) {
            return;
        }
        // this.sizeStatement(node);
    }

    beginVisitMediator?(node: Synapse.Mediator, parent?: Synapse.STNode) {

    }

    endVisitMediator?(node: Synapse.Mediator, parent?: Synapse.STNode) {

    }

    beginVisitConnector?(node: Synapse.Connector, parent?: Synapse.STNode) {

    }

    endVisitConnector?(node: Synapse.Connector, parent?: Synapse.STNode) {

    }

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