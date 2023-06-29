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

import React from 'react';
import { DataMapperNodeModel } from './DataMapperNodeModel';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { nodeStyles } from '../styles';
import { DataMapperPortWidget } from '../../Port/DataMapperPort/DataMapperPortWidget';
import DataMapperPortModel from '../../Port/DataMapperPort/DataMapperPortModel';
import { Delete } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { FileContext } from '../../ContextProvider/FileContext';

export interface DataMapperNodeProps {
    node: DataMapperNodeModel;
    engine: DiagramEngine;
}

export const DataMapperNodeWidget: React.FC<DataMapperNodeProps> = ({ node, engine }) => {
    const classes = nodeStyles();
    const inputPorts = Object.values(node.getPorts()) as DataMapperPortModel[];
    const { setRemovedNode } = React.useContext(FileContext);

    const onClickDelete = () => {
        const nodeId = node.getID();
        setRemovedNode(node);
    };

    const renderPortsRecursively = (ports: DataMapperPortModel[], index: number = 0) => {
        if (index >= ports.length) {
            return null;
        }
        const port = ports[index];
        return (
            <div>
                <DataMapperPortWidget key={port.getID()} port={port} engine={engine} />
                {renderPortsRecursively(ports, index + 1)}
            </div>
        );
    }

    return (
        <>
            <div className={classes.node}>
                <div className={classes.nodeLabel}>{node.name}
                    <span onClick={onClickDelete} className={classes.Icon}>
                        <Tooltip title="Delete Node from model">
                            <Delete sx={{ fontSize: '17px' }} />
                        </Tooltip>
                    </span></div>
                <div className={classes.portContainer}>
                    {renderPortsRecursively(inputPorts)}
                </div>
            </div>
        </>
    );
};

