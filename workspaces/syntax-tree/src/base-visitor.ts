import * as Synapse from "./syntax-tree-interfaces";

export interface Visitor {
    beginVisitSTNode?(node: Synapse.STNode): void;
    endVisitSTNode?(node: Synapse.STNode): void;

    beginVisitMediator?(node: Synapse.Mediator): void;
    endVisitMediator?(node: Synapse.Mediator): void;

    beginVisitConnector?(node: Synapse.Connector): void;
    endVisitConnector?(node: Synapse.Connector): void;

}