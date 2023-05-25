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
import { DiagramEditorLangClientInterface } from "@wso2-ei/low-code-editor-commons/lib";

export interface LowCodeEditorState {
    triggerUpdated: boolean; // FIXME Moving existing prop manipulated in memory into state
    isConfigOverlayFormOpen: boolean;
    targetPosition: NodePosition; // FIXME check and remove usage of update position if not used anymore
    currentFunctionNode?: STNode;
    experimentalEnabled?: boolean;
    syntaxTree: STNode;
}

export interface LowCodeEditorContext {
    state: LowCodeEditorState;
    actions: LowCodeEditorActions;
    api: LowCodeEditorAPI;
    props: LowCodeEditorProperties;
}

export interface FileListEntry {
    fileName: string;
    uri: Uri;
}

export interface Uri {
    fsPath: string
    external: string
    path: string;
    scheme: string;
}

export interface CurrentFile {
    content: string;
    path: string;
    uri: Uri
    size: number;
}

export interface UserState {
    selectedOrgHandle: string;
    user: {
        email: string;
    }
}

export interface LowCodeEditorProperties {
    userInfo?: UserState;
    currentFile: CurrentFile;
    fileList: FileListEntry[];
    syntaxTree: STNode;
    fullST: STNode;
    originalSyntaxTree: STNode;
    // stSymbolInfo: STSymbolInfo;
    // connectors?: BallerinaConnectorInfo[];
    // diagnostics?: Diagnostic[];
    // warnings?: Warning[];
    error?: Error;
    langServerURL: string;
    // configOverlayFormStatus: ConfigOverlayFormStatus;
    // configPanelStatus: ConfigPanelStatus;
    isConfigPanelOpen?: boolean;
    isCodeEditorActive: boolean;
    isLoadingAST?: boolean;
    isPerformanceViewOpen: boolean;
    isLoadingSuccess: boolean;
    isWaitingOnWorkspace: boolean;
    isMutationProgress: boolean;
    isCodeChangeInProgress: boolean;
    isReadOnly: boolean;
    zoomStatus: ZoomStatus;
    selectedPosition?: SelectedPosition;
    importStatements: string[];
    experimentalEnabled?: boolean;
    lowCodeResourcesVersion?: string;
    ballerinaVersion?: string;
    environment?: string;
    isCodeServerInstance?: boolean;
    openInDiagram?: NodePosition;
}

export interface SelectedPosition {
    startLine: number;
    startColumn: number;
}

export interface ZoomStatus {
    scale: number,
    panX: number,
    panY: number,
}

export interface LowCodeEditorActions {
    updateState: (payload: LowCodeEditorState) => void;
    diagramCleanDraw: (payload: STNode) => void;
    diagramRedraw: (payload: STNode) => void;
    insertComponentStart: (payload: NodePosition) => void;
    editorComponentStart: (payload: NodePosition) => void;
    toggleDiagramOverlay: () => void;
    setTriggerUpdated: (isUpdated: boolean) => void;
}

export interface LowCodeEditorAPI {
    ls: {
        getDiagramEditorLangClient?: () => Promise<DiagramEditorLangClientInterface>;
        // getExpressionEditorLangClient?: () => Promise<ExpressionEditorLangClientInterface>;
    }
    code: {
        gotoSource: (position: { startLine: number, startColumn: number }, filePath?: string) => void;
    }
    project: {
        run: (args: any[]) => void;
    }
}

export interface LowCodeEditorProps extends LowCodeEditorProperties {
    api: LowCodeEditorAPI;
}
