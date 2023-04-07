import {Visitor} from "@wso2-ei/syntax-tree";
import * as Synapse from "@wso2-ei/syntax-tree";
import {MediatorViewState} from "../ViewState/mediator";
import {ConnectorViewState} from "../ViewState/connector";
import {ViewState} from "../ViewState/view-state";

export class InitVisitor implements Visitor {

    beginVisitSTNode?(node: Synapse.STNode){
        if (!node.viewState) {
            node.viewState = new ViewState();
        }
    }

    beginVisitMediator?(node: Synapse.Mediator) {
        if (!node.viewState) {
            node.viewState = new MediatorViewState();
        }
    }

    beginVisitConnector?(node: Synapse.Connector) {
        if (!node.viewState) {
            node.viewState = new ConnectorViewState();
        }
    }
}

export const initVisitor = new InitVisitor();