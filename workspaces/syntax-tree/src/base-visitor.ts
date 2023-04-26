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

import * as Synapse from "./syntax-tree-interfaces";

export interface Visitor {
    beginVisitSTNode?(node: Synapse.STNode): void;
    endVisitSTNode?(node: Synapse.STNode): void;

    beginVisitMediator?(node: Synapse.Mediator): void;
    endVisitMediator?(node: Synapse.Mediator): void;

    beginVisitConnector?(node: Synapse.Connector): void;
    endVisitConnector?(node: Synapse.Connector): void;

    beginVisitApi?(node: Synapse.Mediator): void;
    endVisitApi?(node: Synapse.Mediator): void;

    beginVisitProxy?(node: Synapse.Mediator): void;
    endVisitProxy?(node: Synapse.Mediator): void;

    beginVisitInSequence?(node: Synapse.Mediator): void;
    endVisitInSequence?(node: Synapse.Mediator): void;

    beginVisitOutSequence?(node: Synapse.Mediator): void;
    endVisitOutSequence?(node: Synapse.Mediator): void;

    beginVisitLog?(node: Synapse.Mediator): void;
    endVisitLog?(node: Synapse.Mediator): void;

    beginVisitResource?(node: Synapse.Mediator): void;
    endVisitResource?(node: Synapse.Mediator): void;

    beginVisitRespond?(node: Synapse.Mediator): void;
    endVisitRespond?(node: Synapse.Mediator): void;

    beginVisitSend?(node: Synapse.Mediator): void;
    endVisitSend?(node: Synapse.Mediator): void;
}
