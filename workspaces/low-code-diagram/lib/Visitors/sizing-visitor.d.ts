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
export declare const DEFAULT_SHAPE_DIMENSION = 70;
export declare const COMPONENT_GAP = 20;
export declare class SizingVisitor implements Visitor {
    endVisitMediator?(node: Mediator): void;
    endVisitApi?(node: Api): void;
    endVisitProxy?(node: Proxy): void;
    endVisitInSequence?(node: InSequence): void;
    endVisitOutSequence?(node: OutSequence): void;
    endVisitResource?(node: Resource): void;
    endVisitLog?(node: Log): void;
    endVisitRespond?(node: Respond): void;
    endVisitSend?(node: Send): void;
    endVisitPublish?(node: Publish): void;
    endVisitScript?(node: Script): void;
    endVisitSequence?(node: Sequence): void;
    endVisitSmooks?(node: Smooks): void;
    endVisitSpring?(node: Spring): void;
    endVisitStore?(node: Store): void;
    endVisitTransaction?(node: Transaction): void;
    endVisitURLrewrite?(node: URLrewrite): void;
    endVisitXQuery?(node: XQuery): void;
    endVisitXSLT?(node: XSLT): void;
    endVisitBam?(node: Bam): void;
    endVisitBean?(node: Bean): void;
    endVisitBuilder?(node: Builder): void;
    endVisitCallout?(node: Callout): void;
    endVisitCallTemplate?(node: CallTemplate): void;
    endVisitClass?(node: Class): void;
    endVisitCommand?(node: Command): void;
    endVisitConditionalRouter?(node: ConditionalRouter): void;
    endVisitDataMapper?(node: DataMapper): void;
    endVisitDataServiceCall?(node: DataServiceCall): void;
    endVisitDBLookup?(node: DBLookup): void;
    endVisitDBReport?(node: DBReport): void;
    endVisitDrop?(node: Drop): void;
    endVisitEjb?(node: Ejb): void;
    endVisitEnqueue?(node: Enqueue): void;
    endVisitEnrich?(node: Enrich): void;
    endVisitEvent?(node: Event): void;
    endVisitFastXSLT?(node: FastXSLT): void;
    endVisitFault?(node: Fault): void;
    endVisitHeader?(node: Header): void;
    endVisitJsonTransform?(node: JsonTransform): void;
    endVisitLoopBack?(node: LoopBack): void;
    endVisitNtlm?(node: Ntlm): void;
    endVisitOauth?(node: Oauth): void;
    endVisitPayloadFactory?(node: PayloadFactory): void;
    endVisitProperty?(node: Property): void;
    endVisitPropertyGroup?(node: PropertyGroup): void;
    endVisitForEach?(node: ForEach): void;
    endVisitIterate?(node: Iterate): void;
    endVisitRule?(node: Rule): void;
    endVisitSwitch?(node: Switch): void;
    endVisitThrottle?(node: Throttle): void;
    endVisitValidate?(node: Validate): void;
    endVisitAggregate?(node: Aggregate): void;
    endVisitCache?(node: Cache): void;
    endVisitCall?(node: Call): void;
    endVisitClone?(node: Clone): void;
    endVisitEntitlement?(node: Entitlement): void;
    endVisitFilter?(node: Filter): void;
}
