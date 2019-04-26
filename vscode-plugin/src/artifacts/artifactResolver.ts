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

import {QuickPickItem, window} from "vscode";
import {ArtifactModule} from "./ArtifactModule";
import {
    APIArtifactInfo,
    EndpointArtifactInfo,
    InboundEndpointArtifactInfo,
    LocalEntryArtifactInfo,
    MessageProcessorArtifactInfo,
    MessageStoreArtifactInfo,
    ProxyArtifactInfo,
    RegistryResourceInfo,
    SequenceArtifactInfo,
    TemplateArtifactInfo
} from "./artifactUtils";
import {showQuickPick, showInputBox} from "../utils/uiUtils";
import {Utils} from "../utils/Utils";

export async function createArtifact(artifactType: string) {
    switch (artifactType) {
        case APIArtifactInfo.ARTIFACT_TYPE: {
            let artifactName = await showInputBox(APIArtifactInfo.PROMPT_MESSAGE);

            while (typeof artifactName !== "undefined" && !Utils.validate(artifactName)) {
                window.showErrorMessage("Enter valid artifact name!!");
                artifactName = await showInputBox(APIArtifactInfo.PROMPT_MESSAGE);
            }

            if (artifactName) {
                ArtifactModule.createTemplate(APIArtifactInfo.DESTINATION_FOLDER, APIArtifactInfo.API_LABEL,
                                              artifactName, artifactType, APIArtifactInfo.TYPE);
            }
            break;
        }
        case ProxyArtifactInfo.ARTIFACT_TYPE: {
            const proxyTypes = createProxyServiceArray();
            const selectedArtifactType = await showQuickPick(proxyTypes);

            if (selectedArtifactType) {
                let artifactName = await showInputBox(ProxyArtifactInfo.PROMPT_MESSAGE);

                while (typeof artifactName !== "undefined" && !Utils.validate(artifactName)) {
                    window.showErrorMessage("Enter valid artifact name!!");
                    artifactName = await showInputBox(ProxyArtifactInfo.PROMPT_MESSAGE);
                }

                if (artifactName) {
                    ArtifactModule.createTemplate(ProxyArtifactInfo.PROXY_DESTINATION_FOLDER, selectedArtifactType,
                                                  artifactName, artifactType, ProxyArtifactInfo.TYPE);
                }
            }
            break;
        }
        case EndpointArtifactInfo.ARTIFACT_TYPE: {
            const endpointTypes = createEndpointServiceArray();
            const selectedArtifactType = await showQuickPick(endpointTypes);

            if (selectedArtifactType) {
                let artifactName = await showInputBox(EndpointArtifactInfo.PROMPT_MESSAGE);

                while (typeof artifactName !== "undefined" && !Utils.validate(artifactName)) {
                    window.showErrorMessage("Enter valid artifact name!!");
                    artifactName = await showInputBox(EndpointArtifactInfo.PROMPT_MESSAGE);
                }

                if (artifactName) {
                    ArtifactModule.createTemplate(EndpointArtifactInfo.DESTINATION_FOLDER, selectedArtifactType,
                                                  artifactName, artifactType, EndpointArtifactInfo.TYPE);
                }
            }
            break;
        }
        case InboundEndpointArtifactInfo.ARTIFACT_TYPE: {
            const inboundEndpointTypes = createInboundEndpointServiceArray();
            const selectedArtifactType = await showQuickPick(inboundEndpointTypes);

            if (selectedArtifactType) {
                let artifactName = await showInputBox(InboundEndpointArtifactInfo.PROMPT_MESSAGE);

                while (typeof artifactName !== "undefined" && !Utils.validate(artifactName)) {
                    window.showErrorMessage("Enter valid artifact name!!");
                    artifactName = await showInputBox(InboundEndpointArtifactInfo.PROMPT_MESSAGE);
                }

                if (artifactName) {
                    ArtifactModule.createTemplate(InboundEndpointArtifactInfo.DESTINATION_FOLDER, selectedArtifactType,
                                                  artifactName, artifactType, InboundEndpointArtifactInfo.TYPE);
                }
            }
            break;
        }
        case LocalEntryArtifactInfo.ARTIFACT_TYPE: {
            const localEntriesTypes = createLocalEntryServiceArray();
            const selectedArtifactType = await showQuickPick(localEntriesTypes);

            if (selectedArtifactType) {
                let artifactName = await showInputBox(LocalEntryArtifactInfo.PROMPT_MESSAGE);

                while (typeof artifactName !== "undefined" && !Utils.validate(artifactName)) {
                    window.showErrorMessage("Enter valid artifact name!!");
                    artifactName = await showInputBox(LocalEntryArtifactInfo.PROMPT_MESSAGE);
                }

                if (artifactName) {
                    ArtifactModule.createTemplate(LocalEntryArtifactInfo.DESTINATION_FOLDER, selectedArtifactType,
                                                  artifactName, artifactType, LocalEntryArtifactInfo.TYPE);
                }
            }
            break;
        }
        case MessageStoreArtifactInfo.ARTIFACT_TYPE: {
            const messageStoreTypes = createMessageStoreServiceArray();
            const selectedArtifactType = await showQuickPick(messageStoreTypes);

            if (selectedArtifactType) {
                let artifactName = await showInputBox(MessageStoreArtifactInfo.PROMPT_MESSAGE);

                while (typeof artifactName !== "undefined" && !Utils.validate(artifactName)) {
                    window.showErrorMessage("Enter valid artifact name!!");
                    artifactName = await showInputBox(MessageStoreArtifactInfo.PROMPT_MESSAGE);
                }

                if (artifactName) {
                    ArtifactModule.createTemplate(MessageStoreArtifactInfo.DESTINATION_FOLDER, selectedArtifactType,
                                                  artifactName, artifactType, MessageStoreArtifactInfo.TYPE);
                }
            }
            break;
        }
        case MessageProcessorArtifactInfo.ARTIFACT_TYPE: {
            const messageProcessorTypes = createMessageProcessorServiceArray();
            const selectedArtifactType = await showQuickPick(messageProcessorTypes);

            if (selectedArtifactType) {
                let artifactName = await showInputBox(MessageProcessorArtifactInfo.PROMPT_MESSAGE);

                while (typeof artifactName !== "undefined" && !Utils.validate(artifactName)) {
                    window.showErrorMessage("Enter valid artifact name!!");
                    artifactName = await showInputBox(MessageProcessorArtifactInfo.PROMPT_MESSAGE);
                }

                if (artifactName) {
                    ArtifactModule.createTemplate(MessageProcessorArtifactInfo.DESTINATION_FOLDER, selectedArtifactType,
                                                  artifactName, artifactType, MessageProcessorArtifactInfo.TYPE);
                }
            }
            break;
        }
        case TemplateArtifactInfo.ARTIFACT_TYPE: {
            const templateTypes = createTemplateServiceArray();
            const selectedArtifactType = await showQuickPick(templateTypes);

            if (selectedArtifactType) {
                let artifactName = await showInputBox(TemplateArtifactInfo.PROMPT_MESSAGE);

                while (typeof artifactName !== "undefined" && !Utils.validate(artifactName)) {
                    window.showErrorMessage("Enter valid artifact name!!");
                    artifactName = await showInputBox(TemplateArtifactInfo.PROMPT_MESSAGE);
                }

                if (artifactName) {
                    let type = TemplateArtifactInfo.getType(selectedArtifactType);
                    ArtifactModule.createTemplate(TemplateArtifactInfo.DESTINATION_FOLDER, selectedArtifactType,
                                                  artifactName, artifactType, type);
                }
            }
            break;
        }
        case SequenceArtifactInfo.ARTIFACT_TYPE: {
            let artifactName = await showInputBox(SequenceArtifactInfo.PROMPT_MESSAGE);

            while (typeof artifactName !== "undefined" && !Utils.validate(artifactName)) {
                window.showErrorMessage("Enter valid artifact name!!");
                artifactName = await showInputBox(SequenceArtifactInfo.PROMPT_MESSAGE);
            }

            if (artifactName) {
                ArtifactModule.createTemplate(SequenceArtifactInfo.DESTINATION_FOLDER,
                                              SequenceArtifactInfo.SEQUENCE_LABEL,
                                              artifactName, artifactType, SequenceArtifactInfo.TYPE);
            }
            break;
        }
        case RegistryResourceInfo.ARTIFACT_TYPE: {
            const messageProcessorTypes = createRegistryResourceTemplateArray();
            const selectedArtifactType = await showQuickPick(messageProcessorTypes);

            if (selectedArtifactType) {
                let artifactName = await showInputBox(RegistryResourceInfo.PROMPT_MESSAGE);

                while (typeof artifactName !== "undefined" && !Utils.validate(artifactName)) {
                    window.showErrorMessage("Enter valid artifact name!!");
                    artifactName = await showInputBox(RegistryResourceInfo.PROMPT_MESSAGE);
                }

                const registry = await window.showQuickPick(['conf', 'gov'],
                                                            {placeHolder: 'Select the registry type.'});

                const registryPath = await window.showInputBox({
                                                                   prompt: "Enter valid registry path here",
                                                                   placeHolder: "eg: Datamapper/example"
                                                               }).then(text => text);

                if (artifactName && registry && registryPath) {
                    ArtifactModule.createResource(RegistryResourceInfo.DESTINATION_FOLDER, selectedArtifactType,
                                                  artifactName, RegistryResourceInfo.TYPE);
                }
            }
            break;
        }
    }
}

function createProxyServiceArray(): QuickPickItem[] {
    return [
        {
            "description": ProxyArtifactInfo.PASS_THROUGH_PROXY,
            "label": ProxyArtifactInfo.PASS_THROUGH_PROXY_LABEL
        },
        {
            "description": ProxyArtifactInfo.CUSTOM_PROXY,
            "label": ProxyArtifactInfo.CUSTOM_PROXY_LABEL
        },
        {
            "description": ProxyArtifactInfo.TRANSFORMER_PROXY,
            "label": ProxyArtifactInfo.TRANSFORMER_PROXY_LABEL
        },
        {
            "description": ProxyArtifactInfo.LOGGING_PROXY,
            "label": ProxyArtifactInfo.LOGGING_PROXY_LABEL
        },
        {
            "description": ProxyArtifactInfo.WSDL_BASED_PROXY,
            "label": ProxyArtifactInfo.WSDL_BASED_PROXY_LABEL
        },
        {
            "description": ProxyArtifactInfo.SECURE_PROXY,
            "label": ProxyArtifactInfo.SECURE_PROXY_LABEL
        }
    ];

}

function createEndpointServiceArray(): QuickPickItem[] {
    return [
        {
            "description": EndpointArtifactInfo.ADDRESS_ENDPOINT,
            "label": EndpointArtifactInfo.ADDRESS_ENDPOINT_LABEL
        },
        {
            "description": EndpointArtifactInfo.HTTP_ENDPOINT,
            "label": EndpointArtifactInfo.HTTP_ENDPOINT_LABEL
        },
        {
            "description": EndpointArtifactInfo.DEFAULT_ENDPOINT,
            "label": EndpointArtifactInfo.DEFAULT_ENDPOINT_LABEL
        },
        {
            "description": EndpointArtifactInfo.WSDL_ENDPOINT,
            "label": EndpointArtifactInfo.WSDL_ENDPOINT_LABEL
        },
        {
            "description": EndpointArtifactInfo.FAIL_OVER_ENDPOINT,
            "label": EndpointArtifactInfo.FAIL_OVER_ENDPOINT_LABEL
        },
        {
            "description": EndpointArtifactInfo.LOAD_BALANCE_ENDPOINT,
            "label": EndpointArtifactInfo.LOAD_BALANCE_ENDPOINT_LABEL
        },
        {
            "description": EndpointArtifactInfo.RECIPIENT_LIST_ENDPOINT,
            "label": EndpointArtifactInfo.RECIPIENT_LIST_ENDPOINT_LABEL
        },
        {
            "description": EndpointArtifactInfo.TEMPLATE_ENDPOINT,
            "label": EndpointArtifactInfo.TEMPLATE_ENDPOINT_LABEL
        }
    ];
}

function createInboundEndpointServiceArray(): QuickPickItem[] {
    return [
        {
            "description": InboundEndpointArtifactInfo.HTTP_INBOUND_ENDPOINT,
            "label": InboundEndpointArtifactInfo.HTTP_INBOUND_ENDPOINT_LABEL
        },
        {
            "description": InboundEndpointArtifactInfo.FILE_INBOUND_ENDPOINT,
            "label": InboundEndpointArtifactInfo.FILE_INBOUND_ENDPOINT_LABEL
        },
        {
            "description": InboundEndpointArtifactInfo.JMS_INBOUND_ENDPOINT,
            "label": InboundEndpointArtifactInfo.JMS_INBOUND_ENDPOINT_LABEL
        },
        {
            "description": InboundEndpointArtifactInfo.CUSTOM_INBOUND_ENDPOINT,
            "label": InboundEndpointArtifactInfo.CUSTOM_INBOUND_ENDPOINT_LABEL
        },
        {
            "description": InboundEndpointArtifactInfo.HTTPS_INBOUND_ENDPOINT,
            "label": InboundEndpointArtifactInfo.HTTPS_INBOUND_ENDPOINT_LABEL
        },
        {
            "description": InboundEndpointArtifactInfo.HL7_INBOUND_ENDPOINT,
            "label": InboundEndpointArtifactInfo.HL7_INBOUND_ENDPOINT_LABEL
        },
        {
            "description": InboundEndpointArtifactInfo.KAFKA_INBOUND_ENDPOINT,
            "label": InboundEndpointArtifactInfo.KAFKA_INBOUND_ENDPOINT_LABEL
        },
        {
            "description": InboundEndpointArtifactInfo.CXF_WS_RM_INBOUND_ENDPOINT,
            "label": InboundEndpointArtifactInfo.CXF_WS_RM_INBOUND_ENDPOINT_LABEL
        },
        {
            "description": InboundEndpointArtifactInfo.MQTT_INBOUND_ENDPOINT,
            "label": InboundEndpointArtifactInfo.MQTT_INBOUND_ENDPOINT_LABEL
        },
        {
            "description": InboundEndpointArtifactInfo.RABBITMQ_INBOUND_ENDPOINT,
            "label": InboundEndpointArtifactInfo.RABBITMQ_INBOUND_ENDPOINT_LABEL
        },
        {
            "description": InboundEndpointArtifactInfo.FEED_INBOUND_ENDPOINT,
            "label": InboundEndpointArtifactInfo.FEED_INBOUND_ENDPOINT_LABEL
        },
        {
            "description": InboundEndpointArtifactInfo.WSO2_MB_INBOUND_ENDPOINT,
            "label": InboundEndpointArtifactInfo.WSO2_MB_INBOUND_ENDPOINT_LABEL
        },
        {
            "description": InboundEndpointArtifactInfo.WS_INBOUND_ENDPOINT,
            "label": InboundEndpointArtifactInfo.WS_INBOUND_ENDPOINT_LABEL
        },
        {
            "description": InboundEndpointArtifactInfo.WSS_INBOUND_ENDPOINT,
            "label": InboundEndpointArtifactInfo.WSS_INBOUND_ENDPOINT_LABEL
        }
    ];

}

function createLocalEntryServiceArray(): QuickPickItem[] {
    return [
        {
            "description": LocalEntryArtifactInfo.IN_LINE_TEXT_ENTRY,
            "label": LocalEntryArtifactInfo.IN_LINE_TEXT_ENTRY_LABEL
        },
        {
            "description": LocalEntryArtifactInfo.IN_LINE_XML_ENTRY,
            "label": LocalEntryArtifactInfo.IN_LINE_XML_ENTRY_LABEL
        },
        {
            "description": LocalEntryArtifactInfo.SOURCE_URL_ENTRY,
            "label": LocalEntryArtifactInfo.SOURCE_URL_ENTRY_LABEL
        }
    ];

}

function createMessageStoreServiceArray(): QuickPickItem[] {
    return [
        {
            "description": MessageStoreArtifactInfo.CUSTOM_MESSAGE_STORE,
            "label": MessageStoreArtifactInfo.CUSTOM_MESSAGE_STORE_LABEL
        },
        {
            "description": MessageStoreArtifactInfo.IN_MEMORY_MESSAGE_STORE,
            "label": MessageStoreArtifactInfo.IN_MEMORY_MESSAGE_STORE_LABEL
        },
        {
            "description": MessageStoreArtifactInfo.JDBC_MESSAGE_STORE,
            "label": MessageStoreArtifactInfo.JDBC_MESSAGE_STORE_LABEL
        },
        {
            "description": MessageStoreArtifactInfo.JMS_MESSAGE_STORE,
            "label": MessageStoreArtifactInfo.JMS_MESSAGE_STORE_LABEL
        },
        {
            "description": MessageStoreArtifactInfo.RABBIT_MQ_MESSAGE_STORE,
            "label": MessageStoreArtifactInfo.RABBIT_MQ_MESSAGE_STORE_LABEL
        },
        {
            "description": MessageStoreArtifactInfo.RESEQUENCE_MESSAGE_STORE,
            "label": MessageStoreArtifactInfo.RESEQUENCE_MESSAGE_STORE_LABEL
        },
        {
            "description": MessageStoreArtifactInfo.WSO2_MB_MESSAGE_STORE,
            "label": MessageStoreArtifactInfo.WSO2_MB_MESSAGE_STORE_LABEL
        }
    ];

}

function createMessageProcessorServiceArray(): QuickPickItem[] {
    return [
        {
            "description": MessageProcessorArtifactInfo.SCHEDULED_MSG_FORWARDING_PROCESSOR,
            "label": MessageProcessorArtifactInfo.SCHEDULED_MSG_FORWARDING_PROCESSOR_LABEL
        },
        {
            "description": MessageProcessorArtifactInfo.MESSAGE_SAMPLING_PROCESSOR,
            "label": MessageProcessorArtifactInfo.MESSAGE_SAMPLING_PROCESSOR_LABEL
        },
        {
            "description": MessageProcessorArtifactInfo.CUSTOM_MESSAGE_PROCESSOR,
            "label": MessageProcessorArtifactInfo.CUSTOM_MESSAGE_PROCESSOR_LABEL
        },
        {
            "description": MessageProcessorArtifactInfo.FAILOVER_SCHEDULED_MESSAGE_FORWARDING_PROCESSOR,
            "label": MessageProcessorArtifactInfo.FAILOVER_SCHEDULED_MESSAGE_FORWARDING_PROCESSOR_LABEL
        }
    ];
}

function createTemplateServiceArray(): QuickPickItem[] {
    return [
        {
            "description": TemplateArtifactInfo.SEQUENCE,
            "label": TemplateArtifactInfo.SEQUENCE_LABEL
        },
        {
            "description": TemplateArtifactInfo.ADDRESS_ENDPOINT,
            "label": TemplateArtifactInfo.ADDRESS_ENDPOINT_LABEL
        },
        {
            "description": TemplateArtifactInfo.DEFAULT_ENDPOINT,
            "label": TemplateArtifactInfo.DEFAULT_ENDPOINT_LABEL
        },
        {
            "description": TemplateArtifactInfo.WSDL_ENDPOINT,
            "label": TemplateArtifactInfo.WSDL_ENDPOINT_LABEL
        },
        {
            "description": TemplateArtifactInfo.HTTP_ENDPOINT,
            "label": TemplateArtifactInfo.HTTP_ENDPOINT_LABEL
        }
    ];
}

function createRegistryResourceTemplateArray(): QuickPickItem[] {
    return [
        {
            "description": RegistryResourceInfo.DATA_MAPPER,
            "label": RegistryResourceInfo.DATA_MAPPER_LABEL
        },
        {
            "description": RegistryResourceInfo.SEQUENCE,
            "label": RegistryResourceInfo.SEQUENCE_LABEL
        },
        {
            "description": RegistryResourceInfo.ADDRESS_ENDPOINT,
            "label": RegistryResourceInfo.ADDRESS_ENDPOINT_LABEL
        },
        {
            "description": RegistryResourceInfo.HTTP_ENDPOINT,
            "label": RegistryResourceInfo.HTTP_ENDPOINT_LABEL
        },
        {
            "description": RegistryResourceInfo.DEFAULT_ENDPOINT,
            "label": RegistryResourceInfo.DEFAULT_ENDPOINT_LABEL
        },
        {
            "description": RegistryResourceInfo.WSDL_ENDPOINT,
            "label": RegistryResourceInfo.WSDL_ENDPOINT_LABEL
        },
        {
            "description": RegistryResourceInfo.FAIL_OVER_ENDPOINT,
            "label": RegistryResourceInfo.FAIL_OVER_ENDPOINT_LABEL
        },
        {
            "description": RegistryResourceInfo.LOAD_BALANCE_ENDPOINT,
            "label": RegistryResourceInfo.LOAD_BALANCE_ENDPOINT_LABEL
        },
        {
            "description": RegistryResourceInfo.RECIPIENT_LIST_ENDPOINT,
            "label": RegistryResourceInfo.RECIPIENT_LIST_ENDPOINT_LABEL
        },
        {
            "description": RegistryResourceInfo.TEMPLATE_ENDPOINT,
            "label": RegistryResourceInfo.TEMPLATE_ENDPOINT_LABEL
        },
        {
            "description": RegistryResourceInfo.SMOOKS_CONFIGURATION,
            "label": RegistryResourceInfo.SMOOKS_CONFIGURATION_LABEL
        },
        {
            "description": RegistryResourceInfo.PASS_THROUGH_PROXY,
            "label": RegistryResourceInfo.PASS_THROUGH_PROXY_LABEL
        },
        {
            "description": RegistryResourceInfo.CUSTOM_PROXY,
            "label": RegistryResourceInfo.CUSTOM_PROXY_LABEL
        },
        {
            "description": RegistryResourceInfo.TRANSFORMER_PROXY,
            "label": RegistryResourceInfo.TRANSFORMER_PROXY_LABEL
        },
        {
            "description": RegistryResourceInfo.LOGGING_PROXY,
            "label": RegistryResourceInfo.LOGGING_PROXY_LABEL
        },
        {
            "description": RegistryResourceInfo.WSDL_BASED_PROXY,
            "label": RegistryResourceInfo.WSDL_BASED_PROXY_LABEL
        },
        {
            "description": RegistryResourceInfo.LOCAL_ENTRY,
            "label": RegistryResourceInfo.LOCAL_ENTRY_LABEL
        },
        {
            "description": RegistryResourceInfo.CSS_FILE,
            "label": RegistryResourceInfo.CSS_FILE_LABEL
        },
        {
            "description": RegistryResourceInfo.HTML_FILE,
            "label": RegistryResourceInfo.HTML_FILE_LABEL
        },
        {
            "description": RegistryResourceInfo.JS_FILE,
            "label": RegistryResourceInfo.JS_FILE_LABEL
        },
        {
            "description": RegistryResourceInfo.SQL_SCRIPT_FILE,
            "label": RegistryResourceInfo.SQL_SCRIPT_FILE_LABEL
        },
        {
            "description": RegistryResourceInfo.XSL_FILE,
            "label": RegistryResourceInfo.XSL_FILE_LABEL
        },
        {
            "description": RegistryResourceInfo.XSLT_FILE,
            "label": RegistryResourceInfo.XSLT_FILE_LABEL
        },
        {
            "description": RegistryResourceInfo.WSDL_FILE,
            "label": RegistryResourceInfo.WSDL_FILE_LABEL
        }
    ];
}
