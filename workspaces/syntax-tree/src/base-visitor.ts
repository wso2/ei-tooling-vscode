import * as Synapse from "./syntax-tree-interfaces";

export interface Visitor {
    beginVisitSTNode?(node: Synapse.STNode): void;
    endVisitSTNode?(node: Synapse.STNode): void;

    beginVisitMediator?(node: Synapse.Mediator): void;
    endVisitMediator?(node: Synapse.Mediator): void;

    beginVisitConnector?(node: Synapse.Connector): void;
    endVisitConnector?(node: Synapse.Connector): void;

    beginVisitApi?(node: Synapse.Mediator): void;
    endVisitApi?(node: Synapse.Mediator): void;

    beginVisitProxy?(node: Synapse.Mediator): void;
    endVisitProxy?(node: Synapse.Mediator): void;

    beginVisitInSequence?(node: Synapse.Mediator): void;
    endVisitInSequence?(node: Synapse.Mediator): void;

    beginVisitOutSequence?(node: Synapse.Mediator): void;
    endVisitOutSequence?(node: Synapse.Mediator): void;

    beginVisitLog?(node: Synapse.Mediator): void;
    endVisitLog?(node: Synapse.Mediator): void;

    beginVisitResource?(node: Synapse.Mediator): void;
    endVisitResource?(node: Synapse.Mediator): void;

    beginVisitRespond?(node: Synapse.Mediator): void;
    endVisitRespond?(node: Synapse.Mediator): void;

    beginVisitSend?(node: Synapse.Mediator): void;
    endVisitSend?(node: Synapse.Mediator): void;

}