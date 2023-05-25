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

import {monaco} from "react-monaco-editor";
import {DiagramEditorLangClientInterface} from "@wso2-ei/low-code-editor-commons/lib";
import {sizingAndPositioning} from "../Diagram/util";

export async function getSyntaxTree(filePath: string, langClient: DiagramEditorLangClientInterface) {
    console.log("getSyntaxTree inside generatorUtils.");
    const resp = await langClient.getSyntaxTree({
        documentIdentifier: {
            uri: monaco.Uri.file(filePath).toString()
        }
    });
    return resp.syntaxTree.node;
}

export async function getCompletion(fsPath: string, filePath: string, offset: number, langClient: DiagramEditorLangClientInterface) {
    console.log("getCompletion inside generatorUtils.");
    return langClient.getCompletion({
        textDocument: {
            fsPath: fsPath,
            uri: filePath
        },
        offset: offset,
        context: {
            triggerKind: 0
        }
    });
}

export async function getSnippetCompletion(logLevel: string, logCategory: string, logSeparator: string, description: string, properties: any, langClient: DiagramEditorLangClientInterface) {
    console.log("getSnippetCompletion inside generatorUtils.");
    return langClient.getSnippetCompletion({
        logLevel: logLevel,
        logCategory: logCategory,
        logSeparator: logSeparator,
        description: description,
        properties: properties
    });
}

export async function applyChange(filePath: string, fsPath: string, textEdit: any, previousComponentStartPosition: number,
                                  langClient: DiagramEditorLangClientInterface) {
    await langClient.applyChange(
        {
            textDocument: {
                fsPath: fsPath,
                uri: filePath
            },
            textEdit: textEdit,
            previousComponentStartPosition: previousComponentStartPosition
        }
    )
}

export async function hover(fsPath: string, filePath: string, offset: number,
                                  langClient: DiagramEditorLangClientInterface) {
    return langClient.hover(
        {
            textDocument: {
                fsPath: fsPath,
                uri: filePath
            },
            offset: offset
        }
    )
}

export async function getLowCodeST(payload: any) {

    return sizingAndPositioning(payload);
}

// export function getFnStartPosition(node: FunctionDefinition | ResourceAccessorDefinition): SelectedPosition {
//     const { startColumn, startLine } = node.functionName ? node.functionName.position : node.position;
//     return {
//         startColumn,
//         startLine
//     }
// }
// export function getDefaultSelectedPosition(modulePart: STNode): SelectedPosition {
//     return { startColumn: 0, startLine: 0 };
//
// }

// export function getSelectedPosition(modulePart: ModulePart, startLine: number, startColumn: number): SelectedPosition {
//     if (modulePart.members && modulePart.members.length > 0) {
//         let selectedNode: any;
//         for (const member of modulePart.members) {
//             if (STKindChecker.isServiceDeclaration(member)) {
//                 const isSelected = isNodeSelected({ startLine, startColumn }, member);
//                 if (isSelected) {
//                     selectedNode = member;
//                     break;
//                 }
//             }
//         }
//         if (selectedNode && STKindChecker.isServiceDeclaration(selectedNode) && selectedNode.members && selectedNode.members.length > 0) {
//             const resources = selectedNode.members;
//             if (resources && resources.length > 0) {
//                 let selectedResourceNode: any;
//                 for (const resourceMember of resources) {
//                     const isSelected = isNodeSelected({ startLine, startColumn }, resourceMember);
//                     if (isSelected) {
//                         selectedResourceNode = resourceMember;
//                         break;
//                     }
//                 }
//                 if (selectedResourceNode) {
//                     return { startLine, startColumn };
//                 }
//                 return getFnStartPosition(resources[0] as ResourceAccessorDefinition);
//             }
//         }
//     }
//     return { startLine, startColumn };
// }

// export function isNodeSelected(selectedPosition: SelectedPosition, node: any): boolean {
//     let lineOffset: number = 0;
//     if (node?.leadingMinutiae && node?.leadingMinutiae.length > 0) {
//         for (const minutiae of node.leadingMinutiae) {
//             if (minutiae.kind === "END_OF_LINE_MINUTIAE") {
//                 lineOffset += 1;
//             }
//         }
//     }
//
//     return selectedPosition?.startLine >= (node.position?.startLine - lineOffset)
//         && selectedPosition?.startLine <= node.position?.endLine;
// }

// export function sizingAndPositioningST(st: STNode, experimentalEnabled?: boolean,
//                                        showMessage?: (arg: string, messageType: MESSAGE_TYPE, ignorable: boolean, filePath?: string, fileContent?: string, bypassChecks?: boolean) => void): STNode {
//     traversNode(st, initVisitor);
//     const sizingVisitor = new SizingVisitor(experimentalEnabled);
//     traversNode(st, sizingVisitor);
//     if (sizingVisitor.getConflictResulutionFailureStatus()) {
//         showMessage("Something went wrong in the diagram rendering.", MESSAGE_TYPE.ERROR, false, undefined, undefined, true);
//     }
//     traversNode(st, new PositioningVisitor());
//
//     syntaxTree: sizingAndPositioning(action.payload),
//
//     const clone = { ...st };
//     return clone;
// }
//
//
// export function isUnresolvedModulesAvailable(diagnostics: DiagramDiagnostic[]): { isAvailable: boolean, diagnostic: DiagramDiagnostic } {
//     let unresolvedModuleAvailable: boolean = false;
//     let selectedDiagnostic: DiagramDiagnostic;
//     for (const diagnostic of diagnostics) {
//         if (diagnostic.diagnosticInfo.code === "BCE2003") {
//             unresolvedModuleAvailable = true;
//             selectedDiagnostic = diagnostic;
//             break;
//         }
//     }
//     return { isAvailable: unresolvedModuleAvailable, diagnostic: selectedDiagnostic };
// }
//
// export function isDeleteModificationAvailable(modifications: STModification[]): boolean {
//     let isAvailable = false;
//     for (const modification of modifications) {
//         if (modification.type.toLowerCase() === "delete") {
//             isAvailable = true;
//             break;
//         }
//     }
//     return isAvailable;
// }

// export function getModifyPosition(modificationList: STModification[]): SelectedPosition {
//
//     const contentModifications = modificationList.filter(modification => modification.type !== 'IMPORT');
//
//     return contentModifications && contentModifications.length > 0 && {
//         startLine: contentModifications[0].startLine + 1,
//         startColumn: contentModifications[0].startColumn
//     };
// }
