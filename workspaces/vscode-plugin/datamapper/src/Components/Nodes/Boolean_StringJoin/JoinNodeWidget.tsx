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

import * as React from 'react';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { JoinNodeModel } from './JoinNodeModel';
import { nodeStyles } from '../styles';
import { IntermediatePortWidget } from '../../Port/IntermediatePort/IntermediatePortWidget';
import { FileContext } from '../../ContextProvider/FileContext';
import { Delete } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

export interface JoinNodeWidgetProps {
    node: JoinNodeModel;
    engine: DiagramEngine;
}

export const JoinNodeWidget: React.FC<JoinNodeWidgetProps> = ({ node, engine }) => {
    const classes = nodeStyles();
    const { setRemovedNode } = React.useContext(FileContext);

    const onClickDelete = () => {
        const nodeId = node.getID();
        setRemovedNode(node);
    };

    return (
        <>
            <div className={classes.joinNode}>
                <span className={classes.nodeLabel}>{node.name}</span>
                <span onClick={onClickDelete} className={classes.Icon}>
                    <Tooltip title="Delete Node from model">
                        <Delete sx={{ fontSize: '15px' }} />
                    </Tooltip>
                </span>
                <div className={classes.root}>
                    <div className={classes.header}>
                        <div>
                            <IntermediatePortWidget engine={engine} port={node.inPort1} />
                            <IntermediatePortWidget engine={engine} port={node.inPort2} />
                        </div>
                        <IntermediatePortWidget engine={engine} port={node.outPort} />
                    </div>
                </div>
            </div>
        </>
    );
}
