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
    static readonly ARTIFACT_TYPE: string = "api";
    static readonly PLACEHOLDER: string = "Select an API Artifact Creation Option...";
    static readonly DESTINATION_FOLDER: string = "api";
    static readonly PROMPT_MESSAGE: string = "Enter API artifact name...";
}

export class ProxyArtifactInfo {
    static readonly ARTIFACT_TYPE: string = "proxy";
    static readonly PLACEHOLDER: string = "Select an Proxy Artifact Creation Option...";
    static readonly PROMPT_MESSAGE: string = "Enter Proxy artifact name...";

    static readonly PROXY_DESTINATION_FOLDER: string = "proxy-services";
    static readonly PASS_THROUGH_PROXY: string = "PassThroughProxy";
    static readonly CUSTOM_PROXY: string = "CustomProxy";
    static readonly TRANSFORMER_PROXY: string = "TransformerProxy";
    static readonly LOGGING_PROXY: string = "LoggingProxy";
    static readonly WSDL_BASED_PROXY: string = "WSDLBasedProxy";
    static readonly SECURE_PROXY: string = "SecureProxy";
    
    static readonly PASS_THROUGH_PROXY_LABEL: string = "Pass Through Proxy";
    static readonly CUSTOM_PROXY_LABEL: string = "Custom Proxy";
    static readonly TRANSFORMER_PROXY_LABEL: string = "Transformer Proxy";
    static readonly LOGGING_PROXY_LABEL: string = "Logging Proxy";
    static readonly WSDL_BASED_PROXY_LABEL: string = "WSDL Based roxy";
    static readonly SECURE_PROXY_LABEL: string = "Secure Proxy";
}

export class EndpointArtifactInfo {
    static readonly ARTIFACT_TYPE: string = "endpoint";
    static readonly PLACEHOLDER: string = "Select an Endpoint Artifact Creation Option...";
    static readonly PROMPT_MESSAGE: string = "Enter Endpoint artifact name...";
    static readonly DESTINATION_FOLDER: string = "endpoints";

    static readonly ADDRESS_ENDPOINT: string = "AddressEndpoint";
    static readonly HTTP_ENDPOINT: string = "HttpEndpoint";
    static readonly DEFAULT_ENDPOINT: string = "DefaultEndpoint";
    static readonly WSDL_ENDPOINT: string = "WsdlEndpoint";
    static readonly FAIL_OVER_ENDPOINT: string = "FailOverEndpoint";
    static readonly LOAD_BALANCE_ENDPOINT: string = "LoadBalanceEndpoint";
    static readonly RECIPIENT_LIST_ENDPOINT: string = "RecipientListEndpoint";
    static readonly TEMPLATE_ENDPOINT: string = "TemplateEndpoint";

    static readonly ADDRESS_ENDPOINT_LABEL: string = "Address Endpoint";
    static readonly HTTP_ENDPOINT_LABEL: string = "Http Endpoint";
    static readonly DEFAULT_ENDPOINT_LABEL: string = "Default Endpoint";
    static readonly WSDL_ENDPOINT_LABEL: string = "WSDL Endpoint";
    static readonly FAIL_OVER_ENDPOINT_LABEL: string = "Fail Over Endpoint";
    static readonly LOAD_BALANCE_ENDPOINT_LABEL: string = "Load Balance Endpoint";
    static readonly RECIPIENT_LIST_ENDPOINT_LABEL: string = "Recipient List Endpoint";
    static readonly TEMPLATE_ENDPOINT_LABEL: string = "Template Endpoint";
}

export class InboundEndpointArtifactInfo {
    static readonly ARTIFACT_TYPE: string = "inboundEndpoint";
    static readonly PLACEHOLDER: string = "Select an Inbound-Endpoint Artifact Creation Option...";
    static readonly PROMPT_MESSAGE: string = "Enter Inbound-Endpoint artifact name...";
    static readonly DESTINATION_FOLDER: string = "inbound-endpoints";

    static readonly HTTP_INBOUND_ENDPOINT: string = "HTTP";
    static readonly FILE_INBOUND_ENDPOINT: string = "File";
    static readonly JMS_INBOUND_ENDPOINT: string = "JMS";
    static readonly CUSTOM_INBOUND_ENDPOINT: string = "Custom";
    static readonly HTTPS_INBOUND_ENDPOINT: string = "HTTPS";
    static readonly HL7_INBOUND_ENDPOINT: string = "HL7";
    static readonly KAFKA_INBOUND_ENDPOINT: string = "Kafka";
    static readonly CXF_WS_RM_INBOUND_ENDPOINT: string = "CXF_WS_RM";
    static readonly MQTT_INBOUND_ENDPOINT: string = "MQTT";
    static readonly RABBITMQ_INBOUND_ENDPOINT: string = "RabbitMQ";
    static readonly FEED_INBOUND_ENDPOINT: string = "Feed";
    static readonly WSO2_MB_INBOUND_ENDPOINT: string = "WSO2_MB";
    static readonly WS_INBOUND_ENDPOINT: string = "WS";
    static readonly WSS_INBOUND_ENDPOINT: string = "WSS";

    static readonly HTTP_INBOUND_ENDPOINT_LABEL: string = "HTTP";
    static readonly FILE_INBOUND_ENDPOINT_LABEL: string = "File";
    static readonly JMS_INBOUND_ENDPOINT_LABEL: string = "JMS";
    static readonly CUSTOM_INBOUND_ENDPOINT_LABEL: string = "Custom";
    static readonly HTTPS_INBOUND_ENDPOINT_LABEL: string = "HTTPS";
    static readonly HL7_INBOUND_ENDPOINT_LABEL: string = "HL7";
    static readonly KAFKA_INBOUND_ENDPOINT_LABEL: string = "Kafka";
    static readonly CXF_WS_RM_INBOUND_ENDPOINT_LABEL: string = "CXF_WS_RM";
    static readonly MQTT_INBOUND_ENDPOINT_LABEL: string = "MQTT";
    static readonly RABBITMQ_INBOUND_ENDPOINT_LABEL: string = "RabbitMQ";
    static readonly FEED_INBOUND_ENDPOINT_LABEL: string = "Feed";
    static readonly WSO2_MB_INBOUND_ENDPOINT_LABEL: string = "WSO2_MB";
    static readonly WS_INBOUND_ENDPOINT_LABEL: string = "WS";
    static readonly WSS_INBOUND_ENDPOINT_LABEL: string = "WSS";
}

export class LocalEntryArtifactInfo {
    static readonly ARTIFACT_TYPE: string = "localEntry";
    static readonly PLACEHOLDER: string = "Select an Local-Entry Artifact Creation Option...";
    static readonly PROMPT_MESSAGE: string = "Enter Local-Entry artifact name...";
    static readonly DESTINATION_FOLDER: string = "local-entries";

    static readonly IN_LINE_TEXT_ENTRY: string = "InLineTextEntry";
    static readonly IN_LINE_XML_ENTRY: string = "InLineXMLEntry";
    static readonly SOURCE_URL_ENTRY: string = "SourceURLEntry";

    static readonly IN_LINE_TEXT_ENTRY_LABEL: string = "In Line Text Entry";
    static readonly IN_LINE_XML_ENTRY_LABEL: string = "In Line XML Entry";
    static readonly SOURCE_URL_ENTRY_LABEL: string = "Source URL Entry";
}
  