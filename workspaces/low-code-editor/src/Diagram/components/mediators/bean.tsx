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
import { BeanMediatorProperty } from "../PropertyPanels/index";
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

export function Bean(props: SquareProps) {
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
        <circle cx="300" cy="300" r="300" fill="#B97059" />
        <path
          d="M207.176 495.909H213.256V516.193C213.256 518.068 212.834 519.697 211.991 521.08C211.158 522.462 209.998 523.527 208.511 524.276C207.025 525.024 205.296 525.398 203.327 525.398C201.575 525.398 199.984 525.09 198.554 524.474C197.134 523.849 196.007 522.902 195.173 521.634C194.34 520.355 193.928 518.75 193.938 516.818H200.06C200.079 517.585 200.235 518.243 200.528 518.793C200.831 519.332 201.243 519.749 201.764 520.043C202.295 520.327 202.92 520.469 203.639 520.469C204.397 520.469 205.036 520.308 205.557 519.986C206.087 519.654 206.49 519.171 206.764 518.537C207.039 517.902 207.176 517.121 207.176 516.193V495.909ZM224.449 525.412C223.057 525.412 221.816 525.17 220.727 524.688C219.638 524.195 218.777 523.471 218.142 522.514C217.517 521.548 217.205 520.346 217.205 518.906C217.205 517.694 217.427 516.676 217.872 515.852C218.317 515.028 218.923 514.366 219.69 513.864C220.457 513.362 221.329 512.983 222.304 512.727C223.289 512.472 224.321 512.292 225.401 512.188C226.67 512.055 227.692 511.932 228.469 511.818C229.245 511.695 229.809 511.515 230.159 511.278C230.509 511.042 230.685 510.691 230.685 510.227V510.142C230.685 509.242 230.401 508.546 229.832 508.054C229.274 507.562 228.478 507.315 227.446 507.315C226.357 507.315 225.491 507.557 224.847 508.04C224.203 508.513 223.777 509.11 223.568 509.83L217.972 509.375C218.256 508.049 218.814 506.903 219.648 505.938C220.481 504.962 221.556 504.214 222.872 503.693C224.198 503.163 225.732 502.898 227.474 502.898C228.687 502.898 229.847 503.04 230.955 503.324C232.072 503.608 233.062 504.048 233.923 504.645C234.795 505.241 235.481 506.009 235.983 506.946C236.485 507.874 236.736 508.987 236.736 510.284V525H230.997V521.974H230.827C230.476 522.656 230.008 523.258 229.42 523.778C228.833 524.29 228.128 524.692 227.304 524.986C226.48 525.27 225.528 525.412 224.449 525.412ZM226.182 521.236C227.072 521.236 227.858 521.061 228.54 520.71C229.222 520.35 229.757 519.867 230.145 519.261C230.533 518.655 230.727 517.969 230.727 517.202V514.886C230.538 515.009 230.277 515.123 229.946 515.227C229.624 515.322 229.259 515.412 228.852 515.497C228.445 515.573 228.038 515.644 227.631 515.71C227.223 515.767 226.854 515.819 226.523 515.866C225.813 515.971 225.192 516.136 224.662 516.364C224.132 516.591 223.72 516.899 223.426 517.287C223.133 517.666 222.986 518.139 222.986 518.707C222.986 519.531 223.284 520.161 223.881 520.597C224.487 521.023 225.254 521.236 226.182 521.236ZM260.99 503.182L253.362 525H246.544L238.916 503.182H245.308L249.839 518.793H250.067L254.584 503.182H260.99ZM269.722 525.412C268.33 525.412 267.09 525.17 266.001 524.688C264.912 524.195 264.05 523.471 263.415 522.514C262.79 521.548 262.478 520.346 262.478 518.906C262.478 517.694 262.701 516.676 263.146 515.852C263.591 515.028 264.197 514.366 264.964 513.864C265.731 513.362 266.602 512.983 267.577 512.727C268.562 512.472 269.594 512.292 270.674 512.188C271.943 512.055 272.966 511.932 273.742 511.818C274.519 511.695 275.082 511.515 275.433 511.278C275.783 511.042 275.958 510.691 275.958 510.227V510.142C275.958 509.242 275.674 508.546 275.106 508.054C274.547 507.562 273.752 507.315 272.719 507.315C271.63 507.315 270.764 507.557 270.12 508.04C269.476 508.513 269.05 509.11 268.842 509.83L263.245 509.375C263.529 508.049 264.088 506.903 264.921 505.938C265.754 504.962 266.829 504.214 268.146 503.693C269.471 503.163 271.005 502.898 272.748 502.898C273.96 502.898 275.12 503.04 276.228 503.324C277.345 503.608 278.335 504.048 279.197 504.645C280.068 505.241 280.754 506.009 281.256 506.946C281.758 507.874 282.009 508.987 282.009 510.284V525H276.271V521.974H276.1C275.75 522.656 275.281 523.258 274.694 523.778C274.107 524.29 273.401 524.692 272.577 524.986C271.754 525.27 270.802 525.412 269.722 525.412ZM271.455 521.236C272.345 521.236 273.131 521.061 273.813 520.71C274.495 520.35 275.03 519.867 275.418 519.261C275.807 518.655 276.001 517.969 276.001 517.202V514.886C275.811 515.009 275.551 515.123 275.219 515.227C274.897 515.322 274.533 515.412 274.126 515.497C273.719 515.573 273.311 515.644 272.904 515.71C272.497 515.767 272.128 515.819 271.796 515.866C271.086 515.971 270.466 516.136 269.935 516.364C269.405 516.591 268.993 516.899 268.7 517.287C268.406 517.666 268.259 518.139 268.259 518.707C268.259 519.531 268.558 520.161 269.154 520.597C269.76 521.023 270.527 521.236 271.455 521.236ZM286.817 525V495.909H298.465C300.605 495.909 302.39 496.226 303.82 496.861C305.25 497.495 306.325 498.376 307.045 499.503C307.764 500.62 308.124 501.908 308.124 503.366C308.124 504.503 307.897 505.502 307.442 506.364C306.988 507.216 306.363 507.917 305.567 508.466C304.781 509.006 303.882 509.389 302.869 509.616V509.901C303.977 509.948 305.013 510.26 305.979 510.838C306.955 511.416 307.746 512.225 308.352 513.267C308.958 514.299 309.261 515.53 309.261 516.96C309.261 518.504 308.877 519.882 308.11 521.094C307.353 522.296 306.23 523.248 304.744 523.949C303.257 524.65 301.424 525 299.246 525H286.817ZM292.968 519.972H297.982C299.696 519.972 300.946 519.645 301.732 518.991C302.518 518.329 302.911 517.448 302.911 516.349C302.911 515.545 302.717 514.834 302.329 514.219C301.941 513.603 301.387 513.12 300.667 512.77C299.957 512.42 299.109 512.244 298.124 512.244H292.968V519.972ZM292.968 508.082H297.528C298.371 508.082 299.119 507.936 299.772 507.642C300.435 507.339 300.956 506.913 301.335 506.364C301.723 505.814 301.917 505.156 301.917 504.389C301.917 503.338 301.543 502.491 300.795 501.847C300.056 501.203 299.005 500.881 297.641 500.881H292.968V508.082ZM323.092 525.426C320.848 525.426 318.916 524.972 317.297 524.062C315.687 523.144 314.446 521.847 313.575 520.17C312.704 518.485 312.268 516.491 312.268 514.19C312.268 511.946 312.704 509.976 313.575 508.281C314.446 506.586 315.673 505.265 317.254 504.318C318.845 503.371 320.711 502.898 322.851 502.898C324.29 502.898 325.63 503.13 326.871 503.594C328.121 504.048 329.21 504.735 330.138 505.653C331.075 506.572 331.804 507.727 332.325 509.119C332.846 510.502 333.107 512.121 333.107 513.977V515.639H314.683V511.889H327.411C327.411 511.018 327.221 510.246 326.842 509.574C326.464 508.902 325.938 508.376 325.266 507.997C324.603 507.609 323.831 507.415 322.95 507.415C322.032 507.415 321.217 507.628 320.507 508.054C319.806 508.471 319.257 509.034 318.859 509.744C318.462 510.445 318.258 511.226 318.249 512.088V515.653C318.249 516.733 318.447 517.666 318.845 518.452C319.252 519.238 319.825 519.844 320.564 520.27C321.303 520.696 322.179 520.909 323.192 520.909C323.864 520.909 324.48 520.814 325.038 520.625C325.597 520.436 326.075 520.152 326.473 519.773C326.871 519.394 327.174 518.93 327.382 518.381L332.979 518.75C332.695 520.095 332.112 521.269 331.232 522.273C330.36 523.267 329.233 524.044 327.851 524.602C326.478 525.152 324.892 525.426 323.092 525.426ZM343.277 525.412C341.885 525.412 340.644 525.17 339.555 524.688C338.466 524.195 337.605 523.471 336.97 522.514C336.345 521.548 336.033 520.346 336.033 518.906C336.033 517.694 336.255 516.676 336.7 515.852C337.145 515.028 337.751 514.366 338.518 513.864C339.286 513.362 340.157 512.983 341.132 512.727C342.117 512.472 343.149 512.292 344.229 512.188C345.498 512.055 346.52 511.932 347.297 511.818C348.073 511.695 348.637 511.515 348.987 511.278C349.338 511.042 349.513 510.691 349.513 510.227V510.142C349.513 509.242 349.229 508.546 348.661 508.054C348.102 507.562 347.306 507.315 346.274 507.315C345.185 507.315 344.319 507.557 343.675 508.04C343.031 508.513 342.605 509.11 342.396 509.83L336.8 509.375C337.084 508.049 337.643 506.903 338.476 505.938C339.309 504.962 340.384 504.214 341.7 503.693C343.026 503.163 344.56 502.898 346.303 502.898C347.515 502.898 348.675 503.04 349.783 503.324C350.9 503.608 351.89 504.048 352.751 504.645C353.623 505.241 354.309 506.009 354.811 506.946C355.313 507.874 355.564 508.987 355.564 510.284V525H349.825V521.974H349.655C349.304 522.656 348.836 523.258 348.249 523.778C347.661 524.29 346.956 524.692 346.132 524.986C345.308 525.27 344.357 525.412 343.277 525.412ZM345.01 521.236C345.9 521.236 346.686 521.061 347.368 520.71C348.05 520.35 348.585 519.867 348.973 519.261C349.361 518.655 349.555 517.969 349.555 517.202V514.886C349.366 515.009 349.106 515.123 348.774 515.227C348.452 515.322 348.088 515.412 347.68 515.497C347.273 515.573 346.866 515.644 346.459 515.71C346.052 515.767 345.682 515.819 345.351 515.866C344.641 515.971 344.02 516.136 343.49 516.364C342.96 516.591 342.548 516.899 342.254 517.287C341.961 517.666 341.814 518.139 341.814 518.707C341.814 519.531 342.112 520.161 342.709 520.597C343.315 521.023 344.082 521.236 345.01 521.236ZM366.31 512.386V525H360.259V503.182H366.026V507.031H366.281C366.764 505.762 367.574 504.759 368.71 504.02C369.847 503.272 371.224 502.898 372.844 502.898C374.359 502.898 375.68 503.229 376.807 503.892C377.934 504.555 378.81 505.502 379.435 506.733C380.06 507.955 380.372 509.413 380.372 511.108V525H374.321V512.188C374.33 510.852 373.99 509.811 373.298 509.062C372.607 508.305 371.655 507.926 370.443 507.926C369.629 507.926 368.909 508.101 368.284 508.452C367.669 508.802 367.186 509.313 366.835 509.986C366.494 510.649 366.319 511.449 366.31 512.386ZM403.295 509.403L397.755 509.744C397.66 509.271 397.457 508.845 397.144 508.466C396.832 508.078 396.42 507.77 395.908 507.543C395.406 507.306 394.805 507.188 394.104 507.188C393.167 507.188 392.376 507.386 391.732 507.784C391.088 508.172 390.766 508.693 390.766 509.347C390.766 509.867 390.975 510.308 391.391 510.668C391.808 511.027 392.523 511.316 393.536 511.534L397.485 512.33C399.606 512.765 401.188 513.466 402.229 514.432C403.271 515.398 403.792 516.667 403.792 518.239C403.792 519.669 403.371 520.923 402.528 522.003C401.694 523.082 400.549 523.925 399.09 524.531C397.641 525.128 395.97 525.426 394.076 525.426C391.188 525.426 388.887 524.825 387.173 523.622C385.468 522.41 384.469 520.762 384.175 518.679L390.127 518.366C390.307 519.247 390.743 519.92 391.434 520.384C392.125 520.838 393.011 521.065 394.09 521.065C395.151 521.065 396.003 520.862 396.647 520.455C397.3 520.038 397.632 519.503 397.641 518.849C397.632 518.3 397.4 517.85 396.945 517.5C396.491 517.14 395.79 516.866 394.843 516.676L391.065 515.923C388.934 515.497 387.348 514.759 386.306 513.707C385.274 512.656 384.758 511.316 384.758 509.688C384.758 508.286 385.137 507.079 385.894 506.065C386.661 505.052 387.736 504.271 389.119 503.722C390.511 503.172 392.139 502.898 394.005 502.898C396.761 502.898 398.929 503.48 400.511 504.645C402.102 505.81 403.03 507.396 403.295 509.403Z"
          fill="white"
        />
        <path d="M314 142L494.999 169H133.001L314 142Z" fill="white" />
        <path d="M314 435L133.001 408L494.999 408L314 435Z" fill="white" />
        <rect x="314" y="109" width="209" height="360" fill="#B97059" />
        <rect
          x="269.5"
          y="170.5"
          width="178"
          height="236"
          rx="8.5"
          fill="#B97059"
          stroke="white"
          stroke-width="3"
        />
        <path
          d="M376.453 239.224C376.453 239.224 320.293 252.31 347.223 281.161C355.188 289.656 345.171 297.309 345.171 297.309C345.171 297.309 365.286 287.743 355.927 275.498C347.223 264.249 340.655 258.662 376.453 239.224ZM339.752 248.407C373.004 223.918 355.927 208 355.927 208C362.823 233.254 331.623 240.907 320.375 256.672C312.657 267.386 324.152 278.942 339.506 292.181C333.676 279.172 313.068 267.998 339.752 248.407ZM317.912 326.39C292.624 332.971 333.348 346.517 365.451 333.736C362.331 332.589 359.293 331.211 356.419 329.604C345.253 331.976 333.758 332.436 322.428 330.981C311.672 329.757 317.912 326.39 317.912 326.39ZM361.592 313.533C347.223 316.441 332.362 317.13 317.748 315.523C306.992 314.528 314.053 309.63 314.053 309.63C286.137 318.278 329.489 327.997 368.242 317.436C365.861 316.594 363.562 315.14 361.592 313.533ZM389.672 338.787C389.672 338.787 394.352 342.384 384.663 345.139C365.943 350.343 307.238 351.95 290.982 345.369C285.152 342.996 296.154 339.706 299.603 339.017C301.491 338.558 303.379 338.405 305.268 338.405C298.782 334.272 263.148 346.823 287.287 350.343C352.724 360.292 406.667 345.751 389.672 338.787ZM367.175 301.594C369.556 300.14 372.101 298.916 374.729 297.845C374.729 297.845 362.331 299.834 349.933 300.906C336.796 302.13 323.577 302.283 310.44 301.365C291.146 298.993 321.032 292.181 321.032 292.181C312 292.181 303.133 294.171 295.087 297.921C278.255 305.574 336.96 309.018 367.175 301.594ZM374.564 320.114C374.4 320.421 374.236 320.65 373.907 320.88C415.042 310.854 399.935 285.37 380.23 291.722C379.162 292.181 378.259 292.794 377.684 293.636C378.834 293.253 379.983 292.947 381.215 292.717C391.067 290.88 405.189 305.191 374.564 320.114ZM375.632 355.394C350.918 359.374 325.63 359.68 300.752 356.465C300.752 356.465 304.529 359.374 323.824 360.521C353.381 362.282 398.785 359.527 399.853 346.517C400.099 346.593 397.964 351.491 375.632 355.394Z"
          fill="white"
        />
        <rect x="133" y="169" width="181" height="239" fill="white" />
        <path
          d="M184.614 361V215.545H235.466C245.598 215.545 253.955 217.297 260.537 220.801C267.118 224.258 272.019 228.921 275.239 234.793C278.458 240.616 280.068 247.08 280.068 254.182C280.068 260.432 278.955 265.593 276.73 269.665C274.552 273.737 271.664 276.956 268.065 279.324C264.514 281.691 260.655 283.443 256.489 284.58V286C260.939 286.284 265.414 287.847 269.912 290.688C274.41 293.528 278.174 297.6 281.205 302.903C284.235 308.206 285.75 314.693 285.75 322.364C285.75 329.655 284.093 336.213 280.778 342.037C277.464 347.861 272.232 352.477 265.082 355.886C257.933 359.295 248.629 361 237.17 361H184.614ZM202.227 345.375H237.17C248.676 345.375 256.844 343.15 261.673 338.699C266.55 334.201 268.989 328.756 268.989 322.364C268.989 317.439 267.734 312.894 265.224 308.727C262.715 304.513 259.14 301.152 254.5 298.642C249.86 296.085 244.367 294.807 238.023 294.807H202.227V345.375ZM202.227 279.466H234.898C240.201 279.466 244.983 278.424 249.244 276.341C253.553 274.258 256.962 271.322 259.472 267.534C262.028 263.746 263.307 259.295 263.307 254.182C263.307 247.79 261.081 242.368 256.631 237.918C252.18 233.42 245.125 231.17 235.466 231.17H202.227V279.466Z"
          fill="#B97059"
        />
      </svg>

      <WorkerLine model={model} />
      {components}
      {isClicked && (
        <BeanMediatorProperty modalOpen={open} modalClose={handleCancelClick} />
      )}
    </>
  );
}
