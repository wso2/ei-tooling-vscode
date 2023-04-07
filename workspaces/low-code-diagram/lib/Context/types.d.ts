import { NodePosition, STNode } from "@wso2-ei/syntax-tree";
export declare enum ViewMode {
    INTERACTION = "Interaction",
    STATEMENT = "Statement"
}
export interface LowCodeDiagramProps extends LowCodeDiagramProperties {
    api?: LowCodeDiagramAPI;
    experimentalEnabled?: boolean;
}
export interface LowCodeDiagramContext {
    state: LowCodeDiagramState;
    actions: LowCodeDiagramActions;
    api?: LowCodeDiagramAPI;
    props: LowCodeDiagramProperties;
}
export interface LowCodeDiagramState {
    triggerUpdated: boolean;
    isDataMapperShown: boolean;
    isConfigOverlayFormOpen: boolean;
    targetPosition: NodePosition;
    isDiagramFunctionExpanded: boolean;
    experimentalEnabled?: boolean;
}
export interface LowCodeDiagramActions {
    updateState: (payload: LowCodeDiagramState) => void;
    diagramCleanDraw: (payload: STNode) => void;
    diagramRedraw: (payload: STNode) => void;
    insertComponentStart: (payload: NodePosition) => void;
    editorComponentStart: (payload: STNode) => void;
}
export interface LowCodeDiagramAPI {
}
export interface LowCodeDiagramProperties {
    syntaxTree: STNode;
    fullST?: STNode;
    isReadOnly: boolean;
    error?: Error;
    selectedPosition?: SelectedPosition;
    zoomStatus?: ZoomStatus;
    experimentalEnabled?: boolean;
    onDiagramDoubleClick?: () => void;
    getListenerSignature?: (functionNode: STNode) => Promise<string>;
}
export interface SelectedPosition {
    startLine: number;
    startColumn: number;
}
export interface FunctionProperties {
    overlayId: string;
    overlayNode: HTMLDivElement;
    functionNode: STNode;
    hasWorker: boolean;
    viewMode: ViewMode;
}
export interface ZoomStatus {
    scale: number;
    panX: number;
    panY: number;
}
