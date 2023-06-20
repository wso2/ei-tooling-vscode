import { IntermediatePortModel } from '../../Port/IntermediatePort/IntermediatePortModel';
import { CustomNodeModel } from '../Customs/CustomNodeModel';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';

export class InputsNodeModel extends CustomNodeModel {
    onClick: any;
    name: string;
    inPort!: IntermediatePortModel;
    outPort!: IntermediatePortModel;

    constructor(options: any = {}) {
        super('my-input-node', options.name);
        this.name = options.name || undefined;
        this.onClick = options.onClick || null;
        this.initPorts();
    }

    initPorts(): void {
        this.inPort = new IntermediatePortModel(" ", "IN", 'right');
        this.addPort(this.inPort);
        this.outPort = new IntermediatePortModel("[NUMBER,STRING,BOOLEAN] ", "IN", 'right');
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