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

export const DEFAULT_SHAPE_DIMENSION = 70;
export const COMPONENT_GAP = 20;

function updateCircleViewState(node: any, viewState: any) {
    console.log("test - 1 view state");
    // if (node.children !== undefined && node.children.length > 0) {
    //     let height = COMPONENT_GAP;

    //     node.children.forEach((child: any) => {
    //         const childVS = child.viewState as any;
    //         if (childVS !== undefined) {
    //             height += childVS.bBox.h + COMPONENT_GAP;
    //         }
    //     });

    //     viewState.bBox.r = height / 2;
    //     viewState.bBox.h = height;
    //     viewState.bBox.w = height;
    // } else {
    //     viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
    //     viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
    //     viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
    // }
}

export class SizingVisitor implements Visitor {

    endVisitMediator?(node: Mediator) {
        if (node.viewState) {
            const viewState: MediatorViewState = node.viewState as MediatorViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS: MediatorViewState = child.viewState as MediatorViewState;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitApi?(node: Api) {
        if (node.viewState) {
            const viewState: ApiViewState = node.viewState as ApiViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                        if (width < childVS.bBox.w) {
                            width += childVS.bBox.w;
                        }
                    }
                })

                viewState.bBox.h = height;
                viewState.bBox.w = width + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitProxy?(node: Proxy) {
        if (node.viewState) {
            const viewState: ProxyViewState = node.viewState as ProxyViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                        if (width < childVS.bBox.w) {
                            width += childVS.bBox.w;
                        }
                    }
                })

                viewState.bBox.h = height;
                viewState.bBox.w = width + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitInSequence?(node: InSequence) {
        if (node.viewState) {
            const viewState: InSequenceViewState = node.viewState as InSequenceViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h + COMPONENT_GAP;
                        }
                    }
                })

                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitOutSequence?(node: OutSequence) {
        if (node.viewState) {
            const viewState: OutSequenceViewState = node.viewState as OutSequenceViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                })

                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitResource?(node: Resource) {
        if (node.viewState) {
            const viewState: ResourceViewState = node.viewState as ResourceViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                        if (width < childVS.bBox.w) {
                            width += childVS.bBox.w;
                        }
                    }
                })

                viewState.bBox.h = height;
                viewState.bBox.w = width + COMPONENT_GAP * 2;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitLog?(node: Log) {
        if (node.viewState) {
            const viewState: LogViewState = node.viewState as LogViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitRespond?(node: Respond) {
        if (node.viewState) {
            const viewState: RespondViewState = node.viewState as RespondViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitSend?(node: Send) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as SendViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitPublish?(node: Publish) {
        if (node.viewState) {
            const viewState: PublishViewState = node.viewState as PublishViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitScript?(node: Script) {
        if (node.viewState) {
            const viewState: ScriptViewState = node.viewState as ScriptViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitSequence?(node: Sequence) {
        if (node.viewState) {
            const viewState: SequenceViewState = node.viewState as SequenceViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitSmooks?(node: Smooks) {
        if (node.viewState) {
            const viewState: SmooksViewState = node.viewState as SmooksViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitSpring?(node: Spring) {
        if (node.viewState) {
            const viewState: SpringViewState = node.viewState as SpringViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitStore?(node: Store) {
        if (node.viewState) {
            const viewState: StoreViewState = node.viewState as StoreViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitTransaction?(node: Transaction) {
        if (node.viewState) {
            const viewState: TransactionViewState = node.viewState as TransactionViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitURLrewrite?(node: URLrewrite) {
        if (node.viewState) {
            const viewState: URLrewriteViewState = node.viewState as URLrewriteViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitXQuery?(node: XQuery) {
        if (node.viewState) {
            const viewState: XQueryViewState = node.viewState as XQueryViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitXSLT?(node: XSLT) {
        if (node.viewState) {
            const viewState: XSLTViewState = node.viewState as XSLTViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitBam?(node: Bam) {
        if (node.viewState) {
            const viewState: BamViewState = node.viewState as BamViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitBean?(node: Bean) {
        if (node.viewState) {
            const viewState: BeanViewState = node.viewState as BeanViewState;
            updateCircleViewState(node, viewState); 
        }
    }

    endVisitBuilder?(node: Builder) {
        if (node.viewState) {
            const viewState: BuilderViewState = node.viewState as BuilderViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitCallout?(node: Callout) {
        if (node.viewState) {
            const viewState: CalloutViewState = node.viewState as CalloutViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitCallTemplate?(node: CallTemplate) {
        if (node.viewState) {
            const viewState: CallTemplateViewState = node.viewState as CallTemplateViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitClass?(node: Class) {
        if (node.viewState) {
            const viewState: ClassViewState = node.viewState as ClassViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitCommand?(node: Command) {
        if (node.viewState) {
            const viewState: CommandViewState = node.viewState as CommandViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitConditionalRouter?(node: ConditionalRouter) {
        if (node.viewState) {
            const viewState: ConditionalRouterViewState = node.viewState as ConditionalRouterViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitDataMapper?(node: DataMapper) {
        if (node.viewState) {
            const viewState: DataMapperViewState = node.viewState as DataMapperViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitDataServiceCall?(node: DataServiceCall) {
        if (node.viewState) {
            const viewState: DataServiceCallViewState = node.viewState as DataServiceCallViewState;
            updateCircleViewState(node, viewState); 
        }
    }

    endVisitDBLookup?(node: DBLookup) {
        if (node.viewState) {
            const viewState: DBLookupViewState = node.viewState as DBLookupViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitDBReport?(node: DBReport) {
        if (node.viewState) {
            const viewState: DBReportViewState = node.viewState as DBReportViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitDrop?(node: Drop) {
        if (node.viewState) {
            const viewState: DropViewState = node.viewState as DropViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitEjb?(node: Ejb) {
        if (node.viewState) {
            const viewState: EjbViewState = node.viewState as EjbViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitEnqueue?(node: Enqueue) {
        if (node.viewState) {
            const viewState: EnqueueViewState = node.viewState as EnqueueViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitEnrich?(node: Enrich) {
        if (node.viewState) {
            const viewState: EnrichViewState = node.viewState as EnrichViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitEvent?(node: Event) {
        if (node.viewState) {
            const viewState: EventViewState = node.viewState as EventViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitFastXSLT?(node: FastXSLT) {
        if (node.viewState) {
            const viewState: FastXSLTViewState = node.viewState as FastXSLTViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitFault?(node: Fault) {
        if (node.viewState) {
            const viewState: FaultViewState = node.viewState as FaultViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitHeader?(node: Header) {
        if (node.viewState) {
            const viewState: HeaderViewState = node.viewState as HeaderViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitJsonTransform?(node: JsonTransform) {
        if (node.viewState) {
            const viewState: JsonTransformViewState = node.viewState as JsonTransformViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitLoopBack?(node: LoopBack) {
        if (node.viewState) {
            const viewState: LoopBackViewState = node.viewState as LoopBackViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitNtlm?(node: Ntlm) {
        if (node.viewState) {
            const viewState: NtlmViewState = node.viewState as NtlmViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitOauth?(node: Oauth) {
        if (node.viewState) {
            const viewState: OauthViewState = node.viewState as OauthViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitPayloadFactory?(node: PayloadFactory) {
        if (node.viewState) {
            const viewState: PayloadFactoryViewState = node.viewState as PayloadFactoryViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitProperty?(node: Property) {
        if (node.viewState) {
            const viewState: PropertyViewState = node.viewState as PropertyViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitPropertyGroup?(node: PropertyGroup) {
        if (node.viewState) {
            const viewState: PropertyGroupViewState = node.viewState as PropertyGroupViewState;
            updateCircleViewState(node, viewState);
        }
    }

    endVisitForEach?(node: ForEach) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as ForEachViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                })

                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitIterate?(node: Iterate) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as IterateViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                })

                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitRule?(node: Rule) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as RuleViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                })

                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitSwitch?(node: Switch) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as SwitchViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                })

                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitThrottle?(node: Throttle) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as ThrottleViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                })

                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitValidate?(node: Validate) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as ValidateViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                })

                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitAggregate?(node: Aggregate) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as AggregateViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                })

                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitCache?(node: Cache) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as CacheViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                })

                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitCall?(node: Call) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as CallViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                })

                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitClone?(node: Clone) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as CloneViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                })

                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitEntitlement?(node: Entitlement) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as EntitlementViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                })

                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitFilter?(node: Filter) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as FilterViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;
                let width = 0;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        width += childVS.bBox.w + COMPONENT_GAP;
                        if (height < childVS.bBox.h) {
                            height = childVS.bBox.h;
                        }
                    }
                })

                viewState.bBox.w = width;
                viewState.bBox.h = height + COMPONENT_GAP;
            } else {
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }
}
