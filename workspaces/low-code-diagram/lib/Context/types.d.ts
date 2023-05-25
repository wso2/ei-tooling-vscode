/**
 * Copyright (c) 2023, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
import { NodePosition, STNode } from "@wso2-ei/syntax-tree";
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
export interface ZoomStatus {
    scale: number;
    panX: number;
    panY: number;
}
