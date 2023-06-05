import { GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { DefaultLinkFactory } from '@projectstorm/react-diagrams';
import { DataMapperLinkModel } from './DataMapperLinkModel';
import { DataMapperLinkWidget } from './DataMapperLinkWidget';

export class DataMapperLinkFactory extends DefaultLinkFactory {
  constructor() {
    super('DataMapper-link');
  }

  generateModel(): DataMapperLinkModel {
    return new DataMapperLinkModel();
  }

  generateReactWidget(event: GenerateWidgetEvent<DataMapperLinkModel>): JSX.Element {
    return <DataMapperLinkWidget link={event.model} diagramEngine={this.engine} />;
  }

}
