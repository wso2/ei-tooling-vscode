import {MarkupContent, Range} from "vscode-languageserver-protocol";

export interface GetSyntaxTreeParams {
    documentIdentifier: {
        uri: string;
    };
}

export interface GetSyntaxTreeResponse {
    syntaxTree: any;
    defFilePath: string;
}

export interface CompletionParams {
    textDocument: {
        uri: string;
    };
    position: {
        line: number;
        character: number
    };
    context: {
        triggerKind: any;
    };
}

export interface PreCompletionParams {
    textDocument: {
        fsPath: string,
        uri: string;
    };
    offset: number;
    context: {
        triggerKind: any;
    };
}

export interface CompletionResponse {
    detail: string;
    insertText: string;
    insertTextFormat: number;
    kind: number;
    label: string;
    additionalTextEdits?: TextEdit[];
    documentation?: string;
    sortText?: string;
    filterText?: string;
    textEdit?: TextEdit;
}

export interface TextEdit {
    newText: string;
    range: {
        end: {
            character: number;
            line: number;
        },
        start: {
            character: number;
            line: number;
        }
    }
}

export interface ApplyEditParams {
    textDocument: {
        fsPath: string;
        uri: string;
    },
    textEdit: TextEdit
}

export interface LinePosition {
    line: number;
    offset: number;
}

export interface HoverParams {
    textDocument: {
        uri: string;
    };
    position: {
        character: number;
        line: number;
    };
}

export interface HoverResponse {
    contents: MarkupContent;
    range: Range
}