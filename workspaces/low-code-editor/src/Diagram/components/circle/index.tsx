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
import {Circle} from "@wso2-ei/low-code-diagram/lib";
import {getComponent} from "../../util";
import {WorkerLine} from "../worker-line";
import {Panel} from "../Panel";
import {Context as DiagramContext} from "../../../Contexts/diagram";
import {getCompletion, hover} from "../../../DiagramGenerator/generatorUtil";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import ReactTooltip from "react-tooltip";
import {
    CompletionResponse,
    DiagramEditorLangClientInterface,
    GetCompletionResponse, HoverResponse
} from "@wso2-ei/low-code-editor-commons";
import ItemList, {HoverPanel} from "./ItemList";

interface SquareProps {
    model: Circle;
}

export function CircleComponent(props: SquareProps) {
    const {model} = props;

    const viewState = model.viewState;
    const startPosition = model.start;
    const endPosition = model.end;
    const startTagOpenOffset = model.startTagOpenOffset
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

    const [isShown, setIsShown] = useState(false);

    const [hoverConfig, setHoverConfig] = useState<HoverProps>();

    async function getNewCompletionList(): Promise<GetCompletionResponse[]> {
        try {
            if (!getDiagramEditorLangClient) {
                return [];
            }
            const langClient = await getDiagramEditorLangClient();
            let completionList: CompletionResponse = await getCompletion(currentFile.path, currentFile.uri.external, endPosition, langClient);
            return completionList.items;

        } catch (err) {
            return [];
        }
    }

    const handleButtonClick = async () => {
        console.log("clicked!")

        // const list =
        setIsDropdownOpen(true);
        // setFormConfig({
        //     optionList: await getCompletionList(),
        //     isDropdownOpen: !isDropdownOpen
        // });
        setNewFormConfig({
            previousComponentStartPosition: startPosition,
            getDiagramEditorLangClient,
            textDocumentUrl: currentFile.uri.external,
            textDocumentFsPath: currentFile.uri.fsPath,
            optionList: await getNewCompletionList(),
            isDropdownOpen: isDropdownOpen
        })
    };

    async function getHoverResult(): Promise<HoverResponse | null> {
        try {
            if (!getDiagramEditorLangClient) {
                return null;
            }
            const langClient = await getDiagramEditorLangClient();
            let result: HoverResponse = await hover(currentFile.path, currentFile.uri.external, startTagOpenOffset + 1, langClient)
            return result;

        } catch (err) {
            return null;
        }
    }

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    const handlerHover = async  () => {
        console.log("hover!")
        setIsShown(true);
        await sleep(2000);
        if (getDiagramEditorLangClient) {
            setHoverConfig({
                description: await getHoverResult()
            })

        }
    };

    const handlerHoverClose = async  () => {
        console.log("hoverClose!")
        setIsShown(false);
    };

    var renderTooltip = <span>Hello World</span>;

    return (
        <>
            {/*<Tooltip*/}
            {/*    title="Tooltip for the register button"*/}
            {/*    placement="top"*/}
            {/*    enterDelay={1000}*/}
            {/*    leaveDelay={200}*/}

            {/*>*/}
            <circle
                cx={viewState.bBox.cx}
                cy={viewState.bBox.cy}
                r={viewState.bBox.r}
                stroke="black"
                stroke-width="3"
                fill="#fff"
                onClick={handleButtonClick}
                onMouseOver={handlerHover}
                onMouseLeave={handlerHoverClose}
            />

            {/*</Tooltip>*/}

            {newFormConfig && <NewFormGenerator {...newFormConfig} />}

            {isShown && <HoverGenerator {...hoverConfig} />}

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
    previousComponentStartPosition: number;
    getDiagramEditorLangClient?: () => Promise<DiagramEditorLangClientInterface>;
    textDocumentUrl: string;
    textDocumentFsPath: string;
    optionList: GetCompletionResponse[]
    isDropdownOpen: boolean;
    onCancel?: () => void;
    onSave?: () => void;
    onBack?: () => void;
}

export interface HoverProps {
    description?: HoverResponse | null;
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

export function HoverGenerator(props: HoverProps) {

    return (
        <div>
            <Panel>
                <>
                    <div color={"#3d3b3b"}>
                        <HoverForm {...props}></HoverForm>
                    </div>
                </>
            </Panel>
        </div>
    );
}

const HoverForm: React.FC<HoverProps> = (props: HoverProps) => {
    const { description } = props;
    return <HoverPanel description={description}/>;
}

const CompletionListForm: React.FC<NewFormGeneratorProps> = (props: NewFormGeneratorProps) => {
    const { previousComponentStartPosition, getDiagramEditorLangClient, optionList, textDocumentUrl, textDocumentFsPath } = props;
    return <ItemList items={optionList} textDocumentUrl={textDocumentUrl} textDocumentFsPath={textDocumentFsPath} getDiagramEditorLangClient={getDiagramEditorLangClient} previousComponentStartPosition={previousComponentStartPosition}/>;
};
