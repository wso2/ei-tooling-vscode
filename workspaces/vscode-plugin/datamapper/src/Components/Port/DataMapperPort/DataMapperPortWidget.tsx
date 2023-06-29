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
import { RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams-core";
import DataMapperPortModel from "./DataMapperPortModel";
import { portStyles } from "../styles";

export interface DataMapperPortWidgetProps {
    engine: DiagramEngine;
    port: DataMapperPortModel;
}

enum PortState {
    PortSelected,
    LinkSelected,
    Unselected
}

export const DataMapperPortWidget: React.FC<DataMapperPortWidgetProps> = ({ port, engine }) => {
    const classes = portStyles();
    const checkedIcon = <RadioButtonChecked color="disabled" sx={{ fontSize: '16px' }} />;
    const uncheckedIcon = <RadioButtonUnchecked color="disabled" sx={{ fontSize: '16px' }} />;
    const [portState, setPortState] = React.useState<PortState>(PortState.Unselected);
    const hasLinks = Object.entries(port.links).length > 0;

    React.useEffect(() => {
        port.registerListener({
            selectionChanged: () => {
                const isSelected = port.isSelected();
                setPortState(isSelected ? PortState.PortSelected : PortState.Unselected);
            }
        });
    }, [port]);

    return (
        <PortWidget port={port} engine={engine} key={port.getID()}
            style={{ color: portState === PortState.PortSelected ? "#93a2b5" : (hasLinks ? "#96C0CE" : "#FEF6EB") }}>
            <div className={classes.port} >
                {port.portType === 'OUT' ? (
                    <div className={classes.portLabel}>
                        {port.getName()} {portState === PortState.PortSelected ? checkedIcon : uncheckedIcon}
                    </div>
                ) : (
                    <div className={classes.portIcon} >
                        {portState === PortState.PortSelected ? checkedIcon : uncheckedIcon}{port.getName()}
                    </div>
                )}
            </div>
        </PortWidget>
    )
}


