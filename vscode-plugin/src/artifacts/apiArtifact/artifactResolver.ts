'use strict';

import { window } from "vscode";
import { APIArtifactModule } from "./ApiArtifactModule";
import {APIArtifactInfo, ProxyArtifactInfo} from "./artifactUtils";

export async function createArtifact(artifactType: string) {
    let option: number | undefined;
    switch(artifactType) {
        case "api": {
            option = await showQuickPickForArtifactCreationOptions(APIArtifactInfo.CREATE_API, APIArtifactInfo.IMPORT_API, APIArtifactInfo.PLACEHOLDER_API);
            if(option && option === 1) {
                const destinationFileName = await window.showInputBox({ value: "", prompt: "Enter Synapse API Artifact Name", placeHolder: "Enter"}).then(text => text);
                
                if(destinationFileName) {
                    APIArtifactModule.createTemplate(APIArtifactInfo.API_DESTINATION_FOLDER, "api", destinationFileName);
                }
            }else if(option && option === 2) {
                //resolce import case
            }
            break;
        }
        case "proxy": {
            option = await showQuickPickForArtifactCreationOptions(ProxyArtifactInfo.CREATE_PROXY, ProxyArtifactInfo.IMPORT_PROXY, ProxyArtifactInfo.PLACEHOLDER_PROXY);
            if(option && option === 1) {
                const proxyTypes = createProxyServiceArray();
                const selectedArifactType = await showQuickPick(proxyTypes);
                
                if(selectedArifactType) {
                    const artifactName = await window.showInputBox({ value: "", prompt: "Enter Synapse Proxy Artifact Name", placeHolder: "Enter"}).then(text => text);
                    if(artifactName) {
                        APIArtifactModule.createTemplate(ProxyArtifactInfo.PROXY_DESTINATION_FOLDER, selectedArifactType, artifactName);
                    }
                }
            }else if(option && option === 2) {
                //resolce import case
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

async function showQuickPickForArtifactCreationOptions(create: string, imports: string, placeHolder: string): Promise<number | undefined> {
    return await window.showQuickPick(
        createQuickPickArray(create, imports).then(items => items.map(item => ({
            value: item.id,
            label: item.name,
            description: "",
            detail: ""
        }))),
        { matchOnDescription: true, placeHolder: placeHolder }
    ).then(selected => selected && selected.value);
}

async function showQuickPickForArtifactCreationOptionsNew(create: string, imports: string, placeHolder: string): Promise<number | undefined> {
    return await window.showQuickPick(
        createQuickPickArray(create, imports).then(items => items.map(item => ({
            value: item.id,
            label: item.name,
            description: "",
            detail: ""
        }))),
        { matchOnDescription: true, placeHolder: placeHolder }
    ).then(selected => selected && selected.value);
}

function createQuickPickArray(create: string, imports: string): Promise<{"id": number, "name":string}[]>{
    return new Promise((resolve, reject)=>{
        const options = [{"id": 1, "name":create}, {"id": 1, "name":imports}];
        resolve(options);
    });
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

