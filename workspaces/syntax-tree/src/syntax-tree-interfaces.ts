export interface STNode {
    tag: string;
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

export interface Api extends STNode {
    children: STNode[];
}

export interface Proxy extends STNode {
    children: STNode[];
}

export interface InSequence extends STNode {
    children: STNode[];
}

export interface OutSequence extends STNode {
    children: STNode[];
}

export interface Resource extends STNode {
    children: STNode[];
}

export interface Send extends STNode {
    children: STNode[];
}

export interface Respond extends STNode {
    children: STNode[];
}

export interface Log extends STNode {
    children: STNode[];
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