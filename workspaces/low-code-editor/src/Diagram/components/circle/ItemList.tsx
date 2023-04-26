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
        modifyTextOnComponentSelection(textDocumentUrl, textDocumentFsPath, item.textEdit, langClient);
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