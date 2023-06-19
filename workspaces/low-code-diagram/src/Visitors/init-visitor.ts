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

import {
  Api,
  InSequence,
  Log,
  Mediator,
  OutSequence,
  Proxy,
  Resource,
  Send,
  Visitor,
  STNode,
  Connector,
  Call,
  CallTemplate,
  Drop,
  LoopBack,
  Property,
  PropertyGroup,
  Sequence,
  Store,
  ConditionalRouter,
  Filter,
  Switch,
  Validate,
  Bean,
  Class,
  Command,
  Ejb,
  Script,
  Spring,
  Enrich,
  Fault,
  Header,
  PayloadFactory,
  Smooks,
  URLrewrite,
  XQuery,
  XSLT,
  DataMapper,
  FastXSLT,
  JsonTransform,
  DataServiceCall,
  Cache,
  DBLookup,
  DBReport,
  Enqueue,
  Event,
  Throttle,
  Transaction,
  Aggregate,
  Callout,
  Clone,
  Iterate,
  ForEach,
  Entitlement,
  Oauth,
  Ntlm,
  Builder,
  Rule,
  Bam,
  Publish,
  Respond,
} from '@wso2-ei/syntax-tree/lib';
import { MediatorViewState } from '../ViewState';
import { ConnectorViewState } from '../ViewState';
import { ViewState } from '../ViewState';
import { ApiViewState } from '../ViewState/api';
import { ProxyViewState } from '../ViewState/proxy';
import { SendViewState } from '../ViewState/send';
import { LogViewState } from '../ViewState/log';
import { ResourceViewState } from '../ViewState/resource';
import { RespondViewState } from '../ViewState/respond';
import { InSequenceViewState } from '../ViewState/in-sequence';
import { OutSequenceViewState } from '../ViewState/out-sequence';
import { CallViewState } from '../ViewState/call';
import { CallTemplateViewState } from '../ViewState/callTemplate';
import { DropViewState } from '../ViewState/drop';
import { LoopBackViewState } from '../ViewState/loopback';
import { PropertyViewState } from '../ViewState/property';
import { PropertyGroupViewState } from '../ViewState/propertygroup';
import { SequenceViewState } from '../ViewState/sequence';
import { StoreViewState } from '../ViewState/store';
import { ConditionalRouterViewState } from '../ViewState/conditionalrouter';
import { FilterViewState } from '../ViewState/filter';
import { SwitchViewState } from '../ViewState/switch';
import { ValidateViewState } from '../ViewState/validate';
import { BeanViewState } from '../ViewState/bean';
import { ClassViewState } from '../ViewState/class';
import { CommandViewState } from '../ViewState/command';
import { EjbViewState } from '../ViewState/ejb';
import { ScriptViewState } from '../ViewState/script';
import { SpringViewState } from '../ViewState/spring';
import { EnrichViewState } from '../ViewState/enrich';
import { FaultViewState } from '../ViewState/fault';
import { HeaderViewState } from '../ViewState/header';
import { PayloadFactoryViewState } from '../ViewState/payloadfactory';
import { SmooksViewState } from '../ViewState/smooks';
import { URLrewriteViewState } from '../ViewState/urlrewrite';
import { XQueryViewState } from '../ViewState/xquery';
import { XSLTViewState } from '../ViewState/xslt';
import { DataMapperViewState } from '../ViewState/datamapper';
import { FastXSLTViewState } from '../ViewState/fastxslt';
import { JsonTransformViewState } from '../ViewState/jsontransform';
import { DataServiceCallViewState } from '../ViewState/dataservicecall';
import { CacheViewState } from '../ViewState/cache';
import { DBLookupViewState } from '../ViewState/dblookup';
import { DBReportViewState } from '../ViewState/dbreport';
import { EnqueueViewState } from '../ViewState/enqueue';
import { EventViewState } from '../ViewState/event';
import { ThrottleViewState } from '../ViewState/throttle';
import { TransactionViewState } from '../ViewState/transaction';
import { AggregateViewState } from '../ViewState/aggregate';
import { CalloutViewState } from '../ViewState/callout';
import { CloneViewState } from '../ViewState/clone';
import { IterateViewState } from '../ViewState/iterate';
import { ForEachViewState } from '../ViewState/foreach';
import { EntitlementViewState } from '../ViewState/entitlement';
import { OauthViewState } from '../ViewState/oauth';
import { NtlmViewState } from '../ViewState/ntlm';
import { BuilderViewState } from '../ViewState/builder';
import { RuleViewState } from '../ViewState/rule';
import { BamViewState } from '../ViewState/bam';
import { PublishViewState } from '../ViewState/publish';

export class InitVisitor implements Visitor {
  beginVisitSTNode?(node: STNode) {
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

  beginVisitResource?(node: Resource) {
    if (!node.viewState) {
      node.viewState = new ResourceViewState();
    }
  }

  beginVisitCall?(node: Call) {
    if (!node.viewState) {
      node.viewState = new CallViewState();
    }
  }

  beginVisitCallTemplate?(node: CallTemplate) {
    if (!node.viewState) {
      node.viewState = new CallTemplateViewState();
    }
  }

  beginVisitDrop?(node: Drop) {
    if (!node.viewState) {
      node.viewState = new DropViewState();
    }
  }

  beginVisitLog?(node: Log) {
    if (!node.viewState) {
      node.viewState = new LogViewState();
    }
  }

  beginVisitLoopBack?(node: LoopBack) {
    if (!node.viewState) {
      node.viewState = new LoopBackViewState();
    }
  }

  beginVisitProperty?(node: Property) {
    if (!node.viewState) {
      node.viewState = new PropertyViewState();
    }
  }

  beginVisitPropertyGroup?(node: PropertyGroup) {
    if (!node.viewState) {
      node.viewState = new PropertyGroupViewState();
    }
  }

  beginVisitRespond?(node: Respond) {
    if (!node.viewState) {
      node.viewState = new RespondViewState();
    }
  }

  beginVisitSend?(node: Send) {
    if (!node.viewState) {
      node.viewState = new SendViewState();
    }
  }

  beginVisitSequence?(node: Sequence) {
    if (!node.viewState) {
      node.viewState = new SequenceViewState();
    }
  }

  beginVisitStore?(node: Store) {
    if (!node.viewState) {
      node.viewState = new StoreViewState();
    }
  }

  beginVisitConditionalRouter?(node: ConditionalRouter) {
    if (!node.viewState) {
      node.viewState = new ConditionalRouterViewState();
    }
  }

  beginVisitFilter?(node: Filter) {
    if (!node.viewState) {
      node.viewState = new FilterViewState();
    }
  }

  beginVisitSwitch?(node: Switch) {
    if (!node.viewState) {
      node.viewState = new SwitchViewState();
    }
  }

  beginVisitValidate?(node: Validate) {
    if (!node.viewState) {
      node.viewState = new ValidateViewState();
    }
  }

  beginVisitBean?(node: Bean) {
    if (!node.viewState) {
      node.viewState = new BeanViewState();
    }
  }

  beginVisitClass?(node: Class) {
    if (!node.viewState) {
      node.viewState = new ClassViewState();
    }
  }

  beginVisitCommand?(node: Command) {
    if (!node.viewState) {
      node.viewState = new CommandViewState();
    }
  }

  beginVisitEJB?(node: Ejb) {
    if (!node.viewState) {
      node.viewState = new EjbViewState();
    }
  }

  beginVisitScript?(node: Script) {
    if (!node.viewState) {
      node.viewState = new ScriptViewState();
    }
  }

  beginVisitSpring?(node: Spring) {
    if (!node.viewState) {
      node.viewState = new SpringViewState();
    }
  }

  beginVisitEnrich?(node: Enrich) {
    if (!node.viewState) {
      node.viewState = new EnrichViewState();
    }
  }

  beginVisitFault?(node: Fault) {
    if (!node.viewState) {
      node.viewState = new FaultViewState();
    }
  }

  beginVisitHeader?(node: Header) {
    if (!node.viewState) {
      node.viewState = new HeaderViewState();
    }
  }

  beginVisitPayloadFactory?(node: PayloadFactory) {
    if (!node.viewState) {
      node.viewState = new PayloadFactoryViewState();
    }
  }

  beginVisitSmooks?(node: Smooks) {
    if (!node.viewState) {
      node.viewState = new SmooksViewState();
    }
  }

  beginVisitURLRewrite?(node: URLrewrite) {
    if (!node.viewState) {
      node.viewState = new URLrewriteViewState();
    }
  }

  beginVisitXQuery?(node: XQuery) {
    if (!node.viewState) {
      node.viewState = new XQueryViewState();
    }
  }

  beginVisitXSLT?(node: XSLT) {
    if (!node.viewState) {
      node.viewState = new XSLTViewState();
    }
  }

  beginVisitDataMapper?(node: DataMapper) {
    if (!node.viewState) {
      node.viewState = new DataMapperViewState();
    }
  }

  beginVisitFastXSLT?(node: FastXSLT) {
    if (!node.viewState) {
      node.viewState = new FastXSLTViewState();
    }
  }

  beginVisitJsonTransform?(node: JsonTransform) {
    if (!node.viewState) {
      node.viewState = new JsonTransformViewState();
    }
  }

  beginVisitDataServiceCall?(node: DataServiceCall) {
    if (!node.viewState) {
      node.viewState = new DataServiceCallViewState();
    }
  }

  beginVisitCache?(node: Cache) {
    if (!node.viewState) {
      node.viewState = new CacheViewState();
    }
  }

  beginVisitDBLookup?(node: DBLookup) {
    if (!node.viewState) {
      node.viewState = new DBLookupViewState();
    }
  }

  beginVisitDBReport?(node: DBReport) {
    if (!node.viewState) {
      node.viewState = new DBReportViewState();
    }
  }

  beginVisitEnqueue?(node: Enqueue) {
    if (!node.viewState) {
      node.viewState = new EnqueueViewState();
    }
  }

  beginVisitEvent?(node: Event) {
    if (!node.viewState) {
      node.viewState = new EventViewState();
    }
  }

  beginVisitThrottle?(node: Throttle) {
    if (!node.viewState) {
      node.viewState = new ThrottleViewState();
    }
  }

  beginVisitTransaction?(node: Transaction) {
    if (!node.viewState) {
      node.viewState = new TransactionViewState();
    }
  }

  beginVisitAggregate?(node: Aggregate) {
    if (!node.viewState) {
      node.viewState = new AggregateViewState();
    }
  }

  beginVisitCallout?(node: Callout) {
    if (!node.viewState) {
      node.viewState = new CalloutViewState();
    }
  }

  beginVisitClone?(node: Clone) {
    if (!node.viewState) {
      node.viewState = new CloneViewState();
    }
  }

  beginVisitIterate?(node: Iterate) {
    if (!node.viewState) {
      node.viewState = new IterateViewState();
    }
  }

  beginVisitForEach?(node: ForEach) {
    if (!node.viewState) {
      node.viewState = new ForEachViewState();
    }
  }

  beginVisitEntitlement?(node: Entitlement) {
    if (!node.viewState) {
      node.viewState = new EntitlementViewState();
    }
  }

  beginVisitOAuth?(node: Oauth) {
    if (!node.viewState) {
      node.viewState = new OauthViewState();
    }
  }

  beginVisitNTLM?(node: Ntlm) {
    if (!node.viewState) {
      node.viewState = new NtlmViewState();
    }
  }

  beginVisitBuilder?(node: Builder) {
    if (!node.viewState) {
      node.viewState = new BuilderViewState();
    }
  }

  beginVisitRule?(node: Rule) {
    if (!node.viewState) {
      node.viewState = new RuleViewState();
    }
  }

  beginVisitBAM?(node: Bam) {
    if (!node.viewState) {
      node.viewState = new BamViewState();
    }
  }

  beginVisitPublishEvent?(node: Publish) {
    if (!node.viewState) {
      node.viewState = new PublishViewState();
    }
  }
}

export const initVisitor = new InitVisitor();
