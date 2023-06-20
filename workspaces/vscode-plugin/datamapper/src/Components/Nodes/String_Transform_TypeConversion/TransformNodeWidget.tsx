import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import * as React from 'react';
import { TransformNodeModel } from './TransformNodeModel';
import { nodeStyles } from '../styles';
import { IntermediatePortWidget } from '../../Port/IntermediatePort/IntermediatePortWidget';
import { FileContext } from '../../ContextProvider/FileContext';
import { Delete} from '@mui/icons-material';
import { Tooltip } from '@mui/material';

export interface TransformNodeWidgetProps {
    node: TransformNodeModel;
    engine: DiagramEngine;
}

export const TransformNodeWidget: React.FC<TransformNodeWidgetProps> = ({ node, engine }) => {
    const classes = nodeStyles();
    const { setRemovedNode } = React.useContext(FileContext);

    const onClickDelete = () => {
        const nodeId = node.getID();
        setRemovedNode(node);
        console.log("delete intermediate nodes");
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
}
