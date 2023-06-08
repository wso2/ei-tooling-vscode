import {
  DiagramModel,
  NodeModel,
  NodeModelGenerics,
} from "@projectstorm/react-diagrams";

export abstract class CustomNodeModel extends NodeModel<NodeModelGenerics> {
  private diagramModel!: DiagramModel;
  name: string;

  constructor(type: string, name: string) {
    super({ type });
    this.name = name;
  }

  public setModel(model: DiagramModel) {
    this.diagramModel = model;
  }

  public getModel() {
    return this.diagramModel;
  }

  public getName() {
    return this.name;
  }

  abstract initPorts(): void;
  abstract initLinks(): void;
}
