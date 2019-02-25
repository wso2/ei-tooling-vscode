'use strict';

import * as vscode from 'vscode';

export function checkLanguage(document: any) {
	let xmlData = document.getText();
	if (checkNamespace(xmlData, "xmlns=\"http:\/\/ws\.apache\.org\/ns\/synapse")){
		vscode.languages.setTextDocumentLanguage(document, "SynapseXml");
	}else {
		console.log("Not a Synapse document");
	}
}

export function checkNamespace(text: string, namespaceSyntax: string): boolean{
	let synapseNSPttern = new RegExp(namespaceSyntax);
	let response = synapseNSPttern.test(text);
	if (response === true){
		return true;
	}
	return false;
}
