/// <reference types="react" />
import { STNode } from "@wso2-ei/syntax-tree";
export interface MediatorProps {
    model: STNode;
}
export declare function STNode(props: MediatorProps): JSX.Element;
export * from "./MediatorSVG";
