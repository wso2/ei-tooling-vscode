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
import { DataServiceCallMediatorProperty } from "../PropertyPanels/index";
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

export function DataServiceCall(props: SquareProps) {
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
        <circle cx="300" cy="300" r="300" fill="#008234" />
        <path
          d="M254.841 499H244.528V469.909H254.926C257.852 469.909 260.371 470.491 262.483 471.656C264.595 472.812 266.219 474.473 267.355 476.642C268.501 478.811 269.074 481.405 269.074 484.426C269.074 487.456 268.501 490.061 267.355 492.239C266.219 494.417 264.585 496.088 262.455 497.253C260.333 498.418 257.795 499 254.841 499ZM250.679 493.73H254.585C256.403 493.73 257.933 493.408 259.173 492.764C260.423 492.111 261.361 491.102 261.986 489.739C262.62 488.366 262.938 486.595 262.938 484.426C262.938 482.277 262.62 480.52 261.986 479.156C261.361 477.793 260.428 476.789 259.188 476.145C257.947 475.501 256.418 475.179 254.599 475.179H250.679V493.73ZM283.942 499H273.63V469.909H284.028C286.954 469.909 289.473 470.491 291.585 471.656C293.696 472.812 295.32 474.473 296.457 476.642C297.603 478.811 298.175 481.405 298.175 484.426C298.175 487.456 297.603 490.061 296.457 492.239C295.32 494.417 293.687 496.088 291.556 497.253C289.435 498.418 286.897 499 283.942 499ZM279.781 493.73H283.687C285.505 493.73 287.034 493.408 288.275 492.764C289.525 492.111 290.462 491.102 291.087 489.739C291.722 488.366 292.039 486.595 292.039 484.426C292.039 482.277 291.722 480.52 291.087 479.156C290.462 477.793 289.53 476.789 288.289 476.145C287.049 475.501 285.519 475.179 283.701 475.179H279.781V493.73ZM318.513 478.276C318.399 477.13 317.911 476.24 317.05 475.605C316.188 474.971 315.018 474.653 313.541 474.653C312.537 474.653 311.69 474.795 310.999 475.08C310.307 475.354 309.777 475.738 309.408 476.23C309.048 476.723 308.868 477.281 308.868 477.906C308.849 478.427 308.958 478.882 309.195 479.27C309.441 479.658 309.777 479.994 310.203 480.278C310.629 480.553 311.122 480.795 311.68 481.003C312.239 481.202 312.836 481.372 313.47 481.514L316.084 482.139C317.353 482.423 318.518 482.802 319.578 483.276C320.639 483.749 321.557 484.331 322.334 485.023C323.11 485.714 323.712 486.528 324.138 487.466C324.573 488.403 324.796 489.478 324.805 490.69C324.796 492.471 324.341 494.014 323.442 495.321C322.552 496.618 321.264 497.627 319.578 498.347C317.902 499.057 315.88 499.412 313.513 499.412C311.164 499.412 309.119 499.052 307.376 498.332C305.643 497.613 304.289 496.547 303.314 495.136C302.348 493.716 301.841 491.959 301.794 489.866H307.746C307.812 490.842 308.091 491.656 308.584 492.31C309.086 492.954 309.753 493.441 310.587 493.773C311.429 494.095 312.381 494.256 313.442 494.256C314.483 494.256 315.388 494.104 316.155 493.801C316.931 493.498 317.533 493.077 317.959 492.537C318.385 491.997 318.598 491.377 318.598 490.676C318.598 490.023 318.404 489.473 318.016 489.028C317.637 488.583 317.078 488.205 316.339 487.892C315.61 487.58 314.715 487.295 313.655 487.04L310.487 486.244C308.035 485.648 306.098 484.715 304.678 483.446C303.257 482.177 302.552 480.468 302.561 478.318C302.552 476.557 303.02 475.018 303.967 473.702C304.924 472.385 306.235 471.358 307.902 470.619C309.569 469.881 311.463 469.511 313.584 469.511C315.743 469.511 317.627 469.881 319.237 470.619C320.857 471.358 322.116 472.385 323.016 473.702C323.915 475.018 324.379 476.543 324.408 478.276H318.513Z"
          fill="white"
        />
        <rect
          x="118"
          y="151"
          width="365"
          height="234"
          rx="37"
          fill="#008234"
          stroke="white"
          stroke-width="6"
        />
        <path
          d="M174 345.231H210.667V317.026H174M235.111 345.231H271.778V279.419H235.111M296.222 345.231H332.889V232.41H296.222M357.333 345.231H394V176H357.333V345.231Z"
          fill="white"
        />
        <circle cx="369" cy="321" r="45" fill="#008234" />
        <path
          d="M354.056 318.286C358.056 325.656 364.5 331.698 372.361 335.448L378.472 329.719C379.25 328.99 380.333 328.781 381.306 329.068C384.417 330.031 387.75 330.552 391.222 330.552C391.959 330.552 392.665 330.826 393.186 331.315C393.707 331.803 394 332.466 394 333.156V342.271C394 342.962 393.707 343.624 393.186 344.112C392.665 344.601 391.959 344.875 391.222 344.875C378.698 344.875 366.687 340.211 357.831 331.908C348.975 323.606 344 312.346 344 300.604C344 299.913 344.293 299.251 344.814 298.763C345.335 298.274 346.041 298 346.778 298H356.5C357.237 298 357.943 298.274 358.464 298.763C358.985 299.251 359.278 299.913 359.278 300.604C359.278 303.859 359.833 306.984 360.861 309.901C361.167 310.813 360.944 311.828 360.167 312.557L354.056 318.286Z"
          fill="white"
        />
      </svg>

      <WorkerLine model={model} />
      {components}
      {isClicked && (
        <DataServiceCallMediatorProperty modalOpen={open} modalClose={handleCancelClick} />
      )}
    </>
  );
}
