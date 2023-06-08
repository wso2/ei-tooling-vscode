import { IntermediatePortModel } from "../../../Port/IntermediatePort/IntermediatePortModel";
import { CustomNodeModel } from "../../Customs/CustomNodeModel";

export class SplitNodeModel extends CustomNodeModel {
  name: string;
  public outPort1!: IntermediatePortModel;
  public outPort2!: IntermediatePortModel;
  public inPort!: IntermediatePortModel;

  constructor(options: any = {}) {
    super("split-node", options.name);
    this.name = options.name;
  }

  initPorts(): void {
    this.outPort1 = new IntermediatePortModel(
      " Result_1 : [STRING]",
      "OUT",
      "left"
    );
    this.addPort(this.outPort1);

    this.outPort2 = new IntermediatePortModel(
      " Result_2 : [STRING]",
      "OUT",
      "left"
    );
    this.addPort(this.outPort2);

    this.inPort = new IntermediatePortModel(
      " Result : [STRING]",
      "IN",
      "right"
    );
    this.addPort(this.inPort);
  }

  initLinks(): void {}
}
