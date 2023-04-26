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

import {STNode} from "@wso2-ei/syntax-tree";
import {MediatorSVG, START_SVG_HEIGHT, START_SVG_WIDTH} from "./MediatorSVG";

export interface MediatorProps {
    model: STNode;
}

export function STNode(props: MediatorProps) {
    // const diagramContext = useContext(Context);
    // const { isReadOnly } = diagramContext.props;

    const { model } = props;
    const viewState = model.viewState;
    const cx = viewState.trigger.cx;
    const cy = viewState.trigger.cy;

    return (
        // hide edit button for triggers and expression bodied functions
        <g className="mediator-wrapper">
            <MediatorSVG
                x={cx - (START_SVG_WIDTH / 2)}
                y={cy - (START_SVG_HEIGHT / 2)}
                text="START"
            />
            {/*{block && initPlusAvailable && !isReadOnly && <PlusButton viewState={plusView} model={block} initPlus={true} />}*/}
        </g>
    );
}

export * from "./MediatorSVG";
