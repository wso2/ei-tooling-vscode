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

import { Shape } from "@wso2-ei/low-code-diagram";

interface WorkerLineProps {
    model: Shape;
}

export function WorkerLine(props: WorkerLineProps) {
    const { model } = props;

    const workerLine = model.viewState.workerLine;

    return (
        <line 
            x1={workerLine.x1}
            x2={workerLine.x2}
            y1={workerLine.y1}
            y2={workerLine.y2}
            stroke="black"
            stroke-width="3"
        />
    )
}
