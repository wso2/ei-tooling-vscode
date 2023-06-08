import React from "react";
import { DataMapperNodeModel } from "./DataMapperNodeModel";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { nodeStyles } from "../styles";
import { DataMapperPortWidget } from "../../Port/DataMapperPort/DataMapperPortWidget";
import DataMapperPortModel from "../../Port/DataMapperPort/DataMapperPortModel";

export interface DataMapperNodeProps {
  node: DataMapperNodeModel;
  engine: DiagramEngine;
}

export const DataMapperNodeWidget: React.FC<DataMapperNodeProps> = ({
  node,
  engine,
}) => {
  const classes = nodeStyles();
  const inputPorts = Object.values(node.getPorts()) as DataMapperPortModel[];

  const renderPortsRecursively = (
    ports: DataMapperPortModel[],
    index: number = 0
  ) => {
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
  };

  return (
    <>
      <div className={classes.node}>
        <span className={classes.nodeLabel}>{node.name}</span>
        <div className={classes.portContainer}>
          {renderPortsRecursively(inputPorts)}
        </div>
      </div>
    </>
  );
};
