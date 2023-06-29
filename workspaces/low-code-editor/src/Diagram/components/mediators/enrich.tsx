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

import React, { useState } from "react";
import { Circle } from "@wso2-ei/low-code-diagram";
import { getComponent } from "../../util";
import { WorkerLine } from "../worker-line";
import { EnrichMediatorProperty } from "../PropertyPanels/index";
import {
  DiagramEditorLangClientInterface,
  GetCompletionResponse,
} from "@wso2-ei/low-code-editor-commons";

interface SquareProps {
  model: Circle;
  getDiagramEditorLangClient?: () => Promise<DiagramEditorLangClientInterface>;
  textDocumentUrl: string;
  textDocumentFsPath: string;
  items: GetCompletionResponse[];
  previousComponentStartPosition: number;
}
export function Enrich(props: SquareProps) {
  const {
    model,
    getDiagramEditorLangClient,
    textDocumentUrl,
    textDocumentFsPath,
    items,
    previousComponentStartPosition,
  } = props;
  const [open, setOpen] = React.useState(false);

  const viewState = model.viewState;
  model.tag;
  const components: JSX.Element[] = [];

  model.children.forEach((child: any) => {
    components.push(getComponent(child.type, { model: child }));
  });

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleButtonClick = async () => {
    setOpen(true);
    setIsClicked(true);
  };

  const handleCancelClick = (value: boolean) => {
    setOpen(value);
  };

  return (
    <>
      <svg
        x={viewState.bBox.x}
        y={viewState.bBox.y}
        width={viewState.bBox.r * 2}
        height={viewState.bBox.r * 2}
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => handleButtonClick()}
      >
        <circle cx="300" cy="300" r="300" fill="#644A9B" />
        <g filter="url(#filter0_d_96_401)">
          <rect
            x="125"
            y="196"
            width="350"
            height="208"
            rx="20"
            fill="#644A9B"
          />
          <rect
            x="127"
            y="198"
            width="346"
            height="204"
            rx="18"
            stroke="white"
            stroke-width="4"
          />
        </g>
        <path
          d="M252.26 293.912L228.239 318.579V303.779H209.022V284.046H228.239V269.246L252.26 293.912ZM185 328.446V259.379C185 256.762 186.012 254.253 187.814 252.402C189.616 250.552 192.06 249.512 194.609 249.512H261.869C264.417 249.512 266.861 250.552 268.663 252.402C270.465 254.253 271.478 256.762 271.478 259.379V328.446C271.478 331.062 270.465 333.572 268.663 335.422C266.861 337.273 264.417 338.312 261.869 338.312H194.609C192.06 338.312 189.616 337.273 187.814 335.422C186.012 333.572 185 331.062 185 328.446ZM194.609 328.446H261.869V259.379H194.609V328.446Z"
          fill="white"
        />
        <path
          d="M406.319 220H294.218C285.33 220 278.204 227.318 278.204 236.444V351.556C278.204 355.917 279.891 360.1 282.894 363.184C285.898 366.267 289.971 368 294.218 368H406.319C410.566 368 414.64 366.267 417.643 363.184C420.646 360.1 422.333 355.917 422.333 351.556V236.444C422.333 227.318 415.127 220 406.319 220ZM406.319 236.444V351.556H294.218V236.444H406.319Z"
          fill="white"
        />
        <path
          d="M224.161 531V494.636H248.663V500.975H231.849V509.64H247.403V515.979H231.849V524.661H248.734V531H224.161ZM262.198 515.233V531H254.634V503.727H261.843V508.539H262.162C262.766 506.953 263.778 505.698 265.198 504.775C266.619 503.84 268.341 503.372 270.365 503.372C272.259 503.372 273.91 503.786 275.319 504.615C276.728 505.444 277.823 506.627 278.604 508.166C279.385 509.693 279.776 511.516 279.776 513.635V531H272.212V514.984C272.224 513.315 271.798 512.013 270.933 511.078C270.069 510.131 268.88 509.658 267.365 509.658C266.347 509.658 265.447 509.877 264.666 510.315C263.896 510.753 263.293 511.392 262.855 512.232C262.428 513.061 262.209 514.061 262.198 515.233ZM285.737 531V503.727H293.07V508.486H293.354C293.852 506.793 294.686 505.515 295.858 504.651C297.03 503.775 298.379 503.337 299.906 503.337C300.285 503.337 300.693 503.36 301.131 503.408C301.569 503.455 301.954 503.52 302.286 503.603V510.315C301.93 510.208 301.439 510.113 300.812 510.031C300.184 509.948 299.61 509.906 299.089 509.906C297.977 509.906 296.982 510.149 296.107 510.634C295.242 511.108 294.556 511.771 294.047 512.623C293.55 513.475 293.301 514.458 293.301 515.57V531H285.737ZM306.196 531V503.727H313.76V531H306.196ZM309.996 500.212C308.871 500.212 307.907 499.839 307.102 499.093C306.309 498.335 305.912 497.43 305.912 496.376C305.912 495.335 306.309 494.441 307.102 493.695C307.907 492.938 308.871 492.559 309.996 492.559C311.12 492.559 312.079 492.938 312.872 493.695C313.677 494.441 314.08 495.335 314.08 496.376C314.08 497.43 313.677 498.335 312.872 499.093C312.079 499.839 311.12 500.212 309.996 500.212ZM332.142 531.533C329.348 531.533 326.945 530.941 324.933 529.757C322.932 528.562 321.394 526.904 320.316 524.786C319.251 522.667 318.718 520.228 318.718 517.47C318.718 514.677 319.257 512.226 320.334 510.119C321.423 508 322.968 506.349 324.968 505.165C326.969 503.97 329.348 503.372 332.106 503.372C334.485 503.372 336.569 503.804 338.356 504.668C340.144 505.532 341.558 506.746 342.6 508.308C343.641 509.871 344.216 511.705 344.322 513.812H337.184C336.983 512.451 336.45 511.356 335.586 510.528C334.734 509.687 333.615 509.267 332.23 509.267C331.059 509.267 330.035 509.587 329.159 510.226C328.295 510.853 327.62 511.771 327.135 512.978C326.649 514.185 326.407 515.647 326.407 517.364C326.407 519.104 326.643 520.583 327.117 521.803C327.602 523.022 328.283 523.951 329.159 524.59C330.035 525.229 331.059 525.549 332.23 525.549C333.095 525.549 333.87 525.371 334.556 525.016C335.255 524.661 335.829 524.146 336.279 523.472C336.74 522.785 337.042 521.962 337.184 521.004H344.322C344.204 523.087 343.636 524.922 342.618 526.508C341.611 528.082 340.221 529.313 338.445 530.201C336.669 531.089 334.568 531.533 332.142 531.533ZM356.729 515.233V531H349.165V494.636H356.516V508.539H356.835C357.451 506.929 358.445 505.669 359.818 504.757C361.191 503.834 362.914 503.372 364.985 503.372C366.879 503.372 368.53 503.786 369.939 504.615C371.36 505.432 372.46 506.61 373.242 508.148C374.035 509.675 374.425 511.504 374.414 513.635V531H366.85V514.984C366.861 513.304 366.435 511.996 365.571 511.06C364.719 510.125 363.523 509.658 361.985 509.658C360.955 509.658 360.043 509.877 359.25 510.315C358.469 510.753 357.853 511.392 357.404 512.232C356.966 513.061 356.741 514.061 356.729 515.233Z"
          fill="white"
        />
        <defs>
          <filter
            id="filter0_d_96_401"
            x="121"
            y="196"
            width="358"
            height="216"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_96_401"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_96_401"
              result="shape"
            />
          </filter>
        </defs>
      </svg>

      <WorkerLine model={model} />
      {components}
      {isClicked && (
        <EnrichMediatorProperty modalOpen={open} modalClose={handleCancelClick} />
      )}
    </>
  );
}
