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
import { MediatorViewState } from "../ViewState";
import { ConnectorViewState } from "../ViewState";
import { ViewState } from "../ViewState";
import { ApiViewState } from "../ViewState/api";
import { ProxyViewState } from "../ViewState/proxy";
import { SendViewState } from "../ViewState/send";
import { LogViewState } from "../ViewState/log";
import { ResourceViewState } from "../ViewState/resource";
import { RespondViewState } from "../ViewState/respond";
import { InSequenceViewState } from "../ViewState/in-sequence";
import { OutSequenceViewState } from "../ViewState/out-sequence";
import { CallViewState } from "../ViewState/call";
import { CallTemplateViewState } from "../ViewState/callTemplate";
import { DropViewState } from "../ViewState/drop";
import { LoopBackViewState } from "../ViewState/loopback";
import { PropertyViewState } from "../ViewState/property";
import { PropertyGroupViewState } from "../ViewState/propertygroup";
import { SequenceViewState } from "../ViewState/sequence";
import { StoreViewState } from "../ViewState/store";
import { ConditionalRouterViewState } from "../ViewState/conditionalrouter";
import { FilterViewState } from "../ViewState/filter";
import { SwitchViewState } from "../ViewState/switch";
import { ValidateViewState } from "../ViewState/validate";
import { BeanViewState } from "../ViewState/bean";
import { ClassViewState } from "../ViewState/class";
import { CommandViewState } from "../ViewState/command";
import { EjbViewState } from "../ViewState/ejb";
import { ScriptViewState } from "../ViewState/script";
import { SpringViewState } from "../ViewState/spring";
import { EnrichViewState } from "../ViewState/enrich";
import { FaultViewState } from "../ViewState/fault";
import { HeaderViewState } from "../ViewState/header";
import { PayloadFactoryViewState } from "../ViewState/payloadfactory";
import { SmooksViewState } from "../ViewState/smooks";
import { URLrewriteViewState } from "../ViewState/urlrewrite";
import { XQueryViewState } from "../ViewState/xquery";
import { XSLTViewState } from "../ViewState/xslt";
import { DataMapperViewState } from "../ViewState/datamapper";
import { FastXSLTViewState } from "../ViewState/fastxslt";
import { JsonTransformViewState } from "../ViewState/jsontransform";
import { DataServiceCallViewState } from "../ViewState/dataservicecall";
import { CacheViewState } from "../ViewState/cache";
import { DBLookupViewState } from "../ViewState/dblookup";
import { DBReportViewState } from "../ViewState/dbreport";
import { EnqueueViewState } from "../ViewState/enqueue";
import { EventViewState } from "../ViewState/event";
import { ThrottleViewState } from "../ViewState/throttle";
import { TransactionViewState } from "../ViewState/transaction";
import { AggregateViewState } from "../ViewState/aggregate";
import { CalloutViewState } from "../ViewState/callout";
import { CloneViewState } from "../ViewState/clone";
import { IterateViewState } from "../ViewState/iterate";
import { ForEachViewState } from "../ViewState/foreach";
import { EntitlementViewState } from "../ViewState/entitlement";
import { OauthViewState } from "../ViewState/oauth";
import { NtlmViewState } from "../ViewState/ntlm";
import { BuilderViewState } from "../ViewState/builder";
import { RuleViewState } from "../ViewState/rule";
import { BamViewState } from "../ViewState/bam";
import { PublishViewState } from "../ViewState/publish";
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
    beginVisitResource(node) {
        if (!node.viewState) {
            node.viewState = new ResourceViewState();
        }
    }
    beginVisitCall(node) {
        if (!node.viewState) {
            node.viewState = new CallViewState();
        }
    }
    beginVisitCallTemplate(node) {
        if (!node.viewState) {
            node.viewState = new CallTemplateViewState();
        }
    }
    beginVisitDrop(node) {
        if (!node.viewState) {
            node.viewState = new DropViewState();
        }
    }
    beginVisitLog(node) {
        if (!node.viewState) {
            node.viewState = new LogViewState();
        }
    }
    beginVisitLoopBack(node) {
        if (!node.viewState) {
            node.viewState = new LoopBackViewState();
        }
    }
    beginVisitProperty(node) {
        if (!node.viewState) {
            node.viewState = new PropertyViewState();
        }
    }
    beginVisitPropertyGroup(node) {
        if (!node.viewState) {
            node.viewState = new PropertyGroupViewState();
        }
    }
    beginVisitRespond(node) {
        if (!node.viewState) {
            node.viewState = new RespondViewState();
        }
    }
    beginVisitSend(node) {
        if (!node.viewState) {
            node.viewState = new SendViewState();
        }
    }
    beginVisitSequence(node) {
        if (!node.viewState) {
            node.viewState = new SequenceViewState();
        }
    }
    beginVisitStore(node) {
        if (!node.viewState) {
            node.viewState = new StoreViewState();
        }
    }
    beginVisitConditionalRouter(node) {
        if (!node.viewState) {
            node.viewState = new ConditionalRouterViewState();
        }
    }
    beginVisitFilter(node) {
        if (!node.viewState) {
            node.viewState = new FilterViewState();
        }
    }
    beginVisitSwitch(node) {
        if (!node.viewState) {
            node.viewState = new SwitchViewState();
        }
    }
    beginVisitValidate(node) {
        if (!node.viewState) {
            node.viewState = new ValidateViewState();
        }
    }
    beginVisitBean(node) {
        if (!node.viewState) {
            node.viewState = new BeanViewState();
        }
    }
    beginVisitClass(node) {
        if (!node.viewState) {
            node.viewState = new ClassViewState();
        }
    }
    beginVisitCommand(node) {
        if (!node.viewState) {
            node.viewState = new CommandViewState();
        }
    }
    beginVisitEJB(node) {
        if (!node.viewState) {
            node.viewState = new EjbViewState();
        }
    }
    beginVisitScript(node) {
        if (!node.viewState) {
            node.viewState = new ScriptViewState();
        }
    }
    beginVisitSpring(node) {
        if (!node.viewState) {
            node.viewState = new SpringViewState();
        }
    }
    beginVisitEnrich(node) {
        if (!node.viewState) {
            node.viewState = new EnrichViewState();
        }
    }
    beginVisitFault(node) {
        if (!node.viewState) {
            node.viewState = new FaultViewState();
        }
    }
    beginVisitHeader(node) {
        if (!node.viewState) {
            node.viewState = new HeaderViewState();
        }
    }
    beginVisitPayloadFactory(node) {
        if (!node.viewState) {
            node.viewState = new PayloadFactoryViewState();
        }
    }
    beginVisitSmooks(node) {
        if (!node.viewState) {
            node.viewState = new SmooksViewState();
        }
    }
    beginVisitURLRewrite(node) {
        if (!node.viewState) {
            node.viewState = new URLrewriteViewState();
        }
    }
    beginVisitXQuery(node) {
        if (!node.viewState) {
            node.viewState = new XQueryViewState();
        }
    }
    beginVisitXSLT(node) {
        if (!node.viewState) {
            node.viewState = new XSLTViewState();
        }
    }
    beginVisitDataMapper(node) {
        if (!node.viewState) {
            node.viewState = new DataMapperViewState();
        }
    }
    beginVisitFastXSLT(node) {
        if (!node.viewState) {
            node.viewState = new FastXSLTViewState();
        }
    }
    beginVisitJsonTransform(node) {
        if (!node.viewState) {
            node.viewState = new JsonTransformViewState();
        }
    }
    beginVisitDataServiceCall(node) {
        if (!node.viewState) {
            node.viewState = new DataServiceCallViewState();
        }
    }
    beginVisitCache(node) {
        if (!node.viewState) {
            node.viewState = new CacheViewState();
        }
    }
    beginVisitDBLookup(node) {
        if (!node.viewState) {
            node.viewState = new DBLookupViewState();
        }
    }
    beginVisitDBReport(node) {
        if (!node.viewState) {
            node.viewState = new DBReportViewState();
        }
    }
    beginVisitEnqueue(node) {
        if (!node.viewState) {
            node.viewState = new EnqueueViewState();
        }
    }
    beginVisitEvent(node) {
        if (!node.viewState) {
            node.viewState = new EventViewState();
        }
    }
    beginVisitThrottle(node) {
        if (!node.viewState) {
            node.viewState = new ThrottleViewState();
        }
    }
    beginVisitTransaction(node) {
        if (!node.viewState) {
            node.viewState = new TransactionViewState();
        }
    }
    beginVisitAggregate(node) {
        if (!node.viewState) {
            node.viewState = new AggregateViewState();
        }
    }
    beginVisitCallout(node) {
        if (!node.viewState) {
            node.viewState = new CalloutViewState();
        }
    }
    beginVisitClone(node) {
        if (!node.viewState) {
            node.viewState = new CloneViewState();
        }
    }
    beginVisitIterate(node) {
        if (!node.viewState) {
            node.viewState = new IterateViewState();
        }
    }
    beginVisitForEach(node) {
        if (!node.viewState) {
            node.viewState = new ForEachViewState();
        }
    }
    beginVisitEntitlement(node) {
        if (!node.viewState) {
            node.viewState = new EntitlementViewState();
        }
    }
    beginVisitOAuth(node) {
        if (!node.viewState) {
            node.viewState = new OauthViewState();
        }
    }
    //NLTM
    beginVisitNTLM(node) {
        if (!node.viewState) {
            node.viewState = new NtlmViewState();
        }
    }
    //Builder
    beginVisitBuilder(node) {
        if (!node.viewState) {
            node.viewState = new BuilderViewState();
        }
    }
    //Rule
    beginVisitRule(node) {
        if (!node.viewState) {
            node.viewState = new RuleViewState();
        }
    }
    //Bam
    beginVisitBAM(node) {
        if (!node.viewState) {
            node.viewState = new BamViewState();
        }
    }
    beginVisitPublishEvent(node) {
        if (!node.viewState) {
            node.viewState = new PublishViewState();
        }
    }
}
export const initVisitor = new InitVisitor();
//# sourceMappingURL=init-visitor.js.map