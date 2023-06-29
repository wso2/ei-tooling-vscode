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
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams-core";
import { IntermediatePortModel } from "./IntermediatePortModel";
import { RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import { portStyles } from "../styles";

export interface IntermediatePortWidgetProps {
    engine: DiagramEngine;
    port: IntermediatePortModel;
}

export const IntermediatePortWidget: React.FC<IntermediatePortWidgetProps> = (props: IntermediatePortWidgetProps) => {
    const classes = portStyles();
    const { engine, port } = props;
    const [active, setActive] = React.useState(false);
    const checkedIcon = <RadioButtonChecked color="disabled" sx={{ fontSize: '13px', color: 'white' }} />;
    const uncheckedIcon = <RadioButtonUnchecked color="disabled" sx={{ fontSize: '13px', color: 'white' }} />;

    React.useEffect(() => {
        port.registerListener({
            selectionChanged: () => {
                setActive(port.isSelected());
            }
        })
    }, []);

    return (
        <PortWidget port={port} engine={engine} style={{ color: active ? "#1b6782" : "#96C0CE" }}>
            <div className={classes.joinPort} >
                {port.portType === 'OUT' ? (
                    <div className={classes.portLabel}>
                        {port.getName()} <span className={classes.LabelLeft}>{active ? checkedIcon : uncheckedIcon}</span>
                    </div>
                ) : (
                    <div className={classes.portIcon} >
                        <span className={classes.LabelRight}>{active ? checkedIcon : uncheckedIcon}</span>{port.getName()}
                    </div>
                )}
            </div>
        </PortWidget >
    )
}
