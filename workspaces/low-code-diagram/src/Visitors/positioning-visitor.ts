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
    Api, InSequence, Log, Mediator, OutSequence, Proxy, Resource, Send, Visitor, Call, CallTemplate, Drop, LoopBack,
    Property, PropertyGroup, Sequence, Store, ConditionalRouter, Filter, Switch, Validate, Bean, Class, Command, Ejb,
    Script, Spring, Enrich, Fault, Header, PayloadFactory, Smooks, URLrewrite, XQuery, XSLT, DataMapper, FastXSLT,
    JsonTransform, DataServiceCall, Cache, DBLookup, DBReport, Enqueue, Event, Throttle, Transaction, Aggregate,
    Callout, Clone, Iterate, ForEach, Entitlement, Oauth, Ntlm, Builder, Rule, Bam, Publish, Respond
} from "@wso2-ei/syntax-tree/lib";
import { MediatorViewState } from "../ViewState";
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
import { COMPONENT_GAP } from "./sizing-visitor";

export class PositioningVisitor implements Visitor {

    beginVisitMediator(el: Mediator) {
        if (el.viewState) {
            const viewState: MediatorViewState = el.viewState as MediatorViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (el.children === undefined) {
                return;
            }

            el.children.forEach((child, index) => {
                const childVS: MediatorViewState = child.viewState as MediatorViewState;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case el.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }


                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

    beginVisitApi?(node: Api) {
        if (node.viewState) {
            const viewState: ApiViewState = node.viewState as ApiViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            let width = viewState.bBox.x;

            node.children.forEach((child) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = width + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                width += viewState.bBox.x + childVS.bBox.w + COMPONENT_GAP;
            })
        }
    }

    beginVisitProxy?(node: Proxy) {
        if (node.viewState) {
            const viewState: ProxyViewState = node.viewState as ProxyViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }

                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }


    beginVisitInSequence?(node: InSequence) {
        if (node.viewState) {
            const viewState: InSequenceViewState = node.viewState as InSequenceViewState;

            // let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }
            let width = viewState.bBox.x;

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = width + COMPONENT_GAP;
                childVS.bBox.y = viewState.bBox.y + viewState.bBox.h / 2 - childVS.bBox.h / 2;

                width = childVS.bBox.x + childVS.bBox.w;

                if (index == 0) {
                    viewState.workerLine.x1 = viewState.bBox.x;
                    viewState.workerLine.y1 = childVS.bBox.y + childVS.bBox.h / 2;
                }
                if (index == node.children.length - 1) {
                    viewState.workerLine.x2 = childVS.bBox.x;
                    viewState.workerLine.y2 = childVS.bBox.y + childVS.bBox.h / 2;
                }
            })
        }
    }

    beginVisitOutSequence?(node: OutSequence) {
        if (node.viewState) {
            const viewState: OutSequenceViewState = node.viewState as OutSequenceViewState;

            if (node.children === undefined) {
                return;
            }
            let width = viewState.bBox.x;

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = width + COMPONENT_GAP;
                childVS.bBox.y = viewState.bBox.y + viewState.bBox.h / 2 - childVS.bBox.h / 2;

                width = childVS.bBox.x + childVS.bBox.w;

                if (index == 0) {
                    viewState.workerLine.x1 = viewState.bBox.x;
                    viewState.workerLine.y1 = childVS.bBox.y + childVS.bBox.h / 2;
                }
                if (index == node.children.length - 1) {
                    viewState.workerLine.x2 = childVS.bBox.x;
                    viewState.workerLine.y2 = childVS.bBox.y + childVS.bBox.h / 2;
                }

            })
        }
    }

    beginVisitLog?(node: Log) {
        if (node.viewState) {
            const viewState: LogViewState = node.viewState as LogViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitRespond?(node: Respond) {
        if (node.viewState) {
            const viewState: RespondViewState = node.viewState as RespondViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitResource?(node: Resource) {
        if (node.viewState) {
            const viewState: ResourceViewState = node.viewState as ResourceViewState;

            if (node.children === undefined) {
                return;
            }
            let height = viewState.bBox.y;
            let width = viewState.bBox.x;

            node.children.forEach((child) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = width + COMPONENT_GAP;
                childVS.bBox.y = height + COMPONENT_GAP;

                height = childVS.bBox.y + childVS.bBox.h;
            })
        }
    }

    beginVisitSend?(node: Send) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as SendViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }

                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }


    beginVisitProperty?(node: Property) {
        if (node.viewState) {
            const viewState: PropertyViewState = node.viewState as PropertyViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitPropertyGroup?(node: PropertyGroup) {
        if (node.viewState) {
            const viewState: PropertyGroupViewState = node.viewState as PropertyGroupViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitPublish?(node: Publish) {
        if (node.viewState) {
            const viewState: PublishViewState = node.viewState as PublishViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitScript?(node: Script) {
        if (node.viewState) {
            const viewState: ScriptViewState = node.viewState as ScriptViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitSequence?(node: Sequence) {
        if (node.viewState) {
            const viewState: SequenceViewState = node.viewState as SequenceViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitSmooks?(node: Smooks) {
        if (node.viewState) {
            const viewState: SmooksViewState = node.viewState as SmooksViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitSpring?(node: Spring) {
        if (node.viewState) {
            const viewState: SpringViewState = node.viewState as SpringViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitStore?(node: Store) {
        if (node.viewState) {
            const viewState: StoreViewState = node.viewState as StoreViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitTransaction?(node: Transaction) {
        if (node.viewState) {
            const viewState: TransactionViewState = node.viewState as TransactionViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitURLrewrite?(node: URLrewrite) {
        if (node.viewState) {
            const viewState: URLrewriteViewState = node.viewState as URLrewriteViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitXQuery?(node: XQuery) {
        if (node.viewState) {
            const viewState: XQueryViewState = node.viewState as XQueryViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitXSLT?(node: XSLT) {
        if (node.viewState) {
            const viewState: XSLTViewState = node.viewState as XSLTViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitBam?(node: Bam) {
        if (node.viewState) {
            const viewState: BamViewState = node.viewState as BamViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitBean?(node: Bean) {
        if (node.viewState) {
            const viewState: BeanViewState = node.viewState as BeanViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitBuilder?(node: Builder) {
        if (node.viewState) {
            const viewState: BuilderViewState = node.viewState as BuilderViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitCallout?(node: Callout) {
        if (node.viewState) {
            const viewState: CalloutViewState = node.viewState as CalloutViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }
    beginVisitCallTemplate?(node: CallTemplate) {
        if (node.viewState) {
            const viewState: CallTemplateViewState = node.viewState as CallTemplateViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitClass?(node: Class) {
        if (node.viewState) {
            const viewState: ClassViewState = node.viewState as ClassViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitCommand?(node: Command) {
        if (node.viewState) {
            const viewState: CommandViewState = node.viewState as CommandViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitConditionalRouter?(node: ConditionalRouter) {
        if (node.viewState) {
            const viewState: ConditionalRouterViewState = node.viewState as ConditionalRouterViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitDataMapper?(node: DataMapper) {
        if (node.viewState) {
            const viewState: DataMapperViewState = node.viewState as DataMapperViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitDataServiceCall?(node: DataServiceCall) {
        if (node.viewState) {
            const viewState: DataServiceCallViewState = node.viewState as DataServiceCallViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitDBLookup?(node: DBLookup) {
        if (node.viewState) {
            const viewState: DBLookupViewState = node.viewState as DBLookupViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitDBReport?(node: DBReport) {
        if (node.viewState) {
            const viewState: DBReportViewState = node.viewState as DBReportViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitDrop?(node: Drop) {
        if (node.viewState) {
            const viewState: DropViewState = node.viewState as DropViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitEjb?(node: Ejb) {
        if (node.viewState) {
            const viewState: EjbViewState = node.viewState as EjbViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitEnqueue?(node: Enqueue) {
        if (node.viewState) {
            const viewState: EnqueueViewState = node.viewState as EnqueueViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitEnrich?(node: Enrich) {
        if (node.viewState) {
            const viewState: EnrichViewState = node.viewState as EnrichViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitEvent?(node: Event) {
        if (node.viewState) {
            const viewState: EventViewState = node.viewState as EventViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitFastXSLT?(node: FastXSLT) {
        if (node.viewState) {
            const viewState: FastXSLTViewState = node.viewState as FastXSLTViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitFault?(node: Fault) {
        if (node.viewState) {
            const viewState: FaultViewState = node.viewState as FaultViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitHeader?(node: Header) {
        if (node.viewState) {
            const viewState: HeaderViewState = node.viewState as HeaderViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitJsonTransform?(node: JsonTransform) {
        if (node.viewState) {
            const viewState: JsonTransformViewState = node.viewState as JsonTransformViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitLoopBack?(node: LoopBack) {
        if (node.viewState) {
            const viewState: LoopBackViewState = node.viewState as LoopBackViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitNtlm?(node: Ntlm) {
        if (node.viewState) {
            const viewState: NtlmViewState = node.viewState as NtlmViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitOauth?(node: Oauth) {
        if (node.viewState) {
            const viewState: OauthViewState = node.viewState as OauthViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitPayloadFactory?(node: PayloadFactory) {
        if (node.viewState) {
            const viewState: PayloadFactoryViewState = node.viewState as PayloadFactoryViewState;
            viewState.bBox.cx = viewState.bBox.x + viewState.bBox.r;
            viewState.bBox.cy = viewState.bBox.y + viewState.bBox.r;
        }
    }

    beginVisitIterate?(node: Iterate) {
        if (node.viewState) {
            const viewState: IterateViewState = node.viewState as IterateViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }

                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

    beginVisitRule?(node: Rule) {
        if (node.viewState) {
            const viewState: RuleViewState = node.viewState as RuleViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }

                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

    beginVisitSwitch?(node: Switch) {
        if (node.viewState) {
            const viewState: SwitchViewState = node.viewState as SwitchViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }

                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

    beginVisitThrottle?(node: Throttle) {
        if (node.viewState) {
            const viewState: ThrottleViewState = node.viewState as ThrottleViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }

                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

    beginVisitValidate?(node: Validate) {
        if (node.viewState) {
            const viewState: ValidateViewState = node.viewState as ValidateViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }

                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

    beginVisitAggregate?(node: Aggregate) {
        if (node.viewState) {
            const viewState: AggregateViewState = node.viewState as AggregateViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }

                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

    beginVisitCache?(node: Cache) {
        if (node.viewState) {
            const viewState: CacheViewState = node.viewState as CacheViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }

                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

    beginVisitCall?(node: Call) {
        if (node.viewState) {
            const viewState: CallViewState = node.viewState as CallViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }

                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

    beginVisitClone?(node: Clone) {
        if (node.viewState) {
            const viewState: CloneViewState = node.viewState as CloneViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }

                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

    beginVisitEntitlement?(node: Entitlement) {
        if (node.viewState) {
            const viewState: EntitlementViewState = node.viewState as EntitlementViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }

                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

    beginVisitFilter?(node: Filter) {
        if (node.viewState) {
            const viewState: FilterViewState = node.viewState as FilterViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }

                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

    beginVisitForEach?(node: ForEach) {
        if (node.viewState) {
            const viewState: ForEachViewState = node.viewState as ForEachViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (node.children === undefined) {
                return;
            }

            node.children.forEach((child, index) => {
                const childVS = child.viewState as any;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case node.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }

                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }
}
