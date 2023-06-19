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

export function Log(props: SquareProps) {
  const { model } = props;

  const viewState = model.viewState;
  const components: JSX.Element[] = [];

  model.children.forEach((child) => {
    components.push(getComponent(child.type, { model: child }));
  });

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
      >
        <circle id="Ellipse 1" cx="300" cy="300" r="300" fill="#3D84B8" />
        <path
          id="Log"
          d="M257.161 519V482.636H264.849V512.661H280.438V519H257.161ZM297.71 519.533C294.952 519.533 292.567 518.947 290.555 517.775C288.554 516.591 287.009 514.946 285.92 512.839C284.831 510.72 284.287 508.264 284.287 505.47C284.287 502.653 284.831 500.191 285.92 498.084C287.009 495.965 288.554 494.32 290.555 493.148C292.567 491.964 294.952 491.372 297.71 491.372C300.468 491.372 302.847 491.964 304.848 493.148C306.86 494.32 308.411 495.965 309.5 498.084C310.589 500.191 311.133 502.653 311.133 505.47C311.133 508.264 310.589 510.72 309.5 512.839C308.411 514.946 306.86 516.591 304.848 517.775C302.847 518.947 300.468 519.533 297.71 519.533ZM297.746 513.673C299 513.673 300.048 513.318 300.888 512.608C301.729 511.886 302.362 510.903 302.788 509.661C303.226 508.418 303.445 507.003 303.445 505.417C303.445 503.831 303.226 502.416 302.788 501.173C302.362 499.93 301.729 498.948 300.888 498.226C300.048 497.504 299 497.143 297.746 497.143C296.479 497.143 295.414 497.504 294.55 498.226C293.697 498.948 293.052 499.93 292.614 501.173C292.188 502.416 291.975 503.831 291.975 505.417C291.975 507.003 292.188 508.418 292.614 509.661C293.052 510.903 293.697 511.886 294.55 512.608C295.414 513.318 296.479 513.673 297.746 513.673ZM328.339 529.795C325.888 529.795 323.787 529.458 322.035 528.783C320.295 528.121 318.91 527.215 317.881 526.067C316.851 524.919 316.182 523.628 315.874 522.196L322.87 521.255C323.083 521.799 323.42 522.308 323.882 522.782C324.344 523.255 324.953 523.634 325.711 523.918C326.48 524.214 327.415 524.362 328.516 524.362C330.162 524.362 331.517 523.96 332.582 523.155C333.659 522.362 334.198 521.03 334.198 519.16V514.17H333.878C333.547 514.928 333.05 515.644 332.387 516.319C331.724 516.994 330.872 517.544 329.83 517.97C328.788 518.396 327.546 518.609 326.101 518.609C324.054 518.609 322.189 518.136 320.508 517.189C318.839 516.23 317.508 514.768 316.513 512.803C315.531 510.826 315.04 508.329 315.04 505.31C315.04 502.221 315.543 499.64 316.549 497.569C317.555 495.497 318.893 493.947 320.562 492.917C322.242 491.887 324.083 491.372 326.084 491.372C327.611 491.372 328.889 491.633 329.919 492.153C330.949 492.662 331.777 493.302 332.405 494.071C333.044 494.829 333.535 495.574 333.878 496.308H334.162V491.727H341.673V519.266C341.673 521.586 341.105 523.528 339.969 525.09C338.832 526.653 337.258 527.825 335.246 528.606C333.245 529.399 330.943 529.795 328.339 529.795ZM328.498 512.928C329.718 512.928 330.747 512.626 331.588 512.022C332.44 511.406 333.091 510.531 333.541 509.394C334.003 508.246 334.233 506.873 334.233 505.275C334.233 503.677 334.009 502.292 333.559 501.12C333.109 499.936 332.458 499.019 331.606 498.368C330.753 497.717 329.718 497.391 328.498 497.391C327.256 497.391 326.208 497.729 325.356 498.403C324.503 499.066 323.858 499.99 323.42 501.173C322.982 502.357 322.763 503.724 322.763 505.275C322.763 506.849 322.982 508.21 323.42 509.359C323.87 510.495 324.515 511.377 325.356 512.004C326.208 512.62 327.256 512.928 328.498 512.928Z"
          fill="white"
        />
        <g id="Group 1">
          <rect
            id="Rectangle 1"
            x="157"
            y="289"
            width="128"
            height="25"
            rx="12.5"
            fill="white"
          />
          <rect
            id="Rectangle 5"
            x="118"
            y="344"
            width="94"
            height="25"
            rx="12.5"
            fill="white"
          />
          <rect
            id="Rectangle 7"
            x="118"
            y="400"
            width="354"
            height="23"
            rx="11.5"
            fill="white"
          />
          <rect
            id="Rectangle 6"
            x="223"
            y="344"
            width="105"
            height="25"
            rx="12.5"
            fill="white"
          />
          <rect
            id="Rectangle 2"
            x="118"
            y="234"
            width="143"
            height="24"
            rx="12"
            fill="white"
          />
          <rect
            id="Rectangle 4"
            x="118"
            y="179"
            width="239"
            height="25"
            rx="12.5"
            fill="white"
          />
          <rect
            id="Rectangle 3"
            x="270"
            y="234"
            width="87"
            height="24"
            rx="12"
            fill="white"
          />
          <path
            id="Vector"
            d="M372.889 192H395.111V343.515L456.222 274.071L472 292L384 392L296 292L311.778 274.071L372.889 343.515V192Z"
            fill="white"
          />
          <rect
            id="Rectangle 8"
            x="373"
            y="177"
            width="22"
            height="34"
            rx="10"
            fill="white"
          />
          <rect
            id="Rectangle 9"
            x="463.447"
            y="266"
            width="23.4558"
            height="34"
            rx="10"
            transform="rotate(41.3146 463.447 266)"
            fill="white"
          />
          <rect
            id="Rectangle 10"
            x="288"
            y="282.812"
            width="23.9522"
            height="34"
            rx="10"
            transform="rotate(-41.31 288 282.812)"
            fill="white"
          />
        </g>
      </svg>

      <WorkerLine model={model} />
      {components}
    </>
  );
}
