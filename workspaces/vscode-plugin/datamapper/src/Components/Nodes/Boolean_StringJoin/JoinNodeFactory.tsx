import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { JoinNodeWidget } from './JoinNodeWidget';
import { JoinNodeModel } from './JoinNodeModel';

export class JoinNodeFactory extends AbstractReactFactory<JoinNodeModel, DiagramEngine> {
	constructor() {
		super('join-node');
	}

	generateReactWidget(event: { model: JoinNodeModel; }): JSX.Element {
		return <JoinNodeWidget node={event.model} engine={this.engine}/>;
	}

    generateModel(event: any) :JoinNodeModel {
		return new JoinNodeModel();
	}
}

