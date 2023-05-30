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

import React from "react";
import {LowCodeDiagramGenerator} from "..";
import { DiagramGenErrorBoundary } from "../ErrorBoundary";
import {NodePosition} from "@wso2-ei/syntax-tree/lib";
import {DiagramEditorLangClientInterface} from "@wso2-ei/low-code-editor-commons/lib";

export interface DiagramFocus {
    filePath: string;
    position?: NodePosition;
}

export interface Uri {
    fsPath: string
    external: string
    path: string;
    scheme: string;
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
}

export type EditorProps = EditorState & EditorAPI;

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