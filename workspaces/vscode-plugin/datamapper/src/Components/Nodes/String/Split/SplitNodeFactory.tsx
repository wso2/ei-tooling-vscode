import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { SplitNodeWidget } from "./SplitNodeWidget";
import { SplitNodeModel } from "./SplitNodeModel";

export class SplitNodeFactory extends AbstractReactFactory<
  SplitNodeModel,
  DiagramEngine
> {
  constructor() {
    super("split-node");
  }

  generateReactWidget(event: { model: SplitNodeModel }): JSX.Element {
    return <SplitNodeWidget node={event.model} engine={this.engine} />;
  }

  generateModel(event: any): SplitNodeModel {
    return new SplitNodeModel();
  }
}

