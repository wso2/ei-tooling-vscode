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

import * as React from "react";
import { DefaultLinkSegmentWidgetProps } from "@projectstorm/react-diagrams";
import { DataMapperLinkModel } from "../Model/DataMapperLinkModel";

export class DefaultLinkSegmentWidget extends React.Component<DefaultLinkSegmentWidgetProps> {
    render() {
        const isSelected = !(this.props.link as DataMapperLinkModel) &&
            (this.props.selected || this.props.link.isSelected());

        const Bottom = React.cloneElement(
            this.props.factory.generateLinkSegment(
                this.props.link,
                false,
                this.props.path
            ),
            {
                ref: this.props.forwardRef,
                strokeWidth: isSelected ? 2 : 1,
                cursor: !(this.props.link as DataMapperLinkModel) ? "pointer" : "inherit"
            }
        );

        const Top = React.cloneElement(Bottom, {
            strokeLinecap: "round",
            onMouseLeave: () => {
                this.props.onSelection(false);
            },
            onMouseEnter: () => {
                this.props.onSelection(true);
            },
            ...this.props.extras,
            ref: null,
            "data-linkid": this.props.link.getID(),
            strokeOpacity: isSelected ? 0.1 : 0,
            strokeWidth: 10,
            onContextMenu: () => {
                if (!this.props.link.isLocked()) {
                    this.props.link.remove();
                }
            },
        });

        return (
            <>
                {Bottom}
                {Top}
            </>
        );
    }
}
