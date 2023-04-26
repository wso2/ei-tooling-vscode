import { STNode, Visitor } from "@wso2-ei/syntax-tree";
import React from "react";
export declare function sizingAndPositioning(st: STNode): STNode;
export declare function recalculateSizingAndPositioning(st: STNode): {
    tag: string;
    value?: any;
    parent?: STNode | undefined;
    viewState?: any;
    position?: any;
};
export declare function traverse(el: STNode, visitor: Visitor): void;
export declare function getSTComponent(node: any): React.ReactElement;
