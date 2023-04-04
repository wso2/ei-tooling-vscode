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

import {MarkedString, MarkupContent, MarkupKind, Range} from "vscode-languageserver-protocol";

export interface GetSyntaxTreeParams {
    documentIdentifier: {
        uri: string;
    };
}

export interface LogSnippetCompletionRequest {
    logLevel: string;
    logCategory: string;
    logSeparator: string;
    description: string;
    properties: any;
}

export interface LogSnippet {
    snippet: string;
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
    textEdit: TextEdit,
    previousComponentStartPosition: number
}

export interface LinePosition {
    line: number;
    offset: number;
}

export interface ds {
    textDocument: {
        uri: string;
    };
    position: {
        character: number;
        line: number;
    };
}

export interface PreHoverParams {
    textDocument: {
        fsPath: string;
        uri: string;
    };
    offset: number;
}

export interface HoverResponse {
    contents: {
        kind: MarkupKind,
        value: string
    };
    range: Range
}