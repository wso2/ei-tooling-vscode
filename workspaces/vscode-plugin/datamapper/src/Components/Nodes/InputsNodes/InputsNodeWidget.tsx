import React from 'react';
import { InputsNodeModel } from './InputsNodeModel';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { nodeStyles } from '../styles';
import { IntermediatePortWidget } from '../../Port/IntermediatePort/IntermediatePortWidget';
import { FileContext } from '../../ContextProvider/FileContext';
import { Tooltip } from '@mui/material';
import { Delete} from '@mui/icons-material';

export interface InputsNodeProps {
    node: InputsNodeModel;
    engine: DiagramEngine;
}

export const InputsNodeWidget: React.FC<InputsNodeProps> = ({ node, engine }) => {
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
                        <IntermediatePortWidget engine={engine} port={node.inPort} />
                        <IntermediatePortWidget engine={engine} port={node.outPort} />
                    </div>
                </div>
            </div>
        </>
    );
};
