'use strict';

import * as vscode from 'vscode';

export function checkSynapseLanguage(document: any) {
	let xmlData = document.getText();
	if (checkNamespace(xmlData, "xmlns=\"http:\/\/ws\.apache\.org\/ns\/synapse\"")){
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

export function registerCommandToChangeLanguageToSyanpse(context: vscode.ExtensionContext): any {
	const commandRegistration = vscode.commands.registerTextEditorCommand('extension.changeLanguage', (editor, edit) => {
		changeLanguageToSynapse(editor, edit);
	});

	context.subscriptions.push(commandRegistration);
}

export function changeLanguageToSynapse(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
	let rootElements = ["<definitions", "<api", "<proxy", "<endpoint", "<inbound", "<local_entry", "<messagestore", 
	"<messageprocessor","<sequence", "<task", "<template", "<registry"];

	let number = editor.document.lineCount;
	var num = 0;
	var count = 0;

	loop:
	while (num < number) {
		let currLine = editor.document.lineAt(num);

		// let v = currLine.text.split("");
		// console.log("``````````````````````");
		// console.log(v);
		// console.log("``````````````````````");

		// stackFunction(v);



		if (!currLine.isEmptyOrWhitespace) {

			num = skipCommentBlocks(editor, num, number);

			for (let element of rootElements) {
				if(checkNamespace(currLine.text, element)) {
					if(!checkNamespace(currLine.text, "\"http:\/\/ws\.apache\.org\/ns\/synapse")) {
						let endCharPosition = currLine.range.end.with(currLine.range.end.line, currLine.range.end.character-1);
						edit.insert(endCharPosition, " xmlns=\"http://ws.apache.org/ns/synapse\"");
						vscode.languages.setTextDocumentLanguage(editor.document, "SynapseXml");	
					}
					break loop;
				}
			}
		}
		num++;
	}
}


export function skipCommentBlocks(editor: vscode.TextEditor, currLineNumber: number, documentLength: number): number {
	
	
	

	if(checkNamespace(editor.document.lineAt(currLineNumber).text, "<!--")) {
		while (currLineNumber < documentLength) {
			if(checkNamespace(editor.document.lineAt(currLineNumber).text, "-->")){
				return currLineNumber + 1;
			}
			currLineNumber++;
		}
		// editor.document.lineAt(currLineNumber).text.
	}
	return currLineNumber;
}


export function stackFunction(array: any) {
	var stack = [];
	stack.push(2);       
	stack.push(5);       
	var i = stack.pop(); 

	let type;
	let prevChar;
	let lastStackSymbol;

	for (let char of array) {
		stack.push(char);
		if(char ) {

		}

		switch (char){
			case "<":
				stack.push(char);
			case ">":
				lastStackSymbol = stack.pop();
				if (lastStackSymbol === "<") {

				} else if(lastStackSymbol === "!") {

				}
			case "?":
			lastStackSymbol = stack.pop();
				if(lastStackSymbol !== "?") {
					stack.push(char);
				}
			case "!":
				lastStackSymbol = stack.pop();
				if(lastStackSymbol !== "<") {
					stack.push(char);
				}

			case "-":


			case "\"":
		}

		prevChar = char;
	}

	console.log(stack);



	// alert(i);            
}