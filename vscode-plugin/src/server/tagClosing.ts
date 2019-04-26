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

import {Disposable, Position, Range, SnippetString, TextDocument, TextDocumentContentChangeEvent, window,
    workspace} from "vscode";

export interface AutoCloseResult {
    snippet: string,
    range?: Range
}

export function activateTagClosing(tagProvider: (document: TextDocument, position: Position) => Thenable<AutoCloseResult>,
                                   supportedLanguages: { [id: string]: boolean }, configName: string): Disposable {
    const TRIGGER_CHARACTERS = ['>', '/'];
    let disposables: Disposable[] = [];
    workspace.onDidChangeTextDocument(event => onDidChangeTextDocument(event.document, event.contentChanges),
                                      null, disposables);

    let isEnabled = false;
    updateEnabledState();
    window.onDidChangeActiveTextEditor(updateEnabledState, null, disposables);

    let timeout: NodeJS.Timer | undefined = void 0;

    function updateEnabledState() {
        isEnabled = false;
        let editor = window.activeTextEditor;
        if (!editor) {
            return;
        }
        let document = editor.document;
        if (!supportedLanguages[document.languageId]) {
            return;
        }
        if (!workspace.getConfiguration(void 0, document.uri).get<boolean>(configName)) {
            return;
        }
        isEnabled = true;
    }

    function onDidChangeTextDocument(document: TextDocument, changes: TextDocumentContentChangeEvent[]) {
        if (!isEnabled) {
            return;
        }
        let activeDocument = window.activeTextEditor && window.activeTextEditor.document;
        if (document !== activeDocument || changes.length === 0) {
            return;
        }
        if (typeof timeout !== 'undefined') {
            clearTimeout(timeout);
        }
        let lastChange = changes[changes.length - 1];
        let lastCharacter = lastChange.text[lastChange.text.length - 1];
        if (lastChange.rangeLength > 0 || lastChange.text.length > 1 || lastCharacter in TRIGGER_CHARACTERS) {
            return;
        }
        let rangeStart = lastChange.range.start;
        let version = document.version;
        timeout = setTimeout(() => {
            let position = new Position(rangeStart.line, rangeStart.character + lastChange.text.length);
            tagProvider(document, position).then(result => {
                if (!result) {
                    return;
                }
                let text = result.snippet;
                let replaceLocation : Position | Range;
                let range : Range | undefined = result.range;
                if(range != undefined) {
                    // re-create Range
                    let line = range.start.line;
                    let character = range.start.character;
                    let startPosition = new Position(line, character);
                    line = range.end.line;
                    character = range.end.character;
                    let endPosition = new Position(line, character);
                    replaceLocation = new Range(startPosition, endPosition);
                }
                else {
                    replaceLocation = position;
                }
                if (text && isEnabled) {
                    let activeEditor = window.activeTextEditor;
                    if (activeEditor) {
                        let activeDocument = activeEditor.document;
                        if (document === activeDocument && activeDocument.version === version) {
                            activeEditor.insertSnippet(new SnippetString(text), replaceLocation);
                        }
                    }
                }
            });
            timeout = void 0;
        }, 100);
    }
    return Disposable.from(...disposables);
}
