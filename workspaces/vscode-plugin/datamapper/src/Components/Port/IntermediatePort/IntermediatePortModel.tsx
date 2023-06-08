import { PortModel, PortModelGenerics } from "@projectstorm/react-diagrams";
import { DataMapperLinkModel } from "../../Link/Model/DataMapperLinkModel";

export interface IntermediateNodeModelGenerics {
  PORT: IntermediatePortModel;
}
export const INT_PORT_TYPE_ID = "datamapper-intermediate-port";

export class IntermediatePortModel extends PortModel<
  PortModelGenerics & IntermediateNodeModelGenerics
> {
  linkedPorts: IntermediatePortModel[] = [];

  constructor(
    public portId: string,
    public portType: "IN" | "OUT",
    public alignment: string
  ) {
    super({
      type: INT_PORT_TYPE_ID,
      name: portId,
    });
  }

  getPortType(): string {
    return this.portType;
  }

  setName(PortName: string) {
    this.options.name = PortName;
  }

  createLinkModel(): DataMapperLinkModel {
    const lm = new DataMapperLinkModel();
    return lm;
  }

  canLinkToPort(port: IntermediatePortModel): boolean {
    return this.portType !== port.portType;
  }

  addLinkedPort(port: IntermediatePortModel): void {
    this.linkedPorts.push(port);
    port.linkedPorts.push(this);
  }
}

