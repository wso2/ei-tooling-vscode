import { Api, InSequence, Log, Mediator, OutSequence, Proxy, Resource, Respond, Send, Visitor } from '@wso2-ei/syntax-tree';
export declare const DEFAULT_SHAPE_DIMENSION = 100;
export declare const COMPONENT_GAP = 20;
export declare const NAME_GAP = 5;
export declare const NAME_HEIGHT = 13;
export declare class SizingVisitor implements Visitor {
    endVisitMediator?(node: Mediator): void;
    endVisitApi?(node: Api): void;
    endVisitProxy?(node: Proxy): void;
    endVisitInSequence?(node: InSequence): void;
    endVisitOutSequence?(node: OutSequence): void;
    endVisitLog?(node: Log): void;
    endVisitRespond?(node: Respond): void;
    endVisitResource?(node: Resource): void;
    endVisitSend?(node: Send): void;
}
