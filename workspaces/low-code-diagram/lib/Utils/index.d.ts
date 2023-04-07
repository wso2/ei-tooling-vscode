import { STNode } from "@wso2-ei/syntax-tree";
export declare function sizingAndPositioning(st: STNode): STNode;
export declare function recalculateSizingAndPositioning(st: STNode): {
    kind: string;
    value?: any;
    parent?: STNode;
    viewState?: any;
    position?: any;
};
