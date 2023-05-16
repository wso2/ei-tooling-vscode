/**
 * Copyright (c) 2023, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

import React, { useState } from "react";
import {
    DiagramEditorLangClientInterface,
    GetCompletionResponse,
    HoverResponse,
    TextEdit
} from "@wso2-ei/low-code-editor-commons";
import {applyChange} from "../../../DiagramGenerator/generatorUtil";
import "./style.scss"
import {LogMediatorProperty} from "./logMediatorProperty";

interface Item {
    detail: string;
    insertText: string;
    insertTextFormat: number;
    kind: number;
    label: string;
    documentation?: string;
    sortText?: string;
    filterText?: string;
    textEdit?: TextEdit;
}

interface Props {
    getDiagramEditorLangClient?: () => Promise<DiagramEditorLangClientInterface>;
    textDocumentUrl: string;
    textDocumentFsPath: string;
    items: GetCompletionResponse[];
    previousComponentStartPosition: number
}

const ItemList: React.FC<Props> = ({ items , textDocumentUrl, textDocumentFsPath, getDiagramEditorLangClient, previousComponentStartPosition}) => {
    const [selectedItem, setSelectedItem] = useState<GetCompletionResponse | null>(null);
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const [languageClient, setLangClient] = useState<DiagramEditorLangClientInterface | null>(null);
    let langClient;

    const handleItemClick = async (item: GetCompletionResponse) => {
        console.log("form item clicked!");
        setSelectedItem(item);
        setIsClicked(true);
        if (!item.textEdit) {
            return;
        }
        if (!getDiagramEditorLangClient) {
            return
        }
        langClient = await getDiagramEditorLangClient();
        setLangClient(langClient);
        // await modifyTextOnComponentSelection(textDocumentUrl, textDocumentFsPath, item.textEdit, previousComponentStartPosition, langClient);
    };

    return (
        <div>
            {!isClicked && <ul>
                {items.map((item, index) => (
                    <li className={"list-item"} key={index} onClick={() => handleItemClick(item)}>
                        {item.label}
                    </li>
                ))}
            </ul>}
            {isClicked && selectedItem && <LogMediatorProperty textEdit={selectedItem.textEdit} textDocumentUrl={textDocumentUrl} textDocumentFsPath={textDocumentFsPath} previousComponentStartPosition={previousComponentStartPosition}/> }
        </div>
    );
};

async function modifyTextOnComponentSelection(url: string, fsPath: string, text: TextEdit, previousComponentStartPosition: number, langClient: any) {
    await applyChange(url, fsPath, text, previousComponentStartPosition, langClient);
}

export default ItemList;

export interface HoverProps {
    description?: HoverResponse | null;
}

export const HoverPanel: React.FC<HoverProps> = ({description}) => {
    return (
        <div className={"list-item"}>
            {description?.contents.value}
        </div>
    );
}
