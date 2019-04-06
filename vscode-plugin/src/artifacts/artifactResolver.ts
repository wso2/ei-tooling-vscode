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

import { window } from "vscode";
import { ArtifactModule } from "./ArtifactModule";
import {APIArtifactInfo, ProxyArtifactInfo, EndpointArtifactInfo, InboundEndpointArtifactInfo} from "./artifactUtils";

export async function createArtifact(artifactType: string) {
    switch(artifactType) {
        case APIArtifactInfo.ARTIFACT_TYPE: {
            const destinationFileName = await window.showInputBox({ value: "", prompt: APIArtifactInfo.PROMPT_MESSAGE, placeHolder: ""}).then(text => text);
            if(destinationFileName) {
                ArtifactModule.createTemplate(APIArtifactInfo.API_DESTINATION_FOLDER, "api", destinationFileName);
            }
            break;
        } 
        case ProxyArtifactInfo.ARTIFACT_TYPE: {
            const proxyTypes = createProxyServiceArray();
            const selectedArifactType = await showQuickPick(proxyTypes);
            
            if(selectedArifactType) {
                const artifactName = await window.showInputBox({ value: "", prompt: ProxyArtifactInfo.PROMPT_MESSAGE, placeHolder: ""}).then(text => text);
                if(artifactName) {
                    ArtifactModule.createTemplate(ProxyArtifactInfo.PROXY_DESTINATION_FOLDER, selectedArifactType, artifactName);
                }
            }
            break;
        }
        case EndpointArtifactInfo.ARTIFACT_TYPE: {
            const endpointTypes = createEndpointServiceArray();
            const selectedArtifactType = await showQuickPick(endpointTypes);

            if(selectedArtifactType) {
                const artifactName = await window.showInputBox({ value: "", prompt: EndpointArtifactInfo.PROMPT_MESSAGE, placeHolder: ""}).then(text => text);
                if(artifactName) {
                    ArtifactModule.createTemplate(EndpointArtifactInfo.ENDPOINT_DESTINATION_FOLDER, selectedArtifactType, artifactName);
                }
            }
            break;
        }
        case InboundEndpointArtifactInfo.ARTIFACT_TYPE: {
            const inboundEndpointTypes = createInboundEndpointServiceArray();
            const selectedArtifactType = await showQuickPick(inboundEndpointTypes);

            if(selectedArtifactType) {
                const artifactName = await window.showInputBox({ value: "", prompt: InboundEndpointArtifactInfo.PROMPT_MESSAGE, placeHolder: ""}).then(text => text);
                if(artifactName) {
                    ArtifactModule.createTemplate(InboundEndpointArtifactInfo.ENDPOINT_DESTINATION_FOLDER, selectedArtifactType, artifactName);
                }
            }
            break;
        }
    }
}

async function showQuickPick(promise: Promise<{"value": string; "label": string;}[]>): Promise<string | undefined> {
    return await window.showQuickPick(
        promise.then(items => items.map(item => ({
            value: item.value,
            label: item.label,
            description: "",
            detail: ""
        }))),
        { matchOnDescription: true, placeHolder: "Select type..." }
    ).then(selected => (
        selected && selected.value
    ));
}

function createProxyServiceArray(): Promise<{"value": string; "label": string;}[]> {
    return new Promise((resolve) => {
        const serviceArray = [
            {"value": ProxyArtifactInfo.PASS_THROUGH_PROXY, "label": ProxyArtifactInfo.PASS_THROUGH_PROXY_LABEL},
            {"value": ProxyArtifactInfo.CUSTOM_PROXY, "label": ProxyArtifactInfo.CUSTOM_PROXY_LABEL},
            {"value": ProxyArtifactInfo.TRANSFORMER_PROXY, "label": ProxyArtifactInfo.TRANSFORMER_PROXY_LABEL},
            {"value": ProxyArtifactInfo.LOGGING_PROXY, "label": ProxyArtifactInfo.LOGGING_PROXY_LABEL},
            {"value": ProxyArtifactInfo.WSDL_BASED_PROXY, "label": ProxyArtifactInfo.WSDL_BASED_PROXY_LABEL},
            {"value": ProxyArtifactInfo.SECURE_PROXY, "label": ProxyArtifactInfo.SECURE_PROXY_LABEL}
        ];
        resolve(serviceArray);
    });
}

function createEndpointServiceArray(): Promise<{"value": string; "label": string;}[]> {
    return new Promise((resolve) => {
        const serviceArray = [
            {"value": EndpointArtifactInfo.ADDRESS_ENDPOINT, "label": EndpointArtifactInfo.ADDRESS_ENDPOINT_LABEL},
            {"value": EndpointArtifactInfo.HTTP_ENDPOINT, "label": EndpointArtifactInfo.HTTP_ENDPOINT_LABEL},
            {"value": EndpointArtifactInfo.DEFAULT_ENDPOINT, "label": EndpointArtifactInfo.DEFAULT_ENDPOINT_LABEL},
            {"value": EndpointArtifactInfo.WSDL_ENDPOINT, "label": EndpointArtifactInfo.WSDL_ENDPOINT_LABEL},
            {"value": EndpointArtifactInfo.FAIL_OVER_ENDPOINT, "label": EndpointArtifactInfo.FAIL_OVER_ENDPOINT_LABEL},
            {"value": EndpointArtifactInfo.LOAD_BALANCE_ENDPOINT, "label": EndpointArtifactInfo.LOAD_BALANCE_ENDPOINT_LABEL},
            {"value": EndpointArtifactInfo.RECIPIENT_LIST_ENDPOINT, "label": EndpointArtifactInfo.RECIPIENT_LIST_ENDPOINT_LABEL},
            {"value": EndpointArtifactInfo.TEMPLATE_ENDPOINT, "label": EndpointArtifactInfo.TEMPLATE_ENDPOINT_LABEL}
        ];
        resolve(serviceArray);
    });
}

function createInboundEndpointServiceArray(): Promise<{"value": string; "label": string;}[]> {
    return new Promise((resolve) => {
        const serviceArray = [
            {"value": InboundEndpointArtifactInfo.HTTP_INBOUND_ENDPOINT, "label": InboundEndpointArtifactInfo.HTTP_INBOUND_ENDPOINT_LABEL},
            {"value": InboundEndpointArtifactInfo.FILE_INBOUND_ENDPOINT, "label": InboundEndpointArtifactInfo.FILE_INBOUND_ENDPOINT_LABEL},
            {"value": InboundEndpointArtifactInfo.JMS_INBOUND_ENDPOINT, "label": InboundEndpointArtifactInfo.JMS_INBOUND_ENDPOINT_LABEL},
            {"value": InboundEndpointArtifactInfo.CUSTOM_INBOUND_ENDPOINT, "label": InboundEndpointArtifactInfo.CUSTOM_INBOUND_ENDPOINT_LABEL},
            {"value": InboundEndpointArtifactInfo.HTTPS_INBOUND_ENDPOINT, "label": InboundEndpointArtifactInfo.HTTPS_INBOUND_ENDPOINT_LABEL},
            {"value": InboundEndpointArtifactInfo.HL7_INBOUND_ENDPOINT, "label": InboundEndpointArtifactInfo.HL7_INBOUND_ENDPOINT_LABEL},
            {"value": InboundEndpointArtifactInfo.KAFKA_INBOUND_ENDPOINT, "label": InboundEndpointArtifactInfo.KAFKA_INBOUND_ENDPOINT_LABEL},
            {"value": InboundEndpointArtifactInfo.CXF_WS_RM_INBOUND_ENDPOINT, "label": InboundEndpointArtifactInfo.CXF_WS_RM_INBOUND_ENDPOINT_LABEL},
            {"value": InboundEndpointArtifactInfo.MQTT_INBOUND_ENDPOINT, "label": InboundEndpointArtifactInfo.MQTT_INBOUND_ENDPOINT_LABEL},
            {"value": InboundEndpointArtifactInfo.RABBITMQ_INBOUND_ENDPOINT, "label": InboundEndpointArtifactInfo.RABBITMQ_INBOUND_ENDPOINT_LABEL},
            {"value": InboundEndpointArtifactInfo.FEED_INBOUND_ENDPOINT, "label": InboundEndpointArtifactInfo.FEED_INBOUND_ENDPOINT_LABEL},
            {"value": InboundEndpointArtifactInfo.WSO2_MB_INBOUND_ENDPOINT, "label": InboundEndpointArtifactInfo.WSO2_MB_INBOUND_ENDPOINT_LABEL},
            {"value": InboundEndpointArtifactInfo.WS_INBOUND_ENDPOINT, "label": InboundEndpointArtifactInfo.WS_INBOUND_ENDPOINT_LABEL},
            {"value": InboundEndpointArtifactInfo.WSS_INBOUND_ENDPOINT, "label": InboundEndpointArtifactInfo.WSS_INBOUND_ENDPOINT_LABEL}
        ];
        resolve(serviceArray);
    });
}
