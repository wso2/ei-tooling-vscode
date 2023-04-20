
export interface GetSyntaxTreeParams {
    documentIdentifier: {
        uri: string;
    };
}

export interface GetSyntaxTreeResponse {
    syntaxTree: any;
    defFilePath: string;
}