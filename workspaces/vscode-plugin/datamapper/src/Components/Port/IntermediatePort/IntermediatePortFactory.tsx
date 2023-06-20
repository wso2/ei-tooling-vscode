import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine, PortModel } from '@projectstorm/react-diagrams';
import { IntermediatePortModel, INT_PORT_TYPE_ID } from './IntermediatePortModel';
import { IntermediatePortWidget } from './IntermediatePortWidget';

export class IntermediatePortFactory extends AbstractModelFactory<PortModel, DiagramEngine> {

    constructor() {
        super(INT_PORT_TYPE_ID);
    }

    generateModel(event: any): IntermediatePortModel {
        return new IntermediatePortModel('name', 'IN','right');
    }

    generateReactWidget(event: any): JSX.Element {
        return <IntermediatePortWidget port={event.port} engine={this.engine} />;
    }
}

