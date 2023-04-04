import {Visitor} from "../../syntax-tree/base-visitor";
import * as Synapse from "../../syntax-tree/syntax-tree-interfaces";
import {MediatorViewState} from "../ViewState/mediator";
import {ConnectorViewState} from "../ViewState/connector";

export class InitVisitor implements Visitor {

    beginVisitSTNode?(node: Synapse.STNode, parent?: Synapse.STNode){

    }

    beginVisitMediator?(node: Synapse.Mediator, parent?: Synapse.STNode) {
        node.viewState = new MediatorViewState();
    }

    endVisitMediator?(node: Synapse.Mediator, parent?: Synapse.STNode) {

    }

    beginVisitConnector?(node: Synapse.Connector, parent?: Synapse.STNode) {
        node.viewState = new ConnectorViewState();
    }

    endVisitConnector?(node: Synapse.Connector, parent?: Synapse.STNode) {

    }
}

export const initVisitor = new InitVisitor();