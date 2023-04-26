/**
 * Copyright (c) 2023, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

import {Api, InSequence, Log, Mediator, OutSequence, Proxy, Resource, Send, Visitor, STNode, Connector} from "@wso2-ei/syntax-tree";
import {MediatorViewState} from "../ViewState";
import {ConnectorViewState} from "../ViewState";
import {ViewState} from "../ViewState";
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
