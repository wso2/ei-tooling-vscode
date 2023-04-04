import * as Synapse from "./syntax-tree-interfaces";

export interface Visitor {
    beginVisitSTNode?(node: Synapse.STNode, parent?: Synapse.STNode): void;
    endVisitSTNode?(node: Synapse.STNode, parent?: Synapse.STNode): void;

    beginVisitMediator?(node: Synapse.Mediator, parent?: Synapse.STNode): void;
    endVisitMediator?(node: Synapse.Mediator, parent?: Synapse.STNode): void;

    beginVisitConnector?(node: Synapse.Connector, parent?: Synapse.STNode): void;
    endVisitConnector?(node: Synapse.Connector, parent?: Synapse.STNode): void;

}