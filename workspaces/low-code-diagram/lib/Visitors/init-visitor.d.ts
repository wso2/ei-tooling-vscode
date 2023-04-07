import { Visitor } from "@wso2-ei/syntax-tree";
import * as Synapse from "@wso2-ei/syntax-tree";
export declare class InitVisitor implements Visitor {
    beginVisitSTNode?(node: Synapse.STNode): void;
    beginVisitMediator?(node: Synapse.Mediator): void;
    beginVisitConnector?(node: Synapse.Connector): void;
}
export declare const initVisitor: InitVisitor;
