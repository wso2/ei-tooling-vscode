import { Api, InSequence, Log, Mediator, OutSequence, Proxy, Resource, Send, Visitor, STNode, Connector } from "@wso2-ei/syntax-tree";
export declare class InitVisitor implements Visitor {
    beginVisitSTNode?(node: STNode): void;
    beginVisitMediator?(node: Mediator): void;
    beginVisitConnector?(node: Connector): void;
    beginVisitApi?(node: Api): void;
    beginVisitProxy?(node: Proxy): void;
    beginVisitInSequence?(node: InSequence): void;
    beginVisitOutSequence?(node: OutSequence): void;
    beginVisitLog?(node: Send): void;
    beginVisitResource?(node: Log): void;
    beginVisitRespond?(node: Log): void;
    beginVisitSend?(node: Resource): void;
}
export declare const initVisitor: InitVisitor;
