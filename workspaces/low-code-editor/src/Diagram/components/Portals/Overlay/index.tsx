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

import React, { useContext } from "react";
import ReactDOM from "react-dom";

export interface DiagramOverlayPosition {
    x: number,
    y: number
};

export interface DiagramOverlayProps {
    position: DiagramOverlayPosition;
    children: React.ReactElement | React.ReactElement[],
    className?: string;
    stylePosition?: any
}

export function DiagramOverlay({ children, position, className, stylePosition }: DiagramOverlayProps) {
    return (
        <div
            className={className}
            style={{
                position: stylePosition ? stylePosition : 'relative',
                top: position.y,
                left: position.x,
                zIndex: 3
            }}
        >
            {children}
        </div>
    )
}

export interface DiagramOverlayContainerProps {
    children: React.ReactElement | React.ReactElement[];
    forceRender?: boolean;
    divId?: string;
}

export function DiagramOverlayContainer(props: DiagramOverlayContainerProps) {
    // const {
    //     props: {
    //         isReadOnly
    //     }
    // } = useContext(Context);
    const { children, forceRender, divId = `canvas-overlay` } = props;

    // if (!forceRender && isReadOnly) {
    //     return null;
    // }

    const overlayDiv = document.getElementById(divId);

    if (overlayDiv) {
        return ReactDOM.createPortal(children, overlayDiv);
    } else {
        return null;
    }

}
