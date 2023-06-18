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

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitRespond?(node: Respond) {
        if (node.viewState) {
            const viewState: RespondViewState = node.viewState as RespondViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitSend?(node: Send) {
        if (node.viewState) {
            const viewState: SendViewState = node.viewState as SendViewState;

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

    endVisitPublish?(node: Publish) {
        if (node.viewState) {
            const viewState: PublishViewState = node.viewState as PublishViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitScript?(node: Script) {
        if (node.viewState) {
            const viewState: ScriptViewState = node.viewState as ScriptViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitSequence?(node: Sequence) {
        if (node.viewState) {
            const viewState: SequenceViewState = node.viewState as SequenceViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitSmooks?(node: Smooks) {
        if (node.viewState) {
            const viewState: SmooksViewState = node.viewState as SmooksViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitSpring?(node: Spring) {
        if (node.viewState) {
            const viewState: SpringViewState = node.viewState as SpringViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitStore?(node: Store) {
        if (node.viewState) {
            const viewState: StoreViewState = node.viewState as StoreViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitTransaction?(node: Transaction) {
        if (node.viewState) {
            const viewState: TransactionViewState = node.viewState as TransactionViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitURLrewrite?(node: URLrewrite) {
        if (node.viewState) {
            const viewState: URLrewriteViewState = node.viewState as URLrewriteViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitXQuery?(node: XQuery) {
        if (node.viewState) {
            const viewState: XQueryViewState = node.viewState as XQueryViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitXSLT?(node: XSLT) {
        if (node.viewState) {
            const viewState: XSLTViewState = node.viewState as XSLTViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitBam?(node: Bam) {
        if (node.viewState) {
            const viewState: BamViewState = node.viewState as BamViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitBean?(node: Bean) {
        if (node.viewState) {
            const viewState: BeanViewState = node.viewState as BeanViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitBuilder?(node: Builder) {
        if (node.viewState) {
            const viewState: BuilderViewState = node.viewState as BuilderViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitCallout?(node: Callout) {
        if (node.viewState) {
            const viewState: CalloutViewState = node.viewState as CalloutViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitCallTemplate?(node: CallTemplate) {
        if (node.viewState) {
            const viewState: CallTemplateViewState = node.viewState as CallTemplateViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitClass?(node: Class) {
        if (node.viewState) {
            const viewState: ClassViewState = node.viewState as ClassViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitCommand?(node: Command) {
        if (node.viewState) {
            const viewState: CommandViewState = node.viewState as CommandViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitConditionalRouter?(node: ConditionalRouter) {
        if (node.viewState) {
            const viewState: ConditionalRouterViewState = node.viewState as ConditionalRouterViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitDataMapper?(node: DataMapper) {
        if (node.viewState) {
            const viewState: DataMapperViewState = node.viewState as DataMapperViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitDataServiceCall?(node: DataServiceCall) {
        if (node.viewState) {
            const viewState: DataServiceCallViewState = node.viewState as DataServiceCallViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitDBLookup?(node: DBLookup) {
        if (node.viewState) {
            const viewState: DBLookupViewState = node.viewState as DBLookupViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitDBReport?(node: DBReport) {
        if (node.viewState) {
            const viewState: DBReportViewState = node.viewState as DBReportViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitDrop?(node: Drop) {
        if (node.viewState) {
            const viewState: DropViewState = node.viewState as DropViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitEjb?(node: Ejb) {
        if (node.viewState) {
            const viewState: EjbViewState = node.viewState as EjbViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitEnqueue?(node: Enqueue) {
        if (node.viewState) {
            const viewState: EnqueueViewState = node.viewState as EnqueueViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitEnrich?(node: Enrich) {
        if (node.viewState) {
            const viewState: EnrichViewState = node.viewState as EnrichViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitEvent?(node: Event) {
        if (node.viewState) {
            const viewState: EventViewState = node.viewState as EventViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitFastXSLT?(node: FastXSLT) {
        if (node.viewState) {
            const viewState: FastXSLTViewState = node.viewState as FastXSLTViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitFault?(node: Fault) {
        if (node.viewState) {
            const viewState: FaultViewState = node.viewState as FaultViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitHeader?(node: Header) {
        if (node.viewState) {
            const viewState: HeaderViewState = node.viewState as HeaderViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitJsonTransform?(node: JsonTransform) {
        if (node.viewState) {
            const viewState: JsonTransformViewState = node.viewState as JsonTransformViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitLoopBack?(node: LoopBack) {
        if (node.viewState) {
            const viewState: LoopBackViewState = node.viewState as LoopBackViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitNtlm?(node: Ntlm) {
        if (node.viewState) {
            const viewState: NtlmViewState = node.viewState as NtlmViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitOauth?(node: Oauth) {
        if (node.viewState) {
            const viewState: OauthViewState = node.viewState as OauthViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitPayloadFactory?(node: PayloadFactory) {
        if (node.viewState) {
            const viewState: PayloadFactoryViewState = node.viewState as PayloadFactoryViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitProperty?(node: Property) {
        if (node.viewState) {
            const viewState: PropertyViewState = node.viewState as PropertyViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
        }
    }

    endVisitPropertyGroup?(node: PropertyGroup) {
        if (node.viewState) {
            const viewState: PropertyGroupViewState = node.viewState as PropertyGroupViewState;

            if (node.children !== undefined && node.children.length > 0) {
                let height = COMPONENT_GAP;

                node.children.forEach(child => {
                    const childVS = child.viewState as any;
                    if (childVS !== undefined) {
                        height += childVS.bBox.h + COMPONENT_GAP;
                    }
                })

                viewState.bBox.r = height / 2;
                viewState.bBox.h = height;
                viewState.bBox.w = height;
            } else {
                viewState.bBox.r = DEFAULT_SHAPE_DIMENSION / 2;
                viewState.bBox.h = DEFAULT_SHAPE_DIMENSION;
                viewState.bBox.w = DEFAULT_SHAPE_DIMENSION;
            }
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