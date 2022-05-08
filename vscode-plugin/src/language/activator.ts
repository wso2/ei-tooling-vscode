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

import {ExtensionContext, languages, TextEditor, TextEditorEdit} from 'vscode';
import {SYNAPSE_LANGUAGE_ID, SYNAPSE_NAMESPACE} from "./languageUtils";
import * as path from "path";
import extension = require("../extension");
import {launch as launchServer} from "../server";

/**
 * Set language-id to SynapseXml if Synapse namespace exists in the file.
 */
export function setLanguageToSynapse(document: any): boolean {
    let xmlData = document.getText();
    let synapseNSPattern = new RegExp(SYNAPSE_NAMESPACE);

    if (synapseNSPattern.test(xmlData)) {
        languages.setTextDocumentLanguage(document, SYNAPSE_LANGUAGE_ID);
        return true;
    }
    return false;
}

export function changeLanguageToSynapse(editor: TextEditor, edit: TextEditorEdit, context: ExtensionContext,
                                        directoryName: string) {

    let lineCount = editor.document.lineCount;
    let num = 0;
    let column;
    let changedLangToSynapse: boolean = false;

    if (lineCount > 0 && !editor.document.lineAt(0).isEmptyOrWhitespace) {
        let stack1: any[] = [];
        let stack2: any[] = [];

        while (num < lineCount) {
            let currLine = editor.document.lineAt(num);
            let charArray = currLine.text.split("");
            column = stackFunction(charArray, stack1, stack2);

            if (typeof column === "number") {
                let endCharPosition = currLine.range.end.with(num, column - 1);
                edit.insert(endCharPosition, " " + SYNAPSE_NAMESPACE);
                languages.setTextDocumentLanguage(editor.document, SYNAPSE_LANGUAGE_ID);
                changedLangToSynapse = true;
                break;
            }
            num++;
        }
        if (typeof column === "undefined") {
            let newLine = editor.document.lineAt(num - 1);
            let endCharPosition = newLine.range.end.with(num, 0);
            const {rootElementTagName, fileName} = Object.assign(getRootElementTagName(editor.document.uri.fsPath));
            edit.insert(endCharPosition, "<" + rootElementTagName + " name=\"" + fileName +
                                         "\" xmlns=\"http://ws.apache.org/ns/synapse\">\n\n</" + rootElementTagName +
                                         ">");
            languages.setTextDocumentLanguage(editor.document, SYNAPSE_LANGUAGE_ID);
            changedLangToSynapse = true;
        }
    } else {
        let endCharPosition = editor.document.positionAt(0);
        const {rootElementTagName, fileName} = Object.assign(getRootElementTagName(editor.document.uri.fsPath));

        let completionItem: string = "";
        if (rootElementTagName !== "localEntry") {
            completionItem = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n\n" +
                             "<" + rootElementTagName + " name=\"" + fileName + "\" " +
                             "xmlns=\"http://ws.apache.org/ns/synapse\">\n\n</" + rootElementTagName + ">";
        } else {
            completionItem = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n\n" +
                             "<" + rootElementTagName + " key=\"" + fileName + "\" " +
                             "xmlns=\"http://ws.apache.org/ns/synapse\">\n\n</" + rootElementTagName + ">";
        }

        edit.insert(endCharPosition, completionItem);
        languages.setTextDocumentLanguage(editor.document, SYNAPSE_LANGUAGE_ID);
        changedLangToSynapse = true;
    }
    if (changedLangToSynapse && !extension.serverLaunched) {
        extension.serverLaunched = true;
        launchServer(context, directoryName);
    }
}

interface FileInfo {
    rootElementTagName: string;
    fileName: string;
}

function getRootElementTagName(filePath: string): FileInfo {
    let fileInfo: FileInfo = {} as any;
    if (new RegExp(path.join("src", "main", "synapse-config", "api", "[a-zA-Z ]+.xml$")).test(filePath)) {
        fileInfo.rootElementTagName = "api";
    } else if (new RegExp(path.join("synapse-config", "endpoints", "[a-zA-Z ]+.xml$")).test(filePath)) {
        fileInfo.rootElementTagName = "endpoint";
    } else if (new RegExp(path.join("synapse-config", "inbound-endpoints", "[a-zA-Z ]+.xml$")).test(filePath)) {
        fileInfo.rootElementTagName = "inboundEndpoint";
    } else if (new RegExp(path.join("synapse-config", "local-entries", "[a-zA-Z ]+.xml$")).test(filePath)) {
        fileInfo.rootElementTagName = "localEntry";
    } else if (new RegExp(path.join("synapse-config", "message-processors", "[a-zA-Z ]+.xml$")).test(filePath)) {
        fileInfo.rootElementTagName = "messageProcessor";
    } else if (new RegExp(path.join("synapse-config", "message-stores", "[a-zA-Z ]+.xml$")).test(filePath)) {
        fileInfo.rootElementTagName = "messageStore";
    } else if (new RegExp(path.join("synapse-config", "proxy-services", "[a-zA-Z ]+.xml$")).test(filePath)) {
        fileInfo.rootElementTagName = "proxy";
    } else if (new RegExp(path.join("synapse-config", "sequences", "[a-zA-Z ]+.xml$")).test(filePath)) {
        fileInfo.rootElementTagName = "sequence";
    } else if (new RegExp(path.join("synapse-config", "tasks", "[a-zA-Z ]+.xml$")).test(filePath)) {
        fileInfo.rootElementTagName = "task";
    } else if (new RegExp(path.join("synapse-config", "templates", "[a-zA-Z ]+.xml$")).test(filePath)) {
        fileInfo.rootElementTagName = "template";
    }
    let array1: string[] = filePath.split(path.sep);
    let fileName: string = array1[array1.length - 1];
    let array2: string[] = fileName.split(".");
    fileInfo.fileName = array2[0];

    return fileInfo;
}

function stackFunction(array: any, stack1: any[], stack2: any[]) {

    let type: string = "undefined";
    let count: number = 0;
    let lastStack1Symbol;
    let lastStack2Symbol;

    for (let char of array) {
        count++;
        lastStack2Symbol = stack2.pop();

        switch (char) {
            case "<":
                if (type !== "attribute" && type.substring(0, 7) !== "comment") {
                    stack1.push(char);
                    type = "undefined";
                }
                break;
            case ">":
                lastStack1Symbol = stack1.pop();

                if (type === "commentStateSix" && lastStack2Symbol === "-" && lastStack1Symbol === "!") {
                    stack1.pop();
                    type = "undefined";

                } else if (lastStack1Symbol === "<") {
                    if (type === "xml") {
                        stack1.pop();
                        type = "undefined";
                    } else {
                        return count;
                    }
                } else {
                    stack1.push(lastStack1Symbol);
                }
                break;

            case "?":
                lastStack1Symbol = stack1.pop();

                if (lastStack1Symbol === "?" && type === "xml") {
                    //continue
                } else if (lastStack1Symbol === "<" && lastStack2Symbol === "<") {
                    stack1.push(lastStack1Symbol);
                    stack1.push(char);
                    type = "xml";
                } else {
                    stack1.push(lastStack1Symbol);
                }
                break;

            case "!":
                lastStack1Symbol = stack1.pop();

                if (lastStack1Symbol === "<" && lastStack2Symbol === "<") {
                    type = "commentStart";
                    stack1.push(lastStack1Symbol);
                    stack1.push(char);
                } else {
                    stack1.push(lastStack1Symbol);
                }
                break;

            case "-":
                if (type === "commentStart" && lastStack2Symbol === "!") {
                    type = "commentStateThree";
                    stack1.push(char);//<!-
                } else if (type === "commentStateThree" && lastStack2Symbol === "-") {
                    type = "commentStateFour";
                    stack1.push(char);//<!--
                } else if (type === "commentStateFour") {
                    type = "commentStateFive";
                    stack1.pop(); //<!-
                } else if (type === "commentStateFive" && lastStack2Symbol === "-") {
                    type = "commentStateSix";
                    stack1.pop(); //<!
                }
                break;

            case "\"":
                lastStack1Symbol = stack1.pop();

                if (lastStack1Symbol === "<") {
                    type = "attribute";
                    stack1.push(lastStack1Symbol);
                    stack1.push(char);
                } else if (type === "attribute" && lastStack1Symbol === "\"") {
                    if (lastStack2Symbol === "\\") {
                        stack1.push(lastStack1Symbol);
                    } else {
                        type = "undefined";
                    }
                } else {
                    stack1.push(lastStack1Symbol);
                }
                break;
        }
        stack2.push(lastStack2Symbol);
        stack2.push(char);
    }
}

