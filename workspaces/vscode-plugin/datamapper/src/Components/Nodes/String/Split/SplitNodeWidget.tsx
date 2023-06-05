import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import * as React from 'react';
import { SplitNodeModel } from './SplitNodeModel';
import { nodeStyles } from '../../styles';
import { IntermediatePortWidget } from '../../../Port/IntermediatePort/IntermediatePortWidget';
import { FileContext } from '../../../ContextProvider/FileContext';
import { Delete } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

export interface SplitNodeWidgetProps {
    node: SplitNodeModel;
    engine: DiagramEngine;
}

export const SplitNodeWidget: React.FC<SplitNodeWidgetProps> = ({ node, engine }) => {
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
                        <div>
                            <IntermediatePortWidget engine={engine} port={node.outPort1} />
                            <IntermediatePortWidget engine={engine} port={node.outPort2} />
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}
