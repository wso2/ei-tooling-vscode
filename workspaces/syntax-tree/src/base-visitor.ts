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

    beginVisitResource?(node: Synapse.Mediator): void;
    endVisitResource?(node: Synapse.Mediator): void;

    beginVisitCall?(node: Synapse.Mediator): void;
    endVisitCall?(node: Synapse.Mediator): void;

    beginVisitCallTemplate?(node: Synapse.Mediator): void;
    endVisitCallTemplate?(node: Synapse.Mediator): void;

    beginVisitDrop?(node: Synapse.Mediator): void;
    endVisitDrop?(node: Synapse.Mediator): void;

    beginVisitLog?(node: Synapse.Mediator): void;
    endVisitLog?(node: Synapse.Mediator): void;

    beginVisitLoopBack?(node: Synapse.Mediator): void;
    endVisitLooBack?(node: Synapse.Mediator): void;

    beginVisitProperty?(node: Synapse.Mediator): void;  
    endVisitProperty?(node: Synapse.Mediator): void;

    beginVisitPropertyGroup?(node: Synapse.Mediator): void; 
    endVisitPropertyGroup?(node: Synapse.Mediator): void;

    beginVisitRespond?(node: Synapse.Mediator): void;
    endVisitRespond?(node: Synapse.Mediator): void;

    beginVisitSend?(node: Synapse.Mediator): void;
    endVisitSend?(node: Synapse.Mediator): void;

    beginVisitSequence?(node: Synapse.Mediator): void;
    endVisitSequence?(node: Synapse.Mediator): void;

    beginVisitStore?(node: Synapse.Mediator): void;
    endVisitStore?(node: Synapse.Mediator): void;

    beginVisitSwitch?(node: Synapse.Mediator): void;
    endVisitSwitch?(node: Synapse.Mediator): void;

    beginVisitValidate?(node: Synapse.Mediator): void;
    endVisitValidate?(node: Synapse.Mediator): void;

    beginVisitConditionalRouter?(node: Synapse.Mediator): void;
    endVisitConditionalRouter?(node: Synapse.Mediator): void;

    beginVisitConditionalBranch?(node: Synapse.Mediator): void;
    endVisitConditionalBranch?(node: Synapse.Mediator): void;

    beginVisitFilter?(node: Synapse.Mediator): void;
    endVisitFilter?(node: Synapse.Mediator): void;

    beginVisitBean?(node: Synapse.Mediator): void;
    endVisitBean?(node: Synapse.Mediator): void;

    beginVisitClass?(node: Synapse.Mediator): void;
    endVisitClass?(node: Synapse.Mediator): void;

    beginVisitCommand?(node: Synapse.Mediator): void;
    endVisitCommand?(node: Synapse.Mediator): void;

    beginVisitEJB?(node: Synapse.Mediator): void;
    endVisitEJB?(node: Synapse.Mediator): void;

    beginVisitScript?(node: Synapse.Mediator): void;
    endVisitScript?(node: Synapse.Mediator): void;

    beginVisitSpring?(node: Synapse.Mediator): void;
    endVisitSpring?(node: Synapse.Mediator): void;

    beginVisitEnrich?(node: Synapse.Mediator): void;
    endVisitEnrich?(node: Synapse.Mediator): void;

    beginVisitFault?(node: Synapse.Mediator): void;
    endVisitFault?(node: Synapse.Mediator): void;

    beginVisitHeader?(node: Synapse.Mediator): void;
    endVisitHeader?(node: Synapse.Mediator): void;

    beginVisitPayloadFactory?(node: Synapse.Mediator): void;
    endVisitPayloadFactory?(node: Synapse.Mediator): void;

    beginVisitSmooks?(node: Synapse.Mediator): void;
    endVisitSmooks?(node: Synapse.Mediator): void;

    beginVisitURLRewrite?(node: Synapse.Mediator): void;
    endVisitURLRewrite?(node: Synapse.Mediator): void;

    beginVisitXQuery?(node: Synapse.Mediator): void;
    endVisitXQuery?(node: Synapse.Mediator): void;

    beginVisitXSLT?(node: Synapse.Mediator): void;
    endVisitXSLT?(node: Synapse.Mediator): void;

    beginVisitDataMapper?(node: Synapse.Mediator): void;
    endVisitDataMapper?(node: Synapse.Mediator): void;

    beginVisitFastXSLT?(node: Synapse.Mediator): void;
    endVisitFastXSLT?(node: Synapse.Mediator): void;

    beginVisitJsonTransform?(node: Synapse.Mediator): void;
    endVisitJsonTransform?(node: Synapse.Mediator): void;

    beginVisitDataServiceCall?(node: Synapse.Mediator): void;
    endVisitDataServiceCall?(node: Synapse.Mediator): void;

    beginVisitCache?(node: Synapse.Mediator): void;
    endVisitCache?(node: Synapse.Mediator): void;

    beginVisitDBLookup?(node: Synapse.Mediator): void;
    endVisitDBLookup?(node: Synapse.Mediator): void;

    beginVisitDBReport?(node: Synapse.Mediator): void;
    endVisitDBReport?(node: Synapse.Mediator): void;

    beginVisitEnqueue?(node: Synapse.Mediator): void;
    endVisitEnqueue?(node: Synapse.Mediator): void;

    beginVisitEvent?(node: Synapse.Mediator): void;
    endVisitEvent?(node: Synapse.Mediator): void;

    beginVisitThrottle?(node: Synapse.Mediator): void;
    endVisitThrottle?(node: Synapse.Mediator): void;

    beginVisitTransaction?(node: Synapse.Mediator): void;
    endVisitTransaction?(node: Synapse.Mediator): void;

    beginVisitAggregate?(node: Synapse.Mediator): void;
    endVisitAggregate?(node: Synapse.Mediator): void;

    beginVisitCallout?(node: Synapse.Mediator): void;
    endVisitCallout?(node: Synapse.Mediator): void;

    beginVisitClone?(node: Synapse.Mediator): void;
    endVisitClone?(node: Synapse.Mediator): void;

    beginVisitIterate?(node: Synapse.Mediator): void;
    endVisitIterate?(node: Synapse.Mediator): void;

    beginVisitForEach?(node: Synapse.Mediator): void;
    endVisitForEach?(node: Synapse.Mediator): void;

    beginVisitEntitlement?(node: Synapse.Mediator): void;
    endVisitEntitlement?(node: Synapse.Mediator): void;

    beginVisitOAuth?(node: Synapse.Mediator): void;
    endVisitOAuth?(node: Synapse.Mediator): void;

    beginVisitNTLM?(node: Synapse.Mediator): void;
    endVisitNTLM?(node: Synapse.Mediator): void;

    beginVisitBuilder?(node: Synapse.Mediator): void;
    endVisitBuilder?(node: Synapse.Mediator): void;

    beginVisitRule?(node: Synapse.Mediator): void;
    endVisitRule?(node: Synapse.Mediator): void;

    beginVisitBAM?(node: Synapse.Mediator): void;
    endVisitBAM?(node: Synapse.Mediator): void;

    beginVisitPublishEvent?(node: Synapse.Mediator): void;  
    endVisitPublishEvent?(node: Synapse.Mediator): void;

}
