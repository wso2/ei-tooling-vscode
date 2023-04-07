import { MediatorViewState } from "../ViewState/mediator";
import { ConnectorViewState } from "../ViewState/connector";
import { ViewState } from "../ViewState/view-state";
export class InitVisitor {
    beginVisitSTNode(node) {
        if (!node.viewState) {
            node.viewState = new ViewState();
        }
    }
    beginVisitMediator(node) {
        if (!node.viewState) {
            node.viewState = new MediatorViewState();
        }
    }
    beginVisitConnector(node) {
        if (!node.viewState) {
            node.viewState = new ConnectorViewState();
        }
    }
}
export const initVisitor = new InitVisitor();
//# sourceMappingURL=init-visitor.js.map