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
import { XSLTMediatorProperty } from "../PropertyPanels/index";
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

export function XSLT(props: SquareProps) {
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
        <path
          d="M258.295 453.909L264.162 463.824H264.389L270.284 453.909H277.23L268.352 468.455L277.429 483H270.355L264.389 473.071H264.162L258.196 483H251.151L260.256 468.455L251.321 453.909H258.295ZM296.903 462.276C296.79 461.13 296.302 460.24 295.44 459.605C294.579 458.971 293.409 458.653 291.932 458.653C290.928 458.653 290.08 458.795 289.389 459.08C288.698 459.354 288.168 459.738 287.798 460.23C287.438 460.723 287.259 461.281 287.259 461.906C287.24 462.427 287.348 462.882 287.585 463.27C287.831 463.658 288.168 463.994 288.594 464.278C289.02 464.553 289.512 464.795 290.071 465.003C290.63 465.202 291.226 465.372 291.861 465.514L294.474 466.139C295.743 466.423 296.908 466.802 297.969 467.276C299.029 467.749 299.948 468.331 300.724 469.023C301.501 469.714 302.102 470.528 302.528 471.466C302.964 472.403 303.187 473.478 303.196 474.69C303.187 476.471 302.732 478.014 301.832 479.321C300.942 480.618 299.654 481.627 297.969 482.347C296.293 483.057 294.271 483.412 291.903 483.412C289.555 483.412 287.509 483.052 285.767 482.332C284.034 481.613 282.68 480.547 281.705 479.136C280.739 477.716 280.232 475.959 280.185 473.866H286.136C286.203 474.842 286.482 475.656 286.974 476.31C287.476 476.954 288.144 477.441 288.977 477.773C289.82 478.095 290.772 478.256 291.832 478.256C292.874 478.256 293.778 478.104 294.545 477.801C295.322 477.498 295.923 477.077 296.349 476.537C296.776 475.997 296.989 475.377 296.989 474.676C296.989 474.023 296.795 473.473 296.406 473.028C296.027 472.583 295.469 472.205 294.73 471.892C294.001 471.58 293.106 471.295 292.045 471.04L288.878 470.244C286.425 469.648 284.489 468.715 283.068 467.446C281.648 466.177 280.942 464.468 280.952 462.318C280.942 460.557 281.411 459.018 282.358 457.702C283.314 456.385 284.626 455.358 286.293 454.619C287.959 453.881 289.853 453.511 291.974 453.511C294.134 453.511 296.018 453.881 297.628 454.619C299.247 455.358 300.507 456.385 301.406 457.702C302.306 459.018 302.77 460.543 302.798 462.276H296.903ZM307.333 483V453.909H313.484V477.929H325.955V483H307.333ZM325.288 458.98V453.909H349.18V458.98H340.273V483H334.194V458.98H325.288Z"
          fill="white"
        />
        <path
          d="M322.5 187H232.5C220.012 187 210 197.125 210 209.5V389.5C210 401.988 220.012 412 232.5 412H367.5C379.988 412 390 401.988 390 389.5V254.5L322.5 187ZM367.5 389.5H232.5V209.5H311.25V265.75H367.5V389.5ZM272.325 340.562L295.838 364.075L281.438 378.25L243.75 340.562L281.438 302.875L295.838 317.05L272.325 340.562ZM356.25 340.562L318.562 378.25L304.275 364.075L327.788 340.562L304.275 317.05L318.562 302.875L356.25 340.562Z"
          fill="white"
        />
      </svg>

      <WorkerLine model={model} />
      {components}
      {isClicked && (
        <XSLTMediatorProperty modalOpen={open} modalClose={handleCancelClick} />
      )}
    </>
  );
}
