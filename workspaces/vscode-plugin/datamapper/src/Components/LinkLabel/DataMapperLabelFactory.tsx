import {
  AbstractReactFactory,
  GenerateWidgetEvent,
} from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import { DataMapperLabelModel } from "./DataMapperLabelModel";
import { DataMapperLabelWidget } from "./DataMapperlabelWidget";

export class DataMapperLabelFactory extends AbstractReactFactory<
  DataMapperLabelModel,
  DiagramEngine
> {
  constructor() {
    super("DataMapper-label");
  }

  generateModel(): DataMapperLabelModel {
    return new DataMapperLabelModel();
  }

  generateReactWidget(
    event: GenerateWidgetEvent<DataMapperLabelModel>
  ): JSX.Element {
    return <DataMapperLabelWidget model={event.model} engine={this.engine} />;
  }
}

