import { IntermediatePortModel } from "../../Port/IntermediatePort/IntermediatePortModel";
import { CustomNodeModel } from "../Customs/CustomNodeModel";

export class TransformNodeModel extends CustomNodeModel {
    name: string;
    public inPort!: IntermediatePortModel;
    public outPort!: IntermediatePortModel;

    constructor(options: any = {}) {
        super('transform-node', options.name);
        this.name = options.name;
    }


    initPorts(): void {
        const inPortName = this.name === 'ToString' ? "IN : [BOOL/NUM] " :
            ((this.name === 'Ceiling' || this.name === 'Floor' || this.name === 'Round' || this.name === 'AbsoluteValue') ? "IN : [NUM] " : "IN : [STRING] ");
        this.inPort = new IntermediatePortModel(inPortName, "IN", 'right');
        this.addPort(this.inPort);

        const outPortName = (this.name === 'ToString' || this.name === 'Trim' || this.name === 'UpperCase' || this.name === 'LowerCase') ? "RESULT : STRING " : "RESULT : [NUM/BOOL] ";
        this.outPort = new IntermediatePortModel(outPortName, "OUT", 'left');
        this.addPort(this.outPort);
    }

    initLinks(): void { }
}
