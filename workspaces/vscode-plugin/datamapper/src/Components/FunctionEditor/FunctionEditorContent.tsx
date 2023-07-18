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
import { ExpandMore, FolderOpenOutlined, NavigateNext } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Icon, Typography } from '@mui/material';
import { FileContext } from './../ContextProvider/FileContext';
import { CustomNodeModel } from '../Nodes/Customs/CustomNodeModel';
import { JoinNodeModel } from '../Nodes/Boolean_StringJoin/JoinNodeModel';
import { InputsNodeModel } from '../Nodes/InputsNodes/InputsNodeModel';
import { TransformNodeModel } from '../Nodes/String_Transform_TypeConversion/TransformNodeModel';
import { SplitNodeModel } from '../Nodes/String/Split/SplitNodeModel';
import { SubStringNodeModel } from '../Nodes/String/SubString/SubStringNodeModel';
import { FunctionData as data } from './FunctionEditorData';
import { FunctionStyles } from './styles';

const FunctionEditorContent = () => {
    const classes = FunctionStyles();
    const { setAddedNode } = React.useContext(FileContext);
    const IntermediateNodes: CustomNodeModel[] = [];

    const handleNode = (operation: String) => {
        var commonNode: CustomNodeModel;
        switch (operation) {
            case 'Concat':
            case 'EndsWith':
            case 'StartsWith':
            case 'Match':
            case 'AND':
            case 'OR':
            case 'Add':
            case 'Subtract':
            case 'Multiply':
            case 'Division':
            case 'Set Precision':
            case 'Min':
            case 'Max':
            case 'Compare':
                {
                    commonNode = new JoinNodeModel({ name: operation });
                    break;
                }
            case 'UpperCase':
            case 'LowerCase':
            case 'Trim':
            case 'StringLength':
            case 'ToString':
            case 'StringToBoolean':
            case 'StringToNumber':
            case 'NOT':
            case 'Ceiling':
            case 'Floor':
            case 'Round':
            case 'AbsoluteValue':
                {
                    commonNode = new TransformNodeModel({ name: operation });
                    break;
                }
            case 'Split':
                {
                    commonNode = new SplitNodeModel({ name: operation });
                    break;
                }
            case 'SubString':
            case 'Replace':
            case 'IfElse':
                {
                    commonNode = new SubStringNodeModel({ name: operation });
                    break;
                }
            default:
                {
                    commonNode = new InputsNodeModel({ name: operation });
                }
        }

        commonNode.setPosition(500, 200);
        IntermediateNodes.push(commonNode);
        setAddedNode(IntermediateNodes);
    }

    return (
        <>
            <div>
                {data.map((item, index) => (
                    <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMore />} className={classes.accordian}>
                            <FolderOpenOutlined /><Typography>{Object.keys(item)[0]}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {Object.values(item)[0].map((functionVal: any, i: any) => (
                                    <div>
                                        <NavigateNext/>
                                        <span key={i} onClick={() => handleNode(functionVal)} className={classes.text}>{functionVal} </span>
                                    </div>
                                ))}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        </>
    )
}

export default FunctionEditorContent;
