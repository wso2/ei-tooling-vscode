import { IntermediatePortModel } from "../../../Port/IntermediatePort/IntermediatePortModel";
import { CustomNodeModel } from "../../Customs/CustomNodeModel";

export class SubStringNodeModel extends CustomNodeModel {
    name: string;
    public inPort1!: IntermediatePortModel;
    public inPort2!: IntermediatePortModel;
    public inPort3!: IntermediatePortModel;
    public outPort!: IntermediatePortModel;

    constructor(options: any = {}) {
        super('sub-string-node', options.name);
        this.name = options.name;
    }


    initPorts(): void {
        const inPort1Name = (this.name === 'IfElse' ? 'CONDITION ' : 'VALUE : [STRING] ');
        const inPort2Name = this.name === 'Replace' ? 'TARGET ' : ((this.name === 'IfElse') ? 'THEN : STRING ' : 'START: [NUM] ');
        const inPort3Name = this.name === 'Replace' ? 'REPLACE WITH ' : ((this.name === 'IfElse') ? 'ELSE : STRING ' : 'LENGTH : [NUM] ');

        this.inPort1 = new IntermediatePortModel(inPort1Name, "IN", 'right');
        this.addPort(this.inPort1);

        this.inPort2 = new IntermediatePortModel(inPort2Name, "IN", 'right');
        this.addPort(this.inPort2);

        this.inPort3 = new IntermediatePortModel(inPort3Name, "IN", 'right');
        this.addPort(this.inPort3);

        this.outPort = new IntermediatePortModel(' Result : [STRING]', "OUT", 'left');
        this.addPort(this.outPort);
    }

    initLinks(): void { }
}
