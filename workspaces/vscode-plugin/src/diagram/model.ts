import {Uri} from "vscode";

export interface DiagramOptions {
    startLine?: number;
    startColumn?: number;
    isDiagram: boolean;
    fileUri?: Uri;
    diagramFocus?: DiagramFocus;
    workspaceName?: string;
}

export interface DiagramFocus {
    fileUri: string;
    // position?: NodePosition;
}