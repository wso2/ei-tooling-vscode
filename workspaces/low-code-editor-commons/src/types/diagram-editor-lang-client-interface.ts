/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein is strictly forbidden, unless permitted by WSO2 in accordance with
 * the WSO2 Commercial License available at http://wso2.com/licenses.
 * For specific language governing the permissions and limitations under
 * this license, please see the license as well as any agreement you’ve
 * entered into with WSO2 governing the purchase of this software and any
 * associated services.
 */

import { BaseLangClientInterface } from "./base-lang-client-interface";


// export interface BallerinaAST {
//     id: string;
//     kind: string;
//     topLevelNodes: BallerinaASTNode[];
// }
//
// export interface BallerinaASTNode {
//     kind: string;
// }
//
// export interface GetSyntaxTreeParams {
//     documentIdentifier: {
//         uri: string;
//     };
// }
//
// export interface GetSyntaxTreeResponse {
//     syntaxTree: any;
//     parseSuccess: boolean;
// }
//
// export interface GetBallerinaProjectParams {
//     documentIdentifier: DocumentIdentifier;
// }
//
// export interface ExecutorPositionsResponse {
//     executorPositions?: ExecutorPosition[];
// }
//
// export interface ExecutorPosition {
//     kind: string;
//     range: LineRange;
//     name: string;
// }
//
// export interface LineRange {
//     startLine: LinePosition;
//     endLine: LinePosition;
// }
//
// interface Range {
//     start: Position;
//     end: Position;
// }
//
// interface Position {
//     line: number;
//     character: number;
// }

export interface GetSyntaxTreeParams {
    documentIdentifier: {
        uri: string;
    };
}

export interface GetSyntaxTreeResponse {
    syntaxTree: SyntaxTree;
    defFilePath: string;
}

export interface SyntaxTree {
    node: any;
    syntaxProcessingInstructionNode: any;
}

export interface DiagramEditorLangClientInterface extends BaseLangClientInterface {
    getSyntaxTree: (
        params: GetSyntaxTreeParams
    ) => Thenable<GetSyntaxTreeResponse>;
}
