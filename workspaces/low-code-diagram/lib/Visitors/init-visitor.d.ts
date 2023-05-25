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
import { Api, InSequence, Log, Mediator, OutSequence, Proxy, Resource, Send, Visitor, STNode, Connector, Call, CallTemplate, Drop, LoopBack, Property, PropertyGroup, Sequence, Store, ConditionalRouter, Filter, Switch, Validate, Bean, Class, Command, Ejb, Script, Spring, Enrich, Fault, Header, PayloadFactory, Smooks, URLrewrite, XQuery, XSLT, DataMapper, FastXSLT, JsonTransform, DataServiceCall, Cache, DBLookup, DBReport, Enqueue, Event, Throttle, Transaction, Aggregate, Callout, Clone, Iterate, ForEach, Entitlement, Oauth, Ntlm, Builder, Rule, Bam, Publish, Respond } from "@wso2-ei/syntax-tree";
export declare class InitVisitor implements Visitor {
    beginVisitSTNode?(node: STNode): void;
    beginVisitMediator?(node: Mediator): void;
    beginVisitConnector?(node: Connector): void;
    beginVisitApi?(node: Api): void;
    beginVisitProxy?(node: Proxy): void;
    beginVisitInSequence?(node: InSequence): void;
    beginVisitOutSequence?(node: OutSequence): void;
    beginVisitResource?(node: Resource): void;
    beginVisitCall?(node: Call): void;
    beginVisitCallTemplate?(node: CallTemplate): void;
    beginVisitDrop?(node: Drop): void;
    beginVisitLog?(node: Log): void;
    beginVisitLoopBack?(node: LoopBack): void;
    beginVisitProperty?(node: Property): void;
    beginVisitPropertyGroup?(node: PropertyGroup): void;
    beginVisitRespond?(node: Respond): void;
    beginVisitSend?(node: Send): void;
    beginVisitSequence?(node: Sequence): void;
    beginVisitStore?(node: Store): void;
    beginVisitConditionalRouter?(node: ConditionalRouter): void;
    beginVisitFilter?(node: Filter): void;
    beginVisitSwitch?(node: Switch): void;
    beginVisitValidate?(node: Validate): void;
    beginVisitBean?(node: Bean): void;
    beginVisitClass?(node: Class): void;
    beginVisitCommand?(node: Command): void;
    beginVisitEJB?(node: Ejb): void;
    beginVisitScript?(node: Script): void;
    beginVisitSpring?(node: Spring): void;
    beginVisitEnrich?(node: Enrich): void;
    beginVisitFault?(node: Fault): void;
    beginVisitHeader?(node: Header): void;
    beginVisitPayloadFactory?(node: PayloadFactory): void;
    beginVisitSmooks?(node: Smooks): void;
    beginVisitURLRewrite?(node: URLrewrite): void;
    beginVisitXQuery?(node: XQuery): void;
    beginVisitXSLT?(node: XSLT): void;
    beginVisitDataMapper?(node: DataMapper): void;
    beginVisitFastXSLT?(node: FastXSLT): void;
    beginVisitJsonTransform?(node: JsonTransform): void;
    beginVisitDataServiceCall?(node: DataServiceCall): void;
    beginVisitCache?(node: Cache): void;
    beginVisitDBLookup?(node: DBLookup): void;
    beginVisitDBReport?(node: DBReport): void;
    beginVisitEnqueue?(node: Enqueue): void;
    beginVisitEvent?(node: Event): void;
    beginVisitThrottle?(node: Throttle): void;
    beginVisitTransaction?(node: Transaction): void;
    beginVisitAggregate?(node: Aggregate): void;
    beginVisitCallout?(node: Callout): void;
    beginVisitClone?(node: Clone): void;
    beginVisitIterate?(node: Iterate): void;
    beginVisitForEach?(node: ForEach): void;
    beginVisitEntitlement?(node: Entitlement): void;
    beginVisitOAuth?(node: Oauth): void;
    beginVisitNTLM?(node: Ntlm): void;
    beginVisitBuilder?(node: Builder): void;
    beginVisitRule?(node: Rule): void;
    beginVisitBAM?(node: Bam): void;
    beginVisitPublishEvent?(node: Publish): void;
}
export declare const initVisitor: InitVisitor;
