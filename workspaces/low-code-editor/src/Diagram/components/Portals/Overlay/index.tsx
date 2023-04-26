/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein is strictly forbidden, unless permitted by WSO2 in accordance with
 * the WSO2 Commercial License available at http://wso2.com/licenses.
 * For specific language governing the permissions and limitations under
 * this license, please see the license as well as any agreement you’ve
 * entered into with WSO2 governing the purchase of this software and any
 * associated services.
 */
// tslint:disable: jsx-no-multiline-js
import React, { useContext } from "react";
import ReactDOM from "react-dom";

// import { Context } from "../../../../Contexts/Diagram"

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
