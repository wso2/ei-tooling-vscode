import {Api, InSequence, Log, Mediator, OutSequence, Proxy, Resource, Send, Visitor, STNode, Connector} from "@wso2-ei/syntax-tree";
import {MediatorViewState} from "../ViewState/mediator";
import {ConnectorViewState} from "../ViewState/connector";
import {ViewState} from "../ViewState/view-state";
import {ApiViewState} from "../ViewState/api";
import { ProxyViewState } from "../ViewState/proxy";
import {SendViewState} from "../ViewState/send";
import {LogViewState} from "../ViewState/log";
import { ResourceViewState } from "../ViewState/resource";
import { RespondViewState } from "../ViewState/respond";
import { InSequenceViewState } from "../ViewState/in-sequence";
import { OutSequenceViewState } from "../ViewState/out-sequence";

export class InitVisitor implements Visitor {

    beginVisitSTNode?(node: STNode){
        if (!node.viewState) {
            node.viewState = new ViewState();
        }
    }

    beginVisitMediator?(node: Mediator) {
        if (!node.viewState) {
            node.viewState = new MediatorViewState();
        }
    }

    beginVisitConnector?(node: Connector) {
        if (!node.viewState) {
            node.viewState = new ConnectorViewState();
        }
    }

    beginVisitApi?(node: Api) {
        if (!node.viewState) {
            node.viewState = new ApiViewState();
        }
    }

    beginVisitProxy?(node: Proxy) {
        if (!node.viewState) {
            node.viewState = new ProxyViewState();
        }
    }


    beginVisitInSequence?(node: InSequence) {
        if (!node.viewState) {
            node.viewState = new InSequenceViewState();
        }
    }

    beginVisitOutSequence?(node: OutSequence) {
        if (!node.viewState) {
            node.viewState = new OutSequenceViewState();
        }
    }

    beginVisitLog?(node: Send) {
        if (!node.viewState) {
            node.viewState = new SendViewState();
        }
    }

    beginVisitResource?(node: Log) {
        if (!node.viewState) {
            node.viewState = new LogViewState();
        }
    }

    beginVisitRespond?(node: Log) {
        if (!node.viewState) {
            node.viewState = new RespondViewState();
        }
    }

    beginVisitSend?(node: Resource) {
        if (!node.viewState) {
            node.viewState = new ResourceViewState();
        }
    }
}

export const initVisitor = new InitVisitor();