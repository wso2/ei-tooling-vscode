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

import React, {useContext, useState} from "react";
import {Circle} from "@wso2-ei/low-code-diagram";
import {getComponent} from "../../util";
import {WorkerLine} from "../worker-line";
import {Panel} from "../Panel";
import {Context as DiagramContext} from "../../../Contexts/diagram";
import {getCompletion} from "../../../DiagramGenerator/generatorUtil";
import {
    CompletionResponse,
    DiagramEditorLangClientInterface,
    GetCompletionResponse
} from "@wso2-ei/low-code-editor-commons";
import ItemList from "./ItemList";

interface SquareProps {
    model: Circle;
}

export function CircleComponent(props: SquareProps) {
    const {model} = props;

    const viewState = model.viewState;
    const components: JSX.Element[] = [];

    model.children.forEach(child => {
        components.push(getComponent(child.type, {model: child}));
    })

    const {
        api: {
            code: {
                gotoSource
            },
            ls: {
                getDiagramEditorLangClient
            }
        },
        props: {
            selectedPosition,
            currentFile
        },
    } = useContext(DiagramContext);

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    // const [formConfig, setFormConfig] = useState<FormGeneratorProps>();

    const [newFormConfig, setNewFormConfig] = useState<NewFormGeneratorProps>();

    async function getCompletionList(): Promise<string[]> {
        try {
            if (!getDiagramEditorLangClient) {
                return [];
            }
            const langClient = await getDiagramEditorLangClient();
            let completionList: CompletionResponse = await getCompletion(currentFile.path, currentFile.uri.external, 233, langClient);
            let list: GetCompletionResponse[] = completionList.items;
            return list.map(item => item.label);

        } catch (err) {
            return [];
        }
    }

    async function getNewCompletionList(): Promise<GetCompletionResponse[]> {
        try {
            if (!getDiagramEditorLangClient) {
                return [];
            }
            const langClient = await getDiagramEditorLangClient();
            let completionList: CompletionResponse = await getCompletion(currentFile.path, currentFile.uri.external, 233, langClient);
            return completionList.items;

        } catch (err) {
            return [];
        }
    }

    const handleButtonClick = async () => {
        console.log("clicked!")

        // const list =
        setIsDropdownOpen(!isDropdownOpen);
        // setFormConfig({
        //     optionList: await getCompletionList(),
        //     isDropdownOpen: !isDropdownOpen
        // });
        setNewFormConfig({
            getDiagramEditorLangClient,
            textDocumentUrl: currentFile.uri.external,
            textDocumentFsPath: currentFile.uri.fsPath,
            optionList: await getNewCompletionList(),
            isDropdownOpen: !isDropdownOpen
        })
    };


    // console.log(formConfig);
    return (
        <>
            <circle
                cx={viewState.bBox.cx}
                cy={viewState.bBox.cy}
                r={viewState.bBox.r}
                stroke="black"
                stroke-width="3"
                fill="#fff"
                onClick={handleButtonClick}
            />

            {/*{formConfig && <FormGenerator {...formConfig} />}*/}

            {newFormConfig && <NewFormGenerator {...newFormConfig} />}

            <WorkerLine
                model={model}
            />
            {components}
            {/*<NameComponent model={model} />*/}
        </>
    )
}

interface Props {
    options: string[];
    onSelect: (item: string) => void;
}

function Dropdown({ options, onSelect }: Props): JSX.Element {
    return (
        <ul>
            {options.map((option) => (
                <li key={option} onClick={() => onSelect(option)}>
                    {option}
                </li>
            ))}
        </ul>
    );
}

export interface FormGeneratorProps {
    optionList: string[]
    isDropdownOpen: boolean;
    onCancel?: () => void;
    onSave?: () => void;
    onBack?: () => void;
}

export interface NewFormGeneratorProps {
    getDiagramEditorLangClient?: () => Promise<DiagramEditorLangClientInterface>;
    textDocumentUrl: string;
    textDocumentFsPath: string;
    optionList: GetCompletionResponse[]
    isDropdownOpen: boolean;
    onCancel?: () => void;
    onSave?: () => void;
    onBack?: () => void;
}

export function FormGenerator(props: FormGeneratorProps) {

    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    return (
        <div>
            <Panel>
                <>
                    <Dropdown
                        options={props.optionList}
                        onSelect={setSelectedItem}
                    />
                </>
            </Panel>
        </div>
    );
}

export function NewFormGenerator(props: NewFormGeneratorProps) {

    return (
        <div>
            <Panel>
                <>
                    <CompletionListForm  {...props}></CompletionListForm>
                </>
            </Panel>
        </div>
    );
}

const CompletionListForm: React.FC<NewFormGeneratorProps> = (props: NewFormGeneratorProps) => {
    const { getDiagramEditorLangClient, optionList, textDocumentUrl, textDocumentFsPath } = props;
    return <ItemList items={optionList} textDocumentUrl={textDocumentUrl} textDocumentFsPath={textDocumentFsPath} getDiagramEditorLangClient={getDiagramEditorLangClient} />;
};
