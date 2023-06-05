
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

export function Call(props: SquareProps) {
    const { model } = props;

    const viewState = model.viewState;

    const components: JSX.Element[] = [];

    model.children.forEach(child => {
        components.push(getComponent(child.tag, { model: child }));
    })

    return (
        <>

            <svg x={viewState.bBox.x} y={viewState.bBox.y} width={viewState.bBox.w} height={viewState.bBox.h}  viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="800" height="600" fill="#1E1E1E" />
                <rect width="800" height="600" fill="#C0C0C0" />
                <path d="M10 10H430V590H10V10Z" fill="#3D84B8" />
                <path d="M198.245 485.367H190.468C190.326 484.361 190.036 483.467 189.598 482.686C189.16 481.893 188.598 481.218 187.911 480.662C187.225 480.106 186.432 479.679 185.532 479.384C184.644 479.088 183.679 478.94 182.638 478.94C180.756 478.94 179.116 479.407 177.719 480.342C176.323 481.266 175.24 482.615 174.47 484.391C173.701 486.154 173.316 488.297 173.316 490.818C173.316 493.411 173.701 495.589 174.47 497.352C175.251 499.116 176.34 500.448 177.737 501.347C179.134 502.247 180.75 502.697 182.585 502.697C183.614 502.697 184.567 502.561 185.443 502.288C186.331 502.016 187.118 501.62 187.805 501.099C188.491 500.566 189.059 499.921 189.509 499.163C189.971 498.406 190.29 497.542 190.468 496.571L198.245 496.607C198.044 498.276 197.541 499.885 196.736 501.436C195.943 502.975 194.871 504.354 193.522 505.573C192.184 506.781 190.586 507.739 188.728 508.45C186.881 509.148 184.792 509.497 182.46 509.497C179.217 509.497 176.317 508.763 173.76 507.295C171.215 505.828 169.203 503.703 167.723 500.921C166.255 498.139 165.521 494.772 165.521 490.818C165.521 486.853 166.267 483.479 167.759 480.697C169.25 477.916 171.274 475.797 173.831 474.341C176.388 472.873 179.264 472.139 182.46 472.139C184.567 472.139 186.52 472.435 188.32 473.027C190.131 473.619 191.735 474.483 193.131 475.619C194.528 476.744 195.665 478.123 196.54 479.756C197.428 481.39 197.996 483.26 198.245 485.367ZM211.393 509.515C209.653 509.515 208.102 509.213 206.741 508.609C205.38 507.994 204.303 507.088 203.51 505.893C202.728 504.685 202.338 503.182 202.338 501.383C202.338 499.868 202.616 498.595 203.172 497.565C203.729 496.536 204.486 495.707 205.445 495.08C206.404 494.452 207.493 493.979 208.712 493.659C209.943 493.339 211.233 493.115 212.583 492.984C214.169 492.819 215.447 492.665 216.418 492.523C217.389 492.369 218.093 492.144 218.531 491.848C218.969 491.552 219.188 491.114 219.188 490.534V490.428C219.188 489.303 218.833 488.433 218.123 487.817C217.424 487.202 216.43 486.894 215.14 486.894C213.778 486.894 212.695 487.196 211.89 487.8C211.085 488.392 210.553 489.137 210.292 490.037L203.297 489.469C203.652 487.812 204.35 486.379 205.392 485.172C206.433 483.953 207.777 483.018 209.422 482.366C211.079 481.704 212.997 481.372 215.175 481.372C216.69 481.372 218.14 481.55 219.525 481.905C220.922 482.26 222.159 482.81 223.236 483.556C224.325 484.302 225.183 485.261 225.811 486.433C226.438 487.593 226.752 488.983 226.752 490.605V509H219.578V505.218H219.365C218.927 506.07 218.342 506.822 217.608 507.473C216.874 508.112 215.992 508.615 214.962 508.982C213.932 509.337 212.743 509.515 211.393 509.515ZM213.559 504.295C214.672 504.295 215.654 504.076 216.507 503.638C217.359 503.188 218.028 502.584 218.513 501.827C218.998 501.069 219.241 500.211 219.241 499.252V496.358C219.004 496.512 218.679 496.654 218.265 496.784C217.862 496.902 217.406 497.015 216.897 497.121C216.388 497.216 215.879 497.305 215.37 497.388C214.861 497.459 214.4 497.524 213.985 497.583C213.098 497.713 212.322 497.92 211.659 498.205C210.997 498.489 210.482 498.873 210.115 499.359C209.748 499.832 209.564 500.424 209.564 501.134C209.564 502.164 209.937 502.951 210.683 503.496C211.44 504.028 212.399 504.295 213.559 504.295ZM240.184 472.636V509H232.62V472.636H240.184ZM253.807 472.636V509H246.243V472.636H253.807Z" fill="white" />
                <g filter="url(#filter0_d_57_24)">
                    <rect x="29" y="82" width="381" height="257" rx="40" fill="#3D84B8" />
                    <rect x="32" y="85" width="375" height="251" rx="37" stroke="white" stroke-width="6" />
                </g>
                <path d="M191.313 146.165H178.687V122.207L167.639 131.524L160 125.082L185 104L210 125.082L202.361 131.524L191.313 122.207V146.165Z" fill="white" />
                <rect x="178.75" y="146.165" width="12.5" height="85.8353" fill="white" />
                <path d="M118.424 292.313V279.687H138.637L130.776 268.639L136.212 261L154 286L136.212 311L130.776 303.361L138.637 292.313H118.424Z" fill="white" />
                <rect x="118.424" y="279.75" width="12.5" height="72.4235" transform="rotate(90 118.424 279.75)" fill="white" />
                <path d="M334.424 292.313V279.687H354.637L346.776 268.639L352.212 261L370 286L352.212 311L346.776 303.361L354.637 292.313H334.424Z" fill="white" />
                <rect x="334.424" y="279.75" width="12.5" height="72.4235" transform="rotate(90 334.424 279.75)" fill="white" />
                <path d="M228.687 189.835H241.313V213.793L252.361 204.476L260 210.918L235 232L210 210.918L217.639 204.476L228.687 213.793V189.835Z" fill="white" />
                <rect x="241.25" y="189.835" width="12.5" height="85.8353" transform="rotate(-180 241.25 189.835)" fill="white" />
                <rect x="480" y="10" width="310" height="580" fill="#A9A9A9" />
                <path d="M468 299.5L439.5 335.44V263.56L468 299.5Z" fill="#71797E" />
                <circle cx="185" cy="286" r="15" fill="white" />
                <circle cx="235" cy="286" r="15" fill="white" />
                <defs>
                    <filter id="filter0_d_57_24" x="25" y="82" width="389" height="265" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_57_24" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_57_24" result="shape" />
                    </filter>
                </defs>
            </svg>


            <WorkerLine
                model={model}
            />
            {components}
            {/*<NameComponent model={model} />*/}
        </>
    )
}                                                                                                                                      