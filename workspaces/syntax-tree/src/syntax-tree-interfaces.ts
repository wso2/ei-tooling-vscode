export interface STNode {
    kind: string;
    value?: any;
    parent?: STNode;
    viewState?: any;
    position?: any;
}

export interface Mediator extends STNode {
    children: Mediator[];
}

export interface Connector extends STNode {

}

export interface NodePosition {
    startLine?: number;
    startColumn?: number;
    endLine?: number;
    endColumn?: number;
}

export interface Minutiae {
    isInvalid: boolean;
    kind: string;
    minutiae: string;
}