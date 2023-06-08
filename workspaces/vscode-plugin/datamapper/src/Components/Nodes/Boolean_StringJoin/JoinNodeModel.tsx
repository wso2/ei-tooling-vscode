import { DeserializeEvent } from "@projectstorm/react-canvas-core";
import { IntermediatePortModel } from "../../Port/IntermediatePort/IntermediatePortModel";
import { CustomNodeModel } from "../Customs/CustomNodeModel";

export class JoinNodeModel extends CustomNodeModel {
  name: string;
  public inPort1!: IntermediatePortModel;
  public inPort2!: IntermediatePortModel;
  public outPort!: IntermediatePortModel;

  constructor(options: any = {}) {
    super("join-node", options.name);
    this.name = options.name;
    this.initPorts();
  }

  initPorts(): void {
    const inPort1Name =
      this.name === "Add" ||
      this.name === "Subtract" ||
      this.name === "Multiply" ||
      this.name === "Division" ||
      this.name === "Set Precision" ||
      this.name === "Min" ||
      this.name === "Max" ||
      this.name === "Compare"
        ? "IN_1 : [NUM] "
        : "IN_1 : [STRING] ";
    this.inPort1 = new IntermediatePortModel(inPort1Name, "IN", "right");
    this.addPort(this.inPort1);

    const inPort2Name =
      this.name === "Add" ||
      this.name === "Subtract" ||
      this.name === "Multiply" ||
      this.name === "Division" ||
      this.name === "Min" ||
      this.name === "Max" ||
      this.name === "Compare"
        ? "IN_2 : [NUM] "
        : this.name === "Set Precision"
        ? "NoOfDigits:NUM "
        : "IN_2 : [STRING] ";
    this.inPort2 = new IntermediatePortModel(inPort2Name, "IN", "right");
    this.addPort(this.inPort2);

    const outPortName =
      this.name === "Add" ||
      this.name === "Subtract" ||
      this.name === "Multiply" ||
      this.name === "Division" ||
      this.name === "Set Precision" ||
      this.name === "Min" ||
      this.name === "Max" ||
      this.name === "Compare"
        ? " Result : [NUM]"
        : " Result : [STRING]";
    this.outPort = new IntermediatePortModel(outPortName, "OUT", "left");
    this.addPort(this.outPort);
  }

  initLinks(): void {}

  serialize() {
    return {
      ...super.serialize(),
      name: this.name,
    };
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.name = event.data.name;
  }
}
