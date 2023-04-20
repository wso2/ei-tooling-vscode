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
import React from 'react';
import Lottie from 'react-lottie';

import cn from "classnames";

import animationData from './data.json';
import './styles.scss'

export interface CirclePreloaderProps {
    position: "relative" | "absolute";
}

export function CirclePreloader(props: CirclePreloaderProps) {
    const { position } = props;

    const loaderPosition = (position === "relative") ?  cn("preloader-circle-relative") : cn("preloader-circle-absolute");

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className={loaderPosition}>
            <Lottie options={defaultOptions} height={`32px`} width={`32px`} />
        </div>
    );
}
