import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { TransformNodeModel } from './TransformNodeModel';
import { TransformNodeWidget } from './TransformNodeWidget';

export class TransformNodeFactory extends AbstractReactFactory<TransformNodeModel, DiagramEngine> {
	constructor() {
		super('transform-node');
	}

	generateReactWidget(event: { model: TransformNodeModel; }): JSX.Element {
		return <TransformNodeWidget node={event.model} engine={this.engine}/>;
	}

    generateModel(event: any) :TransformNodeModel {
		return new TransformNodeModel();
	}
}

