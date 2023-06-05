import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { SubStringNodeWidget } from './SubStringNodeWidget';
import { SubStringNodeModel } from './SubStringNodeModel';

export class SubStringNodeFactory extends AbstractReactFactory<SubStringNodeModel, DiagramEngine> {
	constructor() {
		super('sub-string-node');
	}

	generateReactWidget(event: { model: SubStringNodeModel; }): JSX.Element {
		return <SubStringNodeWidget node={event.model} engine={this.engine}/>;
	}

    generateModel(event: any) :SubStringNodeModel {
		return new SubStringNodeModel();
	}
}

