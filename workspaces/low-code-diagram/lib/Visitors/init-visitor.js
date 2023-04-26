import { MediatorViewState } from "../ViewState/mediator";
import { ConnectorViewState } from "../ViewState/connector";
import { ViewState } from "../ViewState/view-state";
import { ApiViewState } from "../ViewState/api";
import { ProxyViewState } from "../ViewState/proxy";
import { SendViewState } from "../ViewState/send";
import { LogViewState } from "../ViewState/log";
import { ResourceViewState } from "../ViewState/resource";
import { RespondViewState } from "../ViewState/respond";
import { InSequenceViewState } from "../ViewState/in-sequence";
import { OutSequenceViewState } from "../ViewState/out-sequence";
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
    beginVisitApi(node) {
        if (!node.viewState) {
            node.viewState = new ApiViewState();
        }
    }
    beginVisitProxy(node) {
        if (!node.viewState) {
            node.viewState = new ProxyViewState();
        }
    }
    beginVisitInSequence(node) {
        if (!node.viewState) {
            node.viewState = new InSequenceViewState();
        }
    }
    beginVisitOutSequence(node) {
        if (!node.viewState) {
            node.viewState = new OutSequenceViewState();
        }
    }
    beginVisitLog(node) {
        if (!node.viewState) {
            node.viewState = new SendViewState();
        }
    }
    beginVisitResource(node) {
        if (!node.viewState) {
            node.viewState = new LogViewState();
        }
    }
    beginVisitRespond(node) {
        if (!node.viewState) {
            node.viewState = new RespondViewState();
        }
    }
    beginVisitSend(node) {
        if (!node.viewState) {
            node.viewState = new ResourceViewState();
        }
    }
}
export const initVisitor = new InitVisitor();
//# sourceMappingURL=init-visitor.js.map