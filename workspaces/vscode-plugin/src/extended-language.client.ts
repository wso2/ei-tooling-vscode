import {LanguageClient} from "vscode-languageclient";
import {GetSyntaxTreeParams, GetSyntaxTreeResponse} from "./ISynapseLanguageClient";

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