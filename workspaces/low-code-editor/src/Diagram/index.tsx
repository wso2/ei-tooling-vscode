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

import {ShapeKindChecker} from "@wso2-ei/low-code-diagram";
import { Shape } from "@wso2-ei/low-code-diagram";
import { getComponent } from "./util";
import React, {useContext} from "react";
import { Context as DiagramContext } from "../Contexts/diagram";

export function LowCodeDiagram() {

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
            syntaxTree
        },
    } = useContext(DiagramContext);

    const model = syntaxTree;

    const components: JSX.Element[] = [];

    let height = 0
    let width = 0;

    if (model) {
        components.push(getComponent(model.tag, { model }));

        const viewState = (model as Shape).viewState;

        if (ShapeKindChecker.isCircleShape(model as Shape)) {
            height = viewState.bBox.h;
            width = viewState.bBox.r * 2 + 10;
        } else {
            height = viewState.bBox.h;
            width = viewState.bBox.w;
        }
    }

    return (
        <>
            <div id={'canvas-overlay'} className={"overlayContainer"} />
            <svg width={width} height={height}>
                {components}
            </svg>
        </>
    )
}
