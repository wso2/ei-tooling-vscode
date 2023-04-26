import {HoverParams, LanguageClient} from "vscode-languageclient";
import {
    CompletionParams,
    CompletionResponse,
    GetSyntaxTreeParams,
    GetSyntaxTreeResponse, HoverResponse, PreCompletionParams
} from "./ISynapseLanguageClient";
import * as vscode from "vscode";
import {Position, Range, TextDocument, Uri, workspace, WorkspaceEdit} from "vscode";

export interface DidOpenParams {
    textDocument: {
        uri: string;
        languageId: string;
        text: string;
        version: number;
    };
}

export class ExtendedLangClient extends LanguageClient {

    // private ballerinaExtendedServices: Set<String> | undefined;
    // private initBalRequestSent = false;
    // private isDynamicRegistrationSupported: boolean;


    async getSyntaxTree(req: GetSyntaxTreeParams): Promise<GetSyntaxTreeResponse | NOT_SUPPORTED_TYPE> {
        // const isSupported = await this.isExtendedServiceSupported("xml/getSynapseSyntaxTree");
        return this.sendRequest("xml/getSynapseSyntaxTree", req.documentIdentifier);
    }

    didOpen(params: DidOpenParams): void {
        // debug(`didOpen at ${new Date()} - ${new Date().getTime()}`);
        this.sendNotification("textDocument/didOpen", params);
    }

    async getCompletion(params: PreCompletionParams): Promise<CompletionResponse[]> {
        let position: Position;
        const doc = await vscode.workspace.openTextDocument(Uri.file(params.textDocument.fsPath));
        position = doc.positionAt(235);
        const completionParams: CompletionParams = {
                textDocument: {
                    uri: params.textDocument.uri
                },
                position: {
                    character: position.character,
                    line: position.line
                },
                context: {
                    triggerKind: params.context.triggerKind
                }
            }

        return this.sendRequest("textDocument/completion", completionParams);

    }

    async hover(params: HoverParams): Promise<HoverResponse> {
        return this.sendRequest("textDocument/hover", params);
    }

    // async applyChange(params: ApplyEditParams): Promise<void> {
    //     const url: string = params.textDocument.uri;
    //     const uri: Uri = Uri.parse(url);
    //     const document: TextDocument = await workspace.openTextDocument(uri);
    //     if (document === null) {
    //         return;
    //     }
    //
    //     const edit = new WorkspaceEdit();
    //     let startPosition = new Position(params.textEdit.range.start.line, params.textEdit.range.start.character);
    //     let endPosition = new Position(params.textEdit.range.end.line, params.textEdit.range.end.character);
    //     let replaceLocation: Position | Range = new Range(startPosition, endPosition);
    //     edit.replace(Uri.file(url), replaceLocation, params.textEdit.newText);
    // }

    // async isExtendedServiceSupported(serviceName: string): Promise<boolean> {
    //     if (!this.isDynamicRegistrationSupported) {
    //         return Promise.resolve(true);
    //     }
    //
    //     return Promise.resolve((await this.registerExtendedAPICapabilities()).has(serviceName));
    // }

    // async registerExtendedAPICapabilities(): Promise<Set<String>> {
    //
    //     if (this.ballerinaExtendedServices || this.initBalRequestSent) {
    //         return Promise.resolve(this.ballerinaExtendedServices || new Set());
    //     }
    //
    //     this.initBalRequestSent = true;
    //
    //     await this.initBalServices({
    //         ballerinaClientCapabilities: [
    //             {
    //                 name: EXTENDED_APIS_ORG.DOCUMENT, syntaxTreeNode: true, executorPositions: true,
    //                 syntaxTreeModify: true, diagnostics: true, syntaxTree: true, astModify: true, triggerModify: true,
    //                 resolveMissingDependencies: true
    //             },
    //             { name: EXTENDED_APIS_ORG.PACKAGE, components: true, metadata: true, configSchema: true },
    //             {
    //                 name: EXTENDED_APIS_ORG.SYMBOL, type: true, getSymbol: true,
    //                 getTypeFromExpression: true, getTypeFromSymbol: true, getTypesFromFnDefinition: true
    //             },
    //             {
    //                 name: EXTENDED_APIS_ORG.CONNECTOR, connectors: true, connector: true, record: true
    //             },
    //             {
    //                 name: EXTENDED_APIS_ORG.TRIGGER, triggers: true, trigger: true
    //             },
    //             { name: EXTENDED_APIS_ORG.EXAMPLE, list: true },
    //             { name: EXTENDED_APIS_ORG.JSON_TO_RECORD, convert: true },
    //             { name: EXTENDED_APIS_ORG.PERF_ANALYZER, getResourcesWithEndpoints: true },
    //             { name: EXTENDED_APIS_ORG.PARTIAL_PARSER, getSTForSingleStatement: true, getSTForExpression: true, getSTForResource: true },
    //             { name: EXTENDED_APIS_ORG.BALLERINA_TO_OPENAPI, generateOpenAPI: true },
    //             { name: EXTENDED_APIS_ORG.GRAPHQL_DESIGN, getGraphqlModel: true },
    //             {
    //                 name: EXTENDED_APIS_ORG.NOTEBOOK_SUPPORT, getResult: true, getShellFileSource: true,
    //                 getVariableValues: true, deleteDeclarations: true, restartNotebook: true
    //             }
    //         ]
    //     }).then(response => {
    //         const capabilities: Set<String> = new Set();
    //         response.ballerinaServerCapabilities.forEach((capability: BallerinaServerCapability) => {
    //             const keys: string[] = Object.keys(capability);
    //             const org: string = capability['name'];
    //             keys.forEach(key => {
    //                 if (key != 'name') {
    //                     capabilities.add(`${org}/${key}`);
    //                 }
    //             });
    //         });
    //         this.ballerinaExtendedServices = capabilities;
    //         return Promise.resolve(this.ballerinaExtendedServices);
    //     }).catch(_error => {
    //         this.isDynamicRegistrationSupported = false;
    //     });
    //
    //     return Promise.resolve(new Set());
    // }
    //
    // initBalServices(params: BallerinaInitializeParams): Promise<BallerinaInitializeResult> {
    //     return this.sendRequest("initBalServices", params);
    // }

}

interface NOT_SUPPORTED_TYPE {

}