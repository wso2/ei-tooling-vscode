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

export class ServerRoleInfo {
    static readonly ENTERPRISE_SERVICE_BUS: string = "EnterpriseServiceBus";
    static readonly ENTERPRISE_INTEGRATOR: string = "EnterpriseIntegrator";
}

export class SubDirectories {
    static readonly COMPOSITE_EXPORTER: string = "CompositeExporter";
    static readonly CONFIGS: string = "Configs";
    static readonly CONNECTOR_EXPORTER: string = "ConnectorExporter";
    static readonly REGISTRY_RESOURCES: string = "RegistryResources";
    static readonly DATA_SERVICE: string = "DataServiceConfigs";
}

export class ProjectNatures {
    static readonly MULTI_MODULE: string = "org.wso2.developerstudio.eclipse.mavenmultimodule.project.nature";
    static readonly COMPOSITE_EXPORTER: string = "org.wso2.developerstudio.eclipse.distribution.project.nature";
    static readonly CONFIGS: string = "org.wso2.developerstudio.eclipse.esb.project.nature";
    static readonly CONNECTOR_EXPORTER: string = "org.wso2.developerstudio.eclipse.artifact.connector.project.nature";
    static readonly REGISTRY_RESOURCES: string = "org.wso2.developerstudio.eclipse.general.project.nature";
    static readonly DATA_SERVICE: string = "org.wso2.developerstudio.eclipse.ds.project.nature";
}

export class APIArtifactInfo {
    static readonly ARTIFACT_TYPE: string = "api";
    static readonly PLACEHOLDER: string = "Select an API Artifact Creation Option...";
    static readonly DESTINATION_FOLDER: string = "api";
    static readonly PROMPT_MESSAGE: string = "Enter API artifact name...";
    static readonly TYPE: string = "synapse/api";

    static readonly API_LABEL: string = "api";
}

export class ProxyArtifactInfo {
    static readonly ARTIFACT_TYPE: string = "proxy";
    static readonly PLACEHOLDER: string = "Select an Proxy Artifact Creation Option...";
    static readonly PROMPT_MESSAGE: string = "Enter Proxy artifact name...";
    static readonly TYPE: string = "synapse/proxy-service";
    static readonly PROXY_DESTINATION_FOLDER: string = "proxy-services";

    static readonly PROXY_LABEL: string = "Proxy";
}

export class EndpointArtifactInfo {
    static readonly ARTIFACT_TYPE: string = "endpoint";
    static readonly PLACEHOLDER: string = "Select an Endpoint Artifact Creation Option...";
    static readonly PROMPT_MESSAGE: string = "Enter Endpoint artifact name...";
    static readonly DESTINATION_FOLDER: string = "endpoints";
    static readonly TYPE: string = "synapse/endpoint";

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
    static readonly ARTIFACT_TYPE: string = "inbound-endpoint";
    static readonly PLACEHOLDER: string = "Select an Inbound-Endpoint Artifact Creation Option...";
    static readonly PROMPT_MESSAGE: string = "Enter Inbound-Endpoint artifact name...";
    static readonly DESTINATION_FOLDER: string = "inbound-endpoints";
    static readonly TYPE: string = "synapse/inbound-endpoint";

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
    static readonly ARTIFACT_TYPE: string = "local-entry";
    static readonly PLACEHOLDER: string = "Select an Local-Entry Artifact Creation Option...";
    static readonly PROMPT_MESSAGE: string = "Enter Local-Entry artifact name...";
    static readonly DESTINATION_FOLDER: string = "local-entries";
    static readonly TYPE: string = "synapse/local-entry";

    static readonly IN_LINE_TEXT_ENTRY: string = "InLineTextEntry";
    static readonly IN_LINE_XML_ENTRY: string = "InLineXMLEntry";
    static readonly SOURCE_URL_ENTRY: string = "SourceURLEntry";

    static readonly IN_LINE_TEXT_ENTRY_LABEL: string = "In Line Text Entry";
    static readonly IN_LINE_XML_ENTRY_LABEL: string = "In Line XML Entry";
    static readonly SOURCE_URL_ENTRY_LABEL: string = "Source URL Entry";
}

export class MessageStoreArtifactInfo {
    static readonly ARTIFACT_TYPE: string = "message-store";
    static readonly PLACEHOLDER: string = "Select an Message-Store Artifact Creation Option...";
    static readonly PROMPT_MESSAGE: string = "Enter Message-Store artifact name...";
    static readonly DESTINATION_FOLDER: string = "message-stores";
    static readonly TYPE: string = "synapse/message-store";

    static readonly CUSTOM_MESSAGE_STORE: string = "CustomMessageStore";
    static readonly IN_MEMORY_MESSAGE_STORE: string = "InMemoryMessageStore";
    static readonly JDBC_MESSAGE_STORE: string = "JDBCMessageStore";
    static readonly JMS_MESSAGE_STORE: string = "JMSMessageStore";
    static readonly RABBIT_MQ_MESSAGE_STORE: string = "RabbitMQMessageStore";
    static readonly RESEQUENCE_MESSAGE_STORE: string = "ResequenceMessageStore";
    static readonly WSO2_MB_MESSAGE_STORE: string = "WSO2MBMessageStore";

    static readonly CUSTOM_MESSAGE_STORE_LABEL: string = "Custom Message Store";
    static readonly IN_MEMORY_MESSAGE_STORE_LABEL: string = "In Memory Message Store";
    static readonly JDBC_MESSAGE_STORE_LABEL: string = "JDBC Message Store";
    static readonly JMS_MESSAGE_STORE_LABEL: string = "JMS Message Store";
    static readonly RABBIT_MQ_MESSAGE_STORE_LABEL: string = "RabbitMQ Message Store";
    static readonly RESEQUENCE_MESSAGE_STORE_LABEL: string = "Resequence Message Store";
    static readonly WSO2_MB_MESSAGE_STORE_LABEL: string = "WSO2 MB Message Store";
}

export class MessageProcessorArtifactInfo {
    static readonly ARTIFACT_TYPE: string = "message-processors";
    static readonly PLACEHOLDER: string = "Select an Message-Processor Artifact Creation Option...";
    static readonly PROMPT_MESSAGE: string = "Enter Message-Processor artifact name...";
    static readonly DESTINATION_FOLDER: string = "message-processors";
    static readonly TYPE: string = "synapse/message-processors";

    static readonly SCHEDULED_MSG_FORWARDING_PROCESSOR: string = "ScheduledMessageForwardingProcessor";
    static readonly MESSAGE_SAMPLING_PROCESSOR: string = "MessageSamplingProcessor";
    static readonly CUSTOM_MESSAGE_PROCESSOR: string = "CustomMessageProcessor";
    static readonly FAILOVER_SCHEDULED_MESSAGE_FORWARDING_PROCESSOR: string = "FailoverScheduledMessageForwardingProcessor";

    static readonly SCHEDULED_MSG_FORWARDING_PROCESSOR_LABEL: string = "Scheduled Message Forwarding Processor";
    static readonly MESSAGE_SAMPLING_PROCESSOR_LABEL: string = "Message Sampling Processor";
    static readonly CUSTOM_MESSAGE_PROCESSOR_LABEL: string = "Custom Message Processor";
    static readonly FAILOVER_SCHEDULED_MESSAGE_FORWARDING_PROCESSOR_LABEL: string = "Failover Scheduled Message Forwarding Processor";
}

export class TemplateArtifactInfo {
    static readonly ARTIFACT_TYPE: string = "template";
    static readonly PLACEHOLDER: string = "Select an Template Artifact Creation Option...";
    static readonly PROMPT_MESSAGE: string = "Enter Template artifact name...";
    static readonly DESTINATION_FOLDER: string = "templates";
    static readonly TYPE: string = "synapse/template";

    static readonly SEQUENCE: string = "SequenceTemplate";
    static readonly ADDRESS_ENDPOINT: string = "AddressEndpointTemplate";
    static readonly DEFAULT_ENDPOINT: string = "DefaultEndpointTemplate";
    static readonly WSDL_ENDPOINT: string = "WSDLEndpointTemplate";
    static readonly HTTP_ENDPOINT: string = "HTTPEndpointTemplate";

    static readonly SEQUENCE_LABEL: string = "Sequence Template";
    static readonly ADDRESS_ENDPOINT_LABEL: string = "Address Endpoint Template";
    static readonly DEFAULT_ENDPOINT_LABEL: string = "Default Endpoint Template";
    static readonly WSDL_ENDPOINT_LABEL: string = "WSDL Endpoint Template";
    static readonly HTTP_ENDPOINT_LABEL: string = "HTTP Endpoint Template";
}

export class SequenceArtifactInfo {
    static readonly ARTIFACT_TYPE: string = "sequence";
    static readonly PLACEHOLDER: string = "Select a Sequence Artifact Creation Option...";
    static readonly PROMPT_MESSAGE: string = "Enter Sequence artifact name...";
    static readonly DESTINATION_FOLDER: string = "sequences";
    static readonly TYPE: string = "synapse/sequence";

    static readonly SEQUENCE_LABEL: string = "Sequence";
}

export class TaskArtifactInfo {
    static readonly ARTIFACT_TYPE: string = "task";
    static readonly PROMPT_MESSAGE: string = "Enter Task artifact name...";
    static readonly DESTINATION_FOLDER: string = "tasks";
    static readonly TYPE: string = "synapse/task";

    static readonly TASK_LABEL: string = "task";
}

export class RegistryResourceInfo {
    static readonly ARTIFACT_TYPE: string = "registry-resource";
    static readonly PLACEHOLDER: string = "Select an Message-Processor Artifact Creation Option...";
    static readonly PROMPT_MESSAGE: string = "Enter resource name...";
    static readonly DESTINATION_FOLDER: string = "registry-resources";
    static readonly TYPE: string = "registry/resource";

    static readonly SEQUENCE: string = "Sequence";
    static readonly ADDRESS_ENDPOINT: string = "AddressEndpoint";
    static readonly HTTP_ENDPOINT: string = "HttpEndpoint";
    static readonly DEFAULT_ENDPOINT: string = "DefaultEndpoint";
    static readonly WSDL_ENDPOINT: string = "WsdlEndpoint";
    static readonly FAIL_OVER_ENDPOINT: string = "FailOverEndpoint";
    static readonly LOAD_BALANCE_ENDPOINT: string = "LoadBalanceEndpoint";
    static readonly RECIPIENT_LIST_ENDPOINT: string = "RecipientListEndpoint";
    static readonly TEMPLATE_ENDPOINT: string = "TemplateEndpoint";
    static readonly SMOOKS_CONFIGURATION: string = "SmooksConfiguration";
    static readonly PASS_THROUGH_PROXY: string = "PassThroughProxy";
    static readonly CUSTOM_PROXY: string = "CustomProxy";
    static readonly TRANSFORMER_PROXY: string = "TransformerProxy";
    static readonly LOGGING_PROXY: string = "LoggingProxy";
    static readonly WSDL_BASED_PROXY: string = "WSDLBasedProxy";
    static readonly SECURE_PROXY: string = "SecureProxy";
    static readonly LOCAL_ENTRY: string = "LocalEntry";
    static readonly SEQUENCE_TEMPLATE: string = "SequenceTemplate";
    static readonly ADDRESS_ENDPOINT_TEMPLATE: string = "AddressEndpointTemplate";
    static readonly DEFAULT_ENDPOINT_TEMPLATE: string = "DefaultEndpointTemplate";
    static readonly WSDL_ENDPOINT_TEMPLATE: string = "WSDLEndpointTemplate";
    static readonly HTTP_ENDPOINT_TEMPLATE: string = "HTTPEndpointTemplate";
    static readonly JSON_SCHEMA_TEMPLATE: string = "JSONSchemaTemplate";
    static readonly WS_POLICY: string = "WSPolicyTemplate";

    static readonly SEQUENCE_LABEL: string = "Sequence";
    static readonly ADDRESS_ENDPOINT_LABEL: string = "Address Endpoint";
    static readonly HTTP_ENDPOINT_LABEL: string = "Http Endpoint";
    static readonly DEFAULT_ENDPOINT_LABEL: string = "Default Endpoint";
    static readonly WSDL_ENDPOINT_LABEL: string = "Wsdl Endpoint";
    static readonly FAIL_OVER_ENDPOINT_LABEL: string = "Fail Over Endpoint";
    static readonly LOAD_BALANCE_ENDPOINT_LABEL: string = "Load Balance Endpoint";
    static readonly RECIPIENT_LIST_ENDPOINT_LABEL: string = "Recipient List Endpoint";
    static readonly TEMPLATE_ENDPOINT_LABEL: string = "Template Endpoint";
    static readonly SMOOKS_CONFIGURATION_LABEL: string = "Smooks Configuration";
    static readonly PASS_THROUGH_PROXY_LABEL: string = "Pass Through Proxy";
    static readonly CUSTOM_PROXY_LABEL: string = "Custom Proxy";
    static readonly TRANSFORMER_PROXY_LABEL: string = "Transformer Proxy";
    static readonly LOGGING_PROXY_LABEL: string = "Logging Proxy";
    static readonly WSDL_BASED_PROXY_LABEL: string = "WSDL Based Proxy";
    static readonly SECURE_PROXY_LABEL: string = "Secure Proxy";
    static readonly LOCAL_ENTRY_LABEL: string = "Local Entry";
    static readonly SEQUENCE_TEMPLATE_LABEL: string = "Sequence Template";
    static readonly ADDRESS_ENDPOINT_TEMPLATE_LABEL: string = "Address Endpoint Template";
    static readonly DEFAULT_ENDPOINT_TEMPLATE_LABEL: string = "Default Endpoint Template";
    static readonly WSDL_ENDPOINT_TEMPLATE_LABEL: string = "WSDL Endpoint Template";
    static readonly HTTP_ENDPOINT_TEMPLATE_LABEL: string = "HTTP Endpoint Template";
    static readonly JSON_SCHEMA_TEMPLATE_LABEL: string = "JSON Schema Template";
    static readonly WS_POLICY_LABEL: string = "WS Policy";

    static mediaTypes: Map<string, string> = new Map();
    

    static initialize() {
        this.mediaTypes.set("Sequence", "application/vnd.wso2.sequence");
        this.mediaTypes.set("AddressEndpoint", "application/vnd.wso2.esb.endpoint");
        this.mediaTypes.set("HttpEndpoint", "application/vnd.wso2.esb.endpoint");
        this.mediaTypes.set("DefaultEndpoint", "application/vnd.wso2.esb.endpoint");
        this.mediaTypes.set("WsdlEndpoint", "application/vnd.wso2.esb.endpoint");
        this.mediaTypes.set("FailOverEndpoint", "application/vnd.wso2.esb.endpoint");
        this.mediaTypes.set("LoadBalanceEndpoint", "application/vnd.wso2.esb.endpoint");
        this.mediaTypes.set("RecipientListEndpoint", "application/vnd.wso2.esb.endpoint");
        this.mediaTypes.set("TemplateEndpoint", "application/vnd.wso2.esb.endpoint");
        this.mediaTypes.set("SmooksConfiguration", "application/vnd+wso2.smooks");
        this.mediaTypes.set("PassThroughProxy", "application/xml");
        this.mediaTypes.set("CustomProxy", "application/xml");
        this.mediaTypes.set("TransformerProxy", "application/xml");
        this.mediaTypes.set("LoggingProxy", "application/xml");
        this.mediaTypes.set("WSDLBasedProxy", "application/xml");
        this.mediaTypes.set("SecureProxy", "application/xml");
        this.mediaTypes.set("LocalEntry", "application/vnd.wso2.esb.localentry");
        this.mediaTypes.set("SequenceTemplate", "application/vnd.wso2.template.endpoint");
        this.mediaTypes.set("AddressEndpointTemplate", "application/vnd.wso2.template.endpoint");
        this.mediaTypes.set("DefaultEndpointTemplate", "application/vnd.wso2.template.endpoint");
        this.mediaTypes.set("WSDLEndpointTemplate", "application/vnd.wso2.template.endpoint");
        this.mediaTypes.set("HTTPEndpointTemplate", "application/vnd.wso2.template.endpoint");
        this.mediaTypes.set("JSONSchemaTemplate", "application/json");
        this.mediaTypes.set("WSPolicyTemplate", "application/wspolicy+xml");

       
    }
}

export class ArtifactInfo{
    static artifactTypes: Map<string, string> = new Map();
    static setTypes(){
        this.artifactTypes.set(APIArtifactInfo.DESTINATION_FOLDER, APIArtifactInfo.TYPE);
        this.artifactTypes.set(EndpointArtifactInfo.DESTINATION_FOLDER, EndpointArtifactInfo.TYPE);
        this.artifactTypes.set(ProxyArtifactInfo.PROXY_DESTINATION_FOLDER, ProxyArtifactInfo.TYPE);
        this.artifactTypes.set(InboundEndpointArtifactInfo.DESTINATION_FOLDER, InboundEndpointArtifactInfo.TYPE);
        this.artifactTypes.set(LocalEntryArtifactInfo.DESTINATION_FOLDER, LocalEntryArtifactInfo.TYPE);
        this.artifactTypes.set(MessageStoreArtifactInfo.DESTINATION_FOLDER, MessageStoreArtifactInfo.TYPE);
        this.artifactTypes.set(MessageProcessorArtifactInfo.DESTINATION_FOLDER, MessageProcessorArtifactInfo.TYPE);
        this.artifactTypes.set(TemplateArtifactInfo.DESTINATION_FOLDER, TemplateArtifactInfo.TYPE);
        this.artifactTypes.set(SequenceArtifactInfo.DESTINATION_FOLDER, SequenceArtifactInfo.TYPE);
        this.artifactTypes.set(TaskArtifactInfo.DESTINATION_FOLDER, TaskArtifactInfo.TYPE);
        this.artifactTypes.set(RegistryResourceInfo.DESTINATION_FOLDER, RegistryResourceInfo.TYPE);
    
}
}

ArtifactInfo.setTypes();
RegistryResourceInfo.initialize();
