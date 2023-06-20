import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine, PortModel } from '@projectstorm/react-diagrams';
import DataMapperPortModel from './DataMapperPortModel';
import { DataMapperPortWidget } from './DataMapperPortWidget';

export class DataMapperPortFactory extends AbstractModelFactory<PortModel, DiagramEngine> {

	constructor() {
		super("my-datamapper-port");
	}

    generateModel(event: any) :DataMapperPortModel {
		return new DataMapperPortModel('name','IN','right');
	}

    generateReactWidget(event: any): JSX.Element {
        return <DataMapperPortWidget port={event.port} engine={this.engine} />;
      }
}
