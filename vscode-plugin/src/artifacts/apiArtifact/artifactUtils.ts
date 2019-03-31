'use strict';

export class APIArtifactInfo {
    static readonly CREATE_API: string = "Create a New API Artifact";
    static readonly IMPORT_API: string = "Import API Artifact";
    static readonly PLACEHOLDER_API: string = "Select an API Artifact Creation Option...";
    static readonly API_DESTINATION_FOLDER: string = "api";
    
    private constructor() {}
}

export class ProxyArtifactInfo {
    static readonly CREATE_PROXY: string = "Create a New Proxy Artifact";
    static readonly IMPORT_PROXY: string = "Import Proxy Artifact";
    static readonly PLACEHOLDER_PROXY: string = "Select an Proxy Artifact Creation Option...";

    static readonly PROXY_DESTINATION_FOLDER: string = "proxy-services";
    static readonly PASS_THROUGH_PROXY: string = "PassThroughProxy";
    static readonly CUSTOM_PROXY: string = "CustomProxy";
    static readonly TRANSFOREMER_PROXY: string = "TransformerProxy";
    static readonly LOGGING_PROXY: string = "LoggingProxy";
    static readonly WSDL_BASED_PROXY: string = "WSDLBasedProxy";
    static readonly SECURE_PROXY: string = "SecureProxy";
    
    static readonly PASS_THROUGH_PROXY_LABEL: string = "Pass Through Proxy";
    static readonly CUSTOM_PROXY_LABEL: string = "Custom Proxy";
    static readonly TRANSFOREMER_PROXY_LABEL: string = "Transformer Proxy";
    static readonly LOGGING_PROXY_LABEL: string = "Logging Proxy";
    static readonly WSDL_BASED_PROXY_LABEL: string = "WSDL Based roxy";
    static readonly SECURE_PROXY_LABEL: string = "Secure Proxy";

    private constructor() {}
}
  