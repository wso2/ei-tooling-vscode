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
import classnames from 'classnames';
import { DiagramOverlayContainer } from "../Portals/Overlay";

import "./style.scss";

interface PanelProps {
    children: JSX.Element,
    // onClose: () => void;
}

export function Panel(props: PanelProps) {
    const { children } = props;
    const [isVisible, setIsVisible] = useState(true);

    // const onCloseEvent = (evt: React.MouseEvent) => {
    //     evt.stopPropagation();
    //     setIsVisible(false);
    //     setTimeout(onClose, 500)
    // }

    const onDivClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
    }

    return (
        <div onClick={onDivClick} >
            <DiagramOverlayContainer>
                <div className={classnames("panel", isVisible ? 'panel-slide-in' : 'panel-slide-out')}>
                    <div className={"panel-form-wrapper"}>
                        {children}
                    </div>
                </div>
                {/*<OverlayBackground />*/}
            </DiagramOverlayContainer>
        </div>
    );
}
