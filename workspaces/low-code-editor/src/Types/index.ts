import { NodePosition, STNode } from "@wso2-ei/syntax-tree";

export interface LowCodeEditorState {
    triggerUpdated: boolean; // FIXME Moving existing prop manipulated in memory into state
    isConfigOverlayFormOpen: boolean;
    targetPosition: NodePosition; // FIXME check and remove usage of update position if not used anymore
    currentFunctionNode?: STNode;
    experimentalEnabled?: boolean;
    syntaxTree: STNode;
}