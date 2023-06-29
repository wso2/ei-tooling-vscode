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
import { FileContext } from '../ContextProvider/FileContext';
import { DataMapperNodeModel } from '../Nodes/DataMapperNodes/DataMapperNodeModel';
import { CustomNodeModel } from '../Nodes/Customs/CustomNodeModel';
import DataMapperDiagram from './DataMapperDiagram';

const NodeManager = () => {
    const { schemaInput, schemaOutput } = React.useContext(FileContext);
    const { setAddedNode } = React.useContext(FileContext);
    let InputDataMapper: CustomNodeModel, OutputDataMapper: CustomNodeModel;

    React.useEffect(() => {
        const newNodes: CustomNodeModel[] = [];
        if (schemaInput) {
            InputDataMapper = new DataMapperNodeModel(schemaInput.properties, { name: 'Input' });
            InputDataMapper.setPosition(100, 50);
            newNodes.push(InputDataMapper);
            setAddedNode(newNodes);
        }
    }, [schemaInput]);

    React.useEffect(() => {
        const newNodes: CustomNodeModel[] = [];
        if (schemaOutput) {
            OutputDataMapper = new DataMapperNodeModel(schemaOutput.properties, { name: 'Output' });
            OutputDataMapper.setPosition(700, 50);
            newNodes.push(OutputDataMapper);
            setAddedNode(newNodes);
        }
    }, [schemaOutput]);

    return (<DataMapperDiagram />);
};

export default NodeManager;
