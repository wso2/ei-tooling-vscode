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
import { Api, InSequence, Log, Mediator, OutSequence, Proxy, Resource, Respond, Send, Visitor } from '@wso2-ei/syntax-tree';
export declare const DEFAULT_SHAPE_DIMENSION = 70;
export declare const COMPONENT_GAP = 20;
export declare class SizingVisitor implements Visitor {
    endVisitMediator?(node: Mediator): void;
    endVisitApi?(node: Api): void;
    endVisitProxy?(node: Proxy): void;
    endVisitInSequence?(node: InSequence): void;
    endVisitOutSequence?(node: OutSequence): void;
    endVisitLog?(node: Log): void;
    endVisitRespond?(node: Respond): void;
    endVisitResource?(node: Resource): void;
    endVisitSend?(node: Send): void;
}
