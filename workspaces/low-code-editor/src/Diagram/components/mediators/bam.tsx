
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
import { Circle } from "@wso2-ei/low-code-diagram";
import { getComponent } from "../../util";
import { WorkerLine } from "../worker-line";

interface SquareProps {
    model: Circle;
}

export function Bam(props: SquareProps) {
    const { model } = props;

    const viewState = model.viewState;
    const components: JSX.Element[] = [];

    model.children.forEach(child => {
        components.push(getComponent(child.type, { model: child }));
    })

    return (
        <>

            <svg x={viewState.bBox.x} y={viewState.bBox.y} width={viewState.bBox.r * 2} height={viewState.bBox.r * 2} viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="300" cy="300" r="300" fill="#238C77" />
                <path d="M255.528 520V490.909H267.176C269.316 490.909 271.101 491.226 272.531 491.861C273.961 492.495 275.036 493.376 275.756 494.503C276.475 495.62 276.835 496.908 276.835 498.366C276.835 499.503 276.608 500.502 276.153 501.364C275.699 502.216 275.074 502.917 274.278 503.466C273.492 504.006 272.593 504.389 271.58 504.616V504.901C272.688 504.948 273.724 505.26 274.69 505.838C275.666 506.416 276.456 507.225 277.062 508.267C277.669 509.299 277.972 510.53 277.972 511.96C277.972 513.504 277.588 514.882 276.821 516.094C276.063 517.296 274.941 518.248 273.455 518.949C271.968 519.65 270.135 520 267.957 520H255.528ZM261.679 514.972H266.693C268.407 514.972 269.657 514.645 270.443 513.991C271.229 513.329 271.622 512.448 271.622 511.349C271.622 510.545 271.428 509.834 271.04 509.219C270.652 508.603 270.098 508.12 269.378 507.77C268.668 507.42 267.82 507.244 266.835 507.244H261.679V514.972ZM261.679 503.082H266.239C267.081 503.082 267.83 502.936 268.483 502.642C269.146 502.339 269.667 501.913 270.045 501.364C270.434 500.814 270.628 500.156 270.628 499.389C270.628 498.338 270.254 497.491 269.506 496.847C268.767 496.203 267.716 495.881 266.352 495.881H261.679V503.082ZM286.988 520H280.397L290.44 490.909H298.366L308.394 520H301.803L294.516 497.557H294.289L286.988 520ZM286.576 508.565H302.144V513.366H286.576V508.565ZM311.896 490.909H319.481L327.492 510.455H327.833L335.844 490.909H343.43V520H337.464V501.065H337.222L329.694 519.858H325.631L318.103 500.994H317.862V520H311.896V490.909Z" fill="white" />
                <rect x="179" y="323" width="25" height="69" fill="white" />
                <rect x="233" y="297" width="25" height="95" fill="white" />
                <rect x="287" y="336" width="25" height="56" fill="white" />
                <rect x="341" y="278" width="25" height="114" fill="white" />
                <path d="M395 238H420V392H395V238Z" fill="white" />
                <circle cx="191.5" cy="302.5" r="12.5" fill="white" />
                <circle cx="245.5" cy="270.5" r="12.5" fill="white" />
                <circle cx="299.5" cy="317.5" r="12.5" fill="white" />
                <circle cx="353.5" cy="250.5" r="12.5" fill="white" />
                <circle cx="407.5" cy="219.5" r="12.5" fill="white" />
                <rect x="243.072" y="268.641" width="6" height="55.1028" transform="rotate(59.3548 243.072 268.641)" fill="white" />
                <rect x="298.275" y="310.473" width="6" height="55.1028" transform="rotate(131.446 298.275 310.473)" fill="white" />
                <rect x="407.588" y="210" width="6" height="63" transform="rotate(54.9699 407.588 210)" fill="white" />
                <rect x="343.999" y="251" width="6" height="77.7056" transform="rotate(36.2968 343.999 251)" fill="white" />
            </svg>


            <WorkerLine
                model={model}
            />
            {components}
        </>
    )
}