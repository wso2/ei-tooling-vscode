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
import { Api, InSequence, Log, Mediator, OutSequence, Proxy, Resource, Send, Visitor, Call, CallTemplate, Drop, LoopBack, Property, PropertyGroup, Sequence, Store, ConditionalRouter, Filter, Switch, Validate, Bean, Class, Command, Ejb, Script, Spring, Enrich, Fault, Header, PayloadFactory, Smooks, URLrewrite, XQuery, XSLT, DataMapper, FastXSLT, JsonTransform, DataServiceCall, Cache, DBLookup, DBReport, Enqueue, Event, Throttle, Transaction, Aggregate, Callout, Clone, Iterate, ForEach, Entitlement, Oauth, Ntlm, Builder, Rule, Bam, Publish, Respond } from "@wso2-ei/syntax-tree";
export declare class PositioningVisitor implements Visitor {
    beginVisitMediator(el: Mediator): void;
    beginVisitApi?(node: Api): void;
    beginVisitProxy?(node: Proxy): void;
    beginVisitInSequence?(node: InSequence): void;
    beginVisitOutSequence?(node: OutSequence): void;
    beginVisitLog?(node: Log): void;
    beginVisitRespond?(node: Respond): void;
    beginVisitResource?(node: Resource): void;
    beginVisitSend?(node: Send): void;
    beginVisitProperty?(node: Property): void;
    beginVisitPropertyGroup?(node: PropertyGroup): void;
    beginVisitPublish?(node: Publish): void;
    beginVisitScript?(node: Script): void;
    beginVisitSequence?(node: Sequence): void;
    beginVisitSmooks?(node: Smooks): void;
    beginVisitSpring?(node: Spring): void;
    beginVisitStore?(node: Store): void;
    beginVisitTransaction?(node: Transaction): void;
    beginVisitURLrewrite?(node: URLrewrite): void;
    beginVisitXQuery?(node: XQuery): void;
    beginVisitXSLT?(node: XSLT): void;
    beginVisitBam?(node: Bam): void;
    beginVisitBean?(node: Bean): void;
    beginVisitBuilder?(node: Builder): void;
    beginVisitCallout?(node: Callout): void;
    beginVisitCallTemplate?(node: CallTemplate): void;
    beginVisitClass?(node: Class): void;
    beginVisitCommand?(node: Command): void;
    beginVisitConditionalRouter?(node: ConditionalRouter): void;
    beginVisitDataMapper?(node: DataMapper): void;
    beginVisitDataServiceCall?(node: DataServiceCall): void;
    beginVisitDBLookup?(node: DBLookup): void;
    beginVisitDBReport?(node: DBReport): void;
    beginVisitDrop?(node: Drop): void;
    beginVisitEjb?(node: Ejb): void;
    beginVisitEnqueue?(node: Enqueue): void;
    beginVisitEnrich?(node: Enrich): void;
    beginVisitEvent?(node: Event): void;
    beginVisitFastXSLT?(node: FastXSLT): void;
    beginVisitFault?(node: Fault): void;
    beginVisitHeader?(node: Header): void;
    beginVisitJsonTransform?(node: JsonTransform): void;
    beginVisitLoopBack?(node: LoopBack): void;
    beginVisitNtlm?(node: Ntlm): void;
    beginVisitOauth?(node: Oauth): void;
    beginVisitPayloadFactory?(node: PayloadFactory): void;
    beginVisitIterate?(node: Iterate): void;
    beginVisitRule?(node: Rule): void;
    beginVisitSwitch?(node: Switch): void;
    beginVisitThrottle?(node: Throttle): void;
    beginVisitValidate?(node: Validate): void;
    beginVisitAggregate?(node: Aggregate): void;
    beginVisitCache?(node: Cache): void;
    beginVisitCall?(node: Call): void;
    beginVisitClone?(node: Clone): void;
    beginVisitEntitlement?(node: Entitlement): void;
    beginVisitFilter?(node: Filter): void;
    beginVisitForEach?(node: ForEach): void;
}
