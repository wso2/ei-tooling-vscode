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
import {DiagramEditorLangClientInterface, GetCompletionResponse, TextEdit} from "@wso2-ei/low-code-editor-commons";
import {applyChange} from "../../../DiagramGenerator/generatorUtil";

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
}

const ItemList: React.FC<Props> = ({ items , textDocumentUrl, textDocumentFsPath, getDiagramEditorLangClient}) => {
    const [selectedItem, setSelectedItem] = useState<GetCompletionResponse | null>(null);

    const handleItemClick = async (item: GetCompletionResponse) => {
        console.log("form item clicked!");
        setSelectedItem(item);
        if (!item.textEdit) {
            return;
        }
        if (!getDiagramEditorLangClient) {
            return
        }
        const langClient = await getDiagramEditorLangClient();
        await modifyTextOnComponentSelection(textDocumentUrl, textDocumentFsPath, item.textEdit, langClient);
    };

    return (
        <div>
            <ul>
                {items.map((item, index) => (
                    <li key={index} onClick={() => handleItemClick(item)}>
                        {item.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

async function modifyTextOnComponentSelection(url: string, fsPath: string, text: TextEdit, langClient: any) {
    await applyChange(url, fsPath, text, langClient);
}

export default ItemList;