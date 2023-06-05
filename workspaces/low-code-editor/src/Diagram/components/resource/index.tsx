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

import React from "react";
import { getComponent } from "../../util";
import { WorkerLine } from "../worker-line";
import { Circle, Square } from "@wso2-ei/low-code-diagram";

interface SquareProps {
    model: Square;
}

export function Resource(props: SquareProps) {
    const { model } = props;

    const viewState = model.viewState;

    const components: JSX.Element[] = [];

    model.children.forEach(child => {
        components.push(getComponent(child.tag, { model: child }));
    })

    return (
        <>
            <svg>
                <rect
                    x={viewState.bBox.x}
                    y={viewState.bBox.y}
                    width={viewState.bBox.w}
                    height={viewState.bBox.h}
                    fill='#2978B1'
                    stroke="#fff"
                    stroke-width="4"
                />
            </svg>

            <WorkerLine
                model={model}
            />
            {components}
            {/*<NameComponent model={model} />*/}
        </>
    )
}