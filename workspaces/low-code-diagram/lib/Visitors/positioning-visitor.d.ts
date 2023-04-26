import { Api, InSequence, Log, Mediator, OutSequence, Proxy, Resource, Respond, Send, Visitor } from "@wso2-ei/syntax-tree";
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
}
