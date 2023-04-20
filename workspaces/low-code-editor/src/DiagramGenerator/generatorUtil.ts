import { monaco } from "react-monaco-editor";
import { sizingAndPositioning } from "@wso2-ei/low-code-diagram";
import { DiagramEditorLangClientInterface } from "@wso2-ei/low-code-editor-commons/lib";

export async function getSyntaxTree(filePath: string, langClient: DiagramEditorLangClientInterface) {
    console.log("getSyntaxTree inside generatorUtils.");
    const resp = await langClient.getSyntaxTree({
        documentIdentifier: {
            uri: monaco.Uri.file(filePath).toString()
        }
    });
    return resp.syntaxTree;
}

// export async function getFunctionSyntaxTree(filePath: string, range: any, langClient: DiagramEditorLangClientInterface) {
//     const resp = await langClient.getSTForFunction({
//         documentIdentifier: {
//             uri: filePath
//         },
//         lineRange: range
//     });
//     return { syntaxTree: resp.syntaxTree, defFilePath: resp.defFilePath };
// }
//
//
// export async function resolveMissingDependencies(filePath: string, langClient: DiagramEditorLangClientInterface) {
//     const resp = await langClient.resolveMissingDependencies({
//         documentIdentifier: {
//             uri: monaco.Uri.file(filePath).toString()
//         }
//     });
//     return resp;
// }

export async function getLowcodeST(payload: any) {

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
