
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

export function CallOut(props: SquareProps) {
    const { model } = props;

    const viewState = model.viewState;

    const components: JSX.Element[] = [];

    model.children.forEach(child => {
        components.push(getComponent(child.tag, { model: child }));
    })

    return (
        <>

            <svg x={viewState.bBox.x} y={viewState.bBox.y} width={viewState.bBox.r * 2} height={viewState.bBox.r * 2} viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="300" cy="300" r="300" fill="#AD7B41" />
                <path d="M258.77 493.724H253.457C253.306 492.853 253.027 492.081 252.619 491.409C252.212 490.727 251.705 490.15 251.099 489.676C250.493 489.203 249.802 488.848 249.026 488.611C248.259 488.365 247.43 488.241 246.54 488.241C244.958 488.241 243.557 488.639 242.335 489.435C241.114 490.221 240.157 491.376 239.466 492.901C238.775 494.416 238.429 496.267 238.429 498.455C238.429 500.68 238.775 502.555 239.466 504.08C240.167 505.595 241.123 506.741 242.335 507.517C243.557 508.284 244.954 508.668 246.526 508.668C247.397 508.668 248.211 508.554 248.969 508.327C249.736 508.09 250.422 507.744 251.028 507.29C251.644 506.835 252.16 506.277 252.577 505.614C253.003 504.951 253.296 504.193 253.457 503.341L258.77 503.369C258.571 504.752 258.14 506.049 257.477 507.261C256.824 508.473 255.967 509.544 254.906 510.472C253.846 511.39 252.605 512.11 251.185 512.631C249.764 513.142 248.188 513.398 246.455 513.398C243.898 513.398 241.616 512.806 239.608 511.622C237.6 510.438 236.019 508.729 234.864 506.494C233.708 504.259 233.131 501.58 233.131 498.455C233.131 495.32 233.713 492.64 234.878 490.415C236.043 488.18 237.629 486.471 239.636 485.287C241.644 484.103 243.917 483.511 246.455 483.511C248.074 483.511 249.58 483.739 250.972 484.193C252.364 484.648 253.604 485.315 254.693 486.196C255.782 487.067 256.677 488.137 257.378 489.406C258.088 490.666 258.552 492.105 258.77 493.724ZM269.647 513.44C268.264 513.44 267.019 513.194 265.911 512.702C264.813 512.2 263.942 511.461 263.298 510.486C262.663 509.51 262.346 508.308 262.346 506.878C262.346 505.647 262.573 504.629 263.028 503.824C263.482 503.019 264.103 502.375 264.888 501.892C265.674 501.409 266.56 501.045 267.545 500.798C268.539 500.543 269.567 500.358 270.627 500.244C271.906 500.112 272.942 499.993 273.738 499.889C274.533 499.776 275.111 499.605 275.471 499.378C275.84 499.141 276.025 498.777 276.025 498.284V498.199C276.025 497.129 275.708 496.3 275.073 495.713C274.439 495.126 273.525 494.832 272.332 494.832C271.072 494.832 270.073 495.107 269.335 495.656C268.605 496.205 268.113 496.854 267.857 497.602L263.056 496.92C263.435 495.595 264.06 494.487 264.931 493.597C265.802 492.697 266.868 492.025 268.127 491.58C269.387 491.125 270.779 490.898 272.303 490.898C273.354 490.898 274.401 491.021 275.442 491.267C276.484 491.513 277.436 491.92 278.298 492.489C279.159 493.047 279.851 493.81 280.371 494.776C280.902 495.741 281.167 496.949 281.167 498.398V513H276.224V510.003H276.053C275.741 510.609 275.3 511.177 274.732 511.707C274.174 512.228 273.468 512.65 272.616 512.972C271.773 513.284 270.783 513.44 269.647 513.44ZM270.982 509.662C272.014 509.662 272.909 509.458 273.667 509.051C274.424 508.634 275.007 508.085 275.414 507.403C275.831 506.722 276.039 505.978 276.039 505.173V502.602C275.878 502.735 275.603 502.858 275.215 502.972C274.836 503.085 274.41 503.185 273.937 503.27C273.463 503.355 272.995 503.431 272.531 503.497C272.067 503.563 271.664 503.62 271.323 503.668C270.556 503.772 269.87 503.942 269.263 504.179C268.657 504.416 268.179 504.747 267.829 505.173C267.478 505.59 267.303 506.13 267.303 506.793C267.303 507.74 267.649 508.455 268.34 508.938C269.031 509.42 269.912 509.662 270.982 509.662ZM291.479 483.909V513H286.337V483.909H291.479ZM301.909 483.909V513H296.767V483.909H301.909ZM316.714 513.426C314.583 513.426 312.737 512.957 311.174 512.02C309.612 511.082 308.399 509.771 307.538 508.085C306.685 506.4 306.259 504.43 306.259 502.176C306.259 499.922 306.685 497.948 307.538 496.253C308.399 494.558 309.612 493.241 311.174 492.304C312.737 491.366 314.583 490.898 316.714 490.898C318.844 490.898 320.691 491.366 322.254 492.304C323.816 493.241 325.023 494.558 325.876 496.253C326.737 497.948 327.168 499.922 327.168 502.176C327.168 504.43 326.737 506.4 325.876 508.085C325.023 509.771 323.816 511.082 322.254 512.02C320.691 512.957 318.844 513.426 316.714 513.426ZM316.742 509.307C317.897 509.307 318.863 508.99 319.64 508.355C320.416 507.711 320.994 506.849 321.373 505.77C321.761 504.69 321.955 503.488 321.955 502.162C321.955 500.827 321.761 499.619 321.373 498.54C320.994 497.451 320.416 496.584 319.64 495.94C318.863 495.296 317.897 494.974 316.742 494.974C315.558 494.974 314.574 495.296 313.788 495.94C313.011 496.584 312.429 497.451 312.04 498.54C311.662 499.619 311.472 500.827 311.472 502.162C311.472 503.488 311.662 504.69 312.04 505.77C312.429 506.849 313.011 507.711 313.788 508.355C314.574 508.99 315.558 509.307 316.742 509.307ZM345.439 503.824V491.182H350.581V513H345.595V509.122H345.368C344.875 510.344 344.066 511.343 342.939 512.119C341.821 512.896 340.444 513.284 338.805 513.284C337.375 513.284 336.111 512.967 335.013 512.332C333.924 511.688 333.071 510.756 332.456 509.534C331.84 508.303 331.533 506.816 331.533 505.074V491.182H336.675V504.278C336.675 505.661 337.054 506.759 337.811 507.574C338.569 508.388 339.563 508.795 340.794 508.795C341.552 508.795 342.286 508.611 342.996 508.241C343.706 507.872 344.288 507.323 344.743 506.594C345.207 505.855 345.439 504.932 345.439 503.824ZM366.763 491.182V495.159H354.221V491.182H366.763ZM357.317 485.955H362.46V506.438C362.46 507.129 362.564 507.659 362.772 508.028C362.99 508.388 363.274 508.634 363.624 508.767C363.975 508.9 364.363 508.966 364.789 508.966C365.111 508.966 365.405 508.942 365.67 508.895C365.944 508.848 366.153 508.805 366.295 508.767L367.161 512.787C366.887 512.882 366.494 512.986 365.982 513.099C365.48 513.213 364.865 513.279 364.136 513.298C362.848 513.336 361.688 513.142 360.656 512.716C359.623 512.28 358.804 511.608 358.198 510.699C357.602 509.79 357.308 508.653 357.317 507.29V485.955Z" fill="white" />
                <rect x="120" y="143" width="359" height="255" rx="17" fill="#AD7B41" stroke="white" stroke-width="6" />
                <path d="M258.051 248H247.949V187.394L220.172 215.172L213 208L253 168L293 208L285.828 215.172L258.051 187.394V248Z" fill="white" />
                <path d="M342.949 168H353.051V228.606L380.828 200.828L388 208L348 248L308 208L315.172 200.828L342.949 228.606V168Z" fill="white" />
                <path d="M156 331.051V320.949H216.606L188.828 293.172L196 286L236 326L196 366L188.828 358.828L216.606 331.051H156Z" fill="white" />
                <path d="M363 331.051V320.949H423.606L395.828 293.172L403 286L443 326L403 366L395.828 358.828L423.606 331.051H363Z" fill="white" />
                <rect x="248" y="240" width="10" height="86" fill="white" />
                <rect x="220" y="331" width="10" height="38" transform="rotate(-90 220 331)" fill="white" />
                <rect x="343" y="331" width="10" height="38" transform="rotate(-90 343 331)" fill="white" />
                <rect x="343" y="228" width="10" height="103" fill="white" />
            </svg>


            <WorkerLine
                model={model}
            />
            {components}
            {/*<NameComponent model={model} />*/}
        </>
    )
}                                                                                                                                      