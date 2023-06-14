
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

export function Event(props: SquareProps) {
    const { model } = props;

    const viewState = model.viewState;
    const components: JSX.Element[] = [];

    model.children.forEach(child => {
        components.push(getComponent(child.type, { model: child }));
    })

    return (
        <>

            <svg x={viewState.bBox.x} y={viewState.bBox.y} width={viewState.bBox.r * 2} height={viewState.bBox.r * 2} viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="300" cy="300" r="300" fill="#008234" />
                <path d="M241.528 525V495.909H261.131V500.98H247.679V507.912H260.122V512.983H247.679V519.929H261.188V525H241.528ZM286.248 503.182L278.62 525H271.802L264.174 503.182H270.566L275.097 518.793H275.325L279.842 503.182H286.248ZM298.585 525.426C296.34 525.426 294.408 524.972 292.789 524.062C291.179 523.144 289.939 521.847 289.067 520.17C288.196 518.485 287.761 516.491 287.761 514.19C287.761 511.946 288.196 509.976 289.067 508.281C289.939 506.586 291.165 505.265 292.746 504.318C294.337 503.371 296.203 502.898 298.343 502.898C299.782 502.898 301.122 503.13 302.363 503.594C303.613 504.048 304.702 504.735 305.63 505.653C306.567 506.572 307.297 507.727 307.817 509.119C308.338 510.502 308.599 512.121 308.599 513.977V515.639H290.175V511.889H302.903C302.903 511.018 302.713 510.246 302.335 509.574C301.956 508.902 301.43 508.376 300.758 507.997C300.095 507.609 299.323 507.415 298.442 507.415C297.524 507.415 296.71 507.628 295.999 508.054C295.299 508.471 294.749 509.034 294.352 509.744C293.954 510.445 293.75 511.226 293.741 512.088V515.653C293.741 516.733 293.94 517.666 294.337 518.452C294.745 519.238 295.317 519.844 296.056 520.27C296.795 520.696 297.671 520.909 298.684 520.909C299.356 520.909 299.972 520.814 300.531 520.625C301.089 520.436 301.567 520.152 301.965 519.773C302.363 519.394 302.666 518.93 302.874 518.381L308.471 518.75C308.187 520.095 307.604 521.269 306.724 522.273C305.853 523.267 304.726 524.044 303.343 524.602C301.97 525.152 300.384 525.426 298.585 525.426ZM318.599 512.386V525H312.548V503.182H318.315V507.031H318.57C319.053 505.762 319.863 504.759 320.999 504.02C322.136 503.272 323.513 502.898 325.133 502.898C326.648 502.898 327.969 503.229 329.096 503.892C330.223 504.555 331.099 505.502 331.724 506.733C332.349 507.955 332.661 509.413 332.661 511.108V525H326.61V512.188C326.62 510.852 326.279 509.811 325.587 509.062C324.896 508.305 323.944 507.926 322.732 507.926C321.918 507.926 321.198 508.101 320.573 508.452C319.958 508.802 319.475 509.313 319.124 509.986C318.783 510.649 318.608 511.449 318.599 512.386ZM349.036 503.182V507.727H335.896V503.182H349.036ZM338.879 497.955H344.93V518.295C344.93 518.854 345.016 519.29 345.186 519.602C345.357 519.905 345.593 520.118 345.896 520.241C346.209 520.365 346.569 520.426 346.976 520.426C347.26 520.426 347.544 520.402 347.828 520.355C348.112 520.298 348.33 520.256 348.482 520.227L349.433 524.73C349.13 524.825 348.704 524.934 348.155 525.057C347.606 525.189 346.938 525.27 346.152 525.298C344.694 525.355 343.415 525.161 342.317 524.716C341.228 524.271 340.38 523.58 339.774 522.642C339.168 521.705 338.87 520.521 338.879 519.091V497.955Z" fill="white" />
                <path d="M322 311H338.5V342.02L365.34 357.53L357.09 371.83L322 351.59V311ZM366 256H212V377H263.37C258.64 366.99 256 355.77 256 344C256 323.578 264.112 303.993 278.553 289.553C292.993 275.112 312.578 267 333 267C344.77 267 355.99 269.64 366 274.37V256ZM212 399C199.79 399 190 389.1 190 377V223C190 210.79 199.79 201 212 201H223V179H245V201H333V179H355V201H366C371.835 201 377.431 203.318 381.556 207.444C385.682 211.569 388 217.165 388 223V290.1C401.64 303.96 410 322.99 410 344C410 364.422 401.888 384.007 387.447 398.447C373.007 412.888 353.422 421 333 421C311.99 421 292.96 412.64 279.1 399H212ZM333 290.65C318.851 290.65 305.281 296.271 295.276 306.276C285.271 316.281 279.65 329.851 279.65 344C279.65 373.48 303.52 397.35 333 397.35C340.006 397.35 346.943 395.97 353.416 393.289C359.889 390.608 365.77 386.678 370.724 381.724C375.678 376.77 379.608 370.889 382.289 364.416C384.97 357.943 386.35 351.006 386.35 344C386.35 314.52 362.48 290.65 333 290.65Z" fill="white" />
            </svg>


            <WorkerLine
                model={model}
            />
            {components}
        </>
    )
}