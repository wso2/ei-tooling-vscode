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
import {APIArtifactInfo, ProxyArtifactInfo} from "./artifactUtils";

export async function createArtifact(artifactType: string) {
    switch(artifactType) {
        case "api": {
            const destinationFileName = await window.showInputBox({ value: "", prompt: "Enter Synapse API Artifact Name", placeHolder: "Enter"}).then(text => text);
            if(destinationFileName) {
                ArtifactModule.createTemplate(APIArtifactInfo.API_DESTINATION_FOLDER, "api", destinationFileName);
            }
            break;
        } 
        case "proxy": {
            const proxyTypes = createProxyServiceArray();
            const selectedArifactType = await showQuickPick(proxyTypes);
            
            if(selectedArifactType) {
                const artifactName = await window.showInputBox({ value: "", prompt: "Enter Synapse Proxy Artifact Name", placeHolder: "Enter"}).then(text => text);
                if(artifactName) {
                    ArtifactModule.createTemplate(ProxyArtifactInfo.PROXY_DESTINATION_FOLDER, selectedArifactType, artifactName);
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
    return new Promise((resolve, reject) => {
        const serviceArray = [
            {"value": ProxyArtifactInfo.PASS_THROUGH_PROXY, "label": ProxyArtifactInfo.PASS_THROUGH_PROXY_LABEL},
            {"value": ProxyArtifactInfo.CUSTOM_PROXY, "label": ProxyArtifactInfo.CUSTOM_PROXY_LABEL},
            {"value": ProxyArtifactInfo.TRANSFOREMER_PROXY, "label": ProxyArtifactInfo.TRANSFOREMER_PROXY_LABEL},
            {"value": ProxyArtifactInfo.LOGGING_PROXY, "label": ProxyArtifactInfo.LOGGING_PROXY_LABEL},
            {"value": ProxyArtifactInfo.WSDL_BASED_PROXY, "label": ProxyArtifactInfo.WSDL_BASED_PROXY_LABEL},
            {"value": ProxyArtifactInfo.SECURE_PROXY, "label": ProxyArtifactInfo.SECURE_PROXY_LABEL}
        ];
        resolve(serviceArray);
    });
}

