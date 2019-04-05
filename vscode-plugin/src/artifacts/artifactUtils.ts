/*
Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the "License"); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

'use strict';

export class APIArtifactInfo {
    static readonly CREATE_API: string = "Create a New API Artifact";
    static readonly IMPORT_API: string = "Import API Artifact";
    static readonly PLACEHOLDER_API: string = "Select an API Artifact Creation Option...";
    static readonly API_DESTINATION_FOLDER: string = "api";

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

}
  