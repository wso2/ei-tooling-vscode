import React from "react";
import {LowCodeDiagramGenerator} from "..";
import { DiagramGenErrorBoundary } from "../ErrorBoundary";
import {NodePosition} from "@wso2-ei/syntax-tree";
import {DiagramEditorLangClientInterface} from "@wso2-ei/low-code-editor-commons/lib";

export interface DiagramFocus {
    filePath: string;
    position?: NodePosition;
}

export interface Uri {
    fsPath: string
    external: string
    path: string;
    sheme: string;
}

export interface WorkspaceFolder {
    readonly uri: Uri;
    readonly name: string;
    readonly index: number;
}

export interface EditorState {
    filePath: string;
    fileUri: Uri;
    // projectPaths: WorkspaceFolder[],
    langClientPromise: Promise<DiagramEditorLangClientInterface>;
    // startColumn: number; // TODO: remove
    // startLine: number; // TODO: remove
    lastUpdatedAt: string;
    // diagramFocus: DiagramFocus;
    // workspaceName: string;
}

export interface EditorAPI {
    getFileContent: (url: string) => Promise<string>;
    updateFileContent: (filePath: string, content: string, skipForceSave?: boolean) => Promise<boolean>;
    gotoSource: (filePath: string, position: { startLine: number, startColumn: number }) => Promise<boolean>;
    // showPerformanceGraph: () => Promise<boolean>;
    // getAllFiles?: (regex?: string, ignoreGlob?: string) => Promise<Uri[]>; // TODO: make this not optional, added to get rid of test failures
    // // TODO: move to a seperate interface
    // getPerfDataFromChoreo: (data: any, analyzeType: ANALYZE_TYPE) => Promise<PerformanceAnalyzerRealtimeResponse | PerformanceAnalyzerAdvancedResponse | undefined>;
    // showMessage: () => Promise<boolean>;
    // resolveMissingDependency: (filePath: string, fileContent: string) => Promise<GetSyntaxTreeResponse>;
    // resolveMissingDependencyByCodeAction: (filePath: string, fileContent: string, diagnostic: any) => Promise<boolean>;
    // runCommand: (command: PALETTE_COMMANDS, args: any[]) => Promise<boolean>;
    // runBackgroundTerminalCommand?: (command: string) => Promise<CommandResponse>;
    // openArchitectureView?: (nodeId: string) => Promise<boolean>;
    // sendTelemetryEvent: (event: LowcodeEvent) => Promise<void>;
    // getLibrariesList: (kind?: LibraryKind) => Promise<LibraryDocResponse | undefined>;
    // getLibrariesData: () => Promise<LibrarySearchResponse | undefined>;
    // getLibraryData: (orgName: string, moduleName: string, version: string) => Promise<LibraryDataResponse | undefined>;
    // getSentryConfig: () => Promise<SentryConfig | undefined>;
    // getBallerinaVersion: () => Promise<string | undefined>;
    // getEnv: (name: string) => Promise<any>;
    // openExternalUrl: (url: string) => Promise<boolean>;
}

export type EditorProps = EditorState & EditorAPI;

// export const WorkspaceOverview: React.FC<EditorProps> = (props: EditorProps) => {
//     return (
//         <OverviewDiagramGenerator
//             {...props}
//         />
//     )
// }

export const Diagram: React.FC<EditorProps> = (props: EditorProps) => {

    console.log("inside Diagram generator Diagram")

    const { getFileContent, updateFileContent, gotoSource, ...restProps } = props;
    const [state, setState] = React.useState<EditorState>(restProps);

    React.useEffect(() => {
        setState(restProps);
    }, [restProps.lastUpdatedAt]);

    return (
        <div className="lowcode-main-wrapper">
            <DiagramGenErrorBoundary lastUpdatedAt={restProps.lastUpdatedAt}>
                <LowCodeDiagramGenerator
                    {...state}
                    getFileContent={getFileContent}
                    updateFileContent={updateFileContent}
                    gotoSource={gotoSource}                />
            </DiagramGenErrorBoundary>
        </div>
    );
}