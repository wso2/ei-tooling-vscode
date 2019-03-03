'use strict';

import * as vscode from 'vscode';

export function setLanguageToSynapse(document: any): boolean {
	let xmlData = document.getText();
	if (match(xmlData, "xmlns=\"http:\/\/ws\.apache\.org\/ns\/synapse\"")){
		vscode.languages.setTextDocumentLanguage(document, "SynapseXml");
		return true;
	}
	return false;
}

export function match(text: string, namespaceSyntax: string): boolean{
	let synapseNSPttern = new RegExp(namespaceSyntax);
	let response = synapseNSPttern.test(text);
	if (response === true){
		return true;
	}
	return false;
}

export function registerCommandToChangeLanguageToSyanpse(context: vscode.ExtensionContext): any {
	const commandRegistration = vscode.commands.registerTextEditorCommand('extension.changeLanguage', (editor, edit) => {
		if(!setLanguageToSynapse(editor.document)) {
			changeLanguageToSynapse(editor, edit);
		}
	});
	context.subscriptions.push(commandRegistration);
}

export function changeLanguageToSynapse(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {

	// let rootElements = ["<definitions", "<api", "<proxy", "<endpoint", "<inbound", "<local_entry", "<messagestore", 
	// "<messageprocessor","<sequence", "<task", "<template", "<registry"];

	let number = editor.document.lineCount;
	var num = 0;
	var column;

	var stack1: any[] = [];
	var stack2: any[] = [];    

	while (num < number) {
		let currLine = editor.document.lineAt(num);
		let charArray = currLine.text.split("");
		column = stackFunction(charArray, stack1, stack2);

		if(typeof column === "number") {
			let endCharPosition = currLine.range.end.with(num, column-1);
			edit.insert(endCharPosition, " xmlns=\"http://ws.apache.org/ns/synapse\"");
			vscode.languages.setTextDocumentLanguage(editor.document, "SynapseXml");		
			break;
		}
		num++;
	}
}

function stackFunction(array: any, stack1: any[], stack2: any[]) {
	  
	let type: string = "undefined";
	let count: number = 0;
	let lastStack1Symbol;
	let lastStack2Symbol;

	for (let char of array) {
		count++;
		lastStack2Symbol = stack2.pop();

		switch (char){
			case "<":
				if(type !== "attribute" && type.substring(0,7) !== "comment") {
					stack1.push(char);
					type = "undefined";
				}
				break;
			case ">":
				lastStack1Symbol = stack1.pop();

				if(type === "commentStateSix" && lastStack2Symbol === "-" && lastStack1Symbol === "!") { 
					stack1.pop();
					type = "undefined";
					
				} else if(lastStack1Symbol === "<") {
					if(type === "xml") {
						stack1.pop();
						type = "undefined";
					} else{
						return count;
					}
				} else{
					stack1.push(lastStack1Symbol);
				}
				break;

			case "?":
				lastStack1Symbol = stack1.pop();

				if(lastStack1Symbol === "?" && type === "xml") {
					//continue
				} else if(lastStack1Symbol === "<" && lastStack2Symbol === "<") {
					stack1.push(lastStack1Symbol);
					stack1.push(char);
					type = "xml";
				} else{
					stack1.push(lastStack1Symbol);
				}
				break;

			case "!":
				lastStack1Symbol = stack1.pop();

				if(lastStack1Symbol === "<" && lastStack2Symbol === "<") {
					type = "commentStart";
					stack1.push(lastStack1Symbol);
					stack1.push(char);
				} else{
					stack1.push(lastStack1Symbol);
				}
				break;

			case "-":
				if(type === "commentStart" && lastStack2Symbol === "!") {
					type = "commentStateThree"; 
					stack1.push(char);//<!-
				} else if(type === "commentStateThree" && lastStack2Symbol === "-") {
					type = "commentStateFour"; 
					stack1.push(char);//<!--
				} else if(type === "commentStateFour") {
					type = "commentStateFive";
					stack1.pop(); //<!-
				} else if(type === "commentStateFive" && lastStack2Symbol === "-") {
					type = "commentStateSix";
					stack1.pop(); //<! 
				} 
				break;
				
			case "\"":
				lastStack1Symbol = stack1.pop();

				if(lastStack1Symbol === "<") {
					type = "attribute";
					stack1.push(lastStack1Symbol);
					stack1.push(char);
				} else if(type === "attribute" && lastStack1Symbol === "\"") {
					if(lastStack2Symbol === "\\") {
						stack1.push(lastStack1Symbol);
					} else {
						type = "undefined";
					}	
				} else{
					stack1.push(lastStack1Symbol);
				}
				break;
		}
		stack2.push(lastStack2Symbol);
		stack2.push(char);
	}
	console.log(stack1);
           
}