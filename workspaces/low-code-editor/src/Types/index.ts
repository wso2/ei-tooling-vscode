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
    // helpPanel?: {
    //     openConnectorHelp: (connector?: Partial<Connector>, method?: string) => void;
    // }
    // notifications?: {
    //     triggerErrorNotification?: (msg: Error | string) => void;
    //     triggerSuccessNotification?: (msg: Error | string) => void;
    // }
    ls: {
        getDiagramEditorLangClient?: () => Promise<DiagramEditorLangClientInterface>;
        // getExpressionEditorLangClient?: () => Promise<ExpressionEditorLangClientInterface>;
    }
    // This has to come from Lang-server
    // insights: {
    //     onEvent?: (event: any) => void;
    // }
    code: {
        // modifyDiagram: (mutations: STModification[], options?: any) => Promise<void>;
        // onMutate?: (type: string, options: any) => void;
        // Reuse go-to-def from LangServer?
        // setCodeLocationToHighlight?: (position: NodePosition) => void;
        gotoSource: (position: { startLine: number, startColumn: number }, filePath?: string) => void;
        // getFunctionDef: (lineRange: Range, defFilePath: string) => Promise<FunctionDef>;
        // updateFileContent: (content: string, skipForceSave?: boolean) => Promise<boolean>;
        // isMutationInProgress: boolean;
        // isModulePullInProgress: boolean;
        // loaderText: string;
        // undo: () => Promise<void>;
    }
    // FIXME Doesn't make sense to take these methods below from outside
    // Move these inside and get an external API for pref persistance
    // against a unique ID (eg AppID) for rerender from prev state
    // panNZoom?: {
    //     pan: (panX: number, panY: number) => void;
    //     fitToScreen: () => void;
    //     zoomIn: () => void;
    //     zoomOut: () => void;
    // };
    // configPanel?: {
    //     dispactchConfigOverlayForm: (
    //         type: string, targetPosition: NodePosition,
    //         wizardType: WizardType, blockViewState?: BlockViewState, config?: ConditionConfig,
    //         symbolInfo?: STSymbolInfo, model?: STNode) => void;
    //     closeConfigOverlayForm: () => void;
    //     configOverlayFormPrepareStart: () => void;
    //     closeConfigPanel: () => void;
    // }
    // webView: {
    //     showTryitView: (serviceName: string) => void;
    //     showDocumentationView?: (url: string) => void;
    // }
    project: {
        run: (args: any[]) => void;
    }
    // library?: {
    //     getLibrariesList: (kind?: string) => Promise<LibraryDocResponse>;
    //     getLibrariesData: () => Promise<LibrarySearchResponse>;
    //     getLibraryData: (orgName: string, moduleName: string, version: string) => Promise<LibraryDataResponse>;
    // };
    // runBackgroundTerminalCommand?: (command: string) => Promise<CommandResponse>;
    // openArchitectureView?: (nodeId: string) => Promise<boolean>;
    // openExternalUrl?: (url: string) => Promise<boolean>;
    // navigation: {
    //     updateActiveFile: (currentFile: FileListEntry) => void;
    //     updateSelectedComponent: (info: ComponentViewInfo) => void;
    //     navigateUptoParent: (position: NodePosition) => void;
    // }
}

export interface LowCodeEditorProps extends LowCodeEditorProperties {
    api: LowCodeEditorAPI;
}