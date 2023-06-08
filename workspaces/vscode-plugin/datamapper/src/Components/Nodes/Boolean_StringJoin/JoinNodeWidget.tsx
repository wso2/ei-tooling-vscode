import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import * as React from "react";
import { JoinNodeModel } from "./JoinNodeModel";
import { nodeStyles } from "../styles";
import { IntermediatePortWidget } from "../../Port/IntermediatePort/IntermediatePortWidget";
import { FileContext } from "../../ContextProvider/FileContext";
import { Delete } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export interface JoinNodeWidgetProps {
  node: JoinNodeModel;
  engine: DiagramEngine;
}

export const JoinNodeWidget: React.FC<JoinNodeWidgetProps> = ({
  node,
  engine,
}) => {
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
            <Delete sx={{ fontSize: "15px" }} />
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
};
