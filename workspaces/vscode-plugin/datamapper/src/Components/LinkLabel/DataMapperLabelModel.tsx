import {
  BaseModelOptions,
  DeserializeEvent,
} from "@projectstorm/react-canvas-core";
import { LabelModel } from "@projectstorm/react-diagrams";

export interface DataMapperLabelOptions extends BaseModelOptions {
  editorLabel?: string;
  deleteLink?: () => void;
}

export class DataMapperLabelModel extends LabelModel {
  editorLabel?: string;
  deleteLink?: () => void;
  id: string;

  constructor(options: DataMapperLabelOptions = {}) {
    super({
      ...options,
      type: "DataMapper-label",
    });
    this.id = this.getID();
    this.editorLabel = options.editorLabel;
    this.deleteLink = options.deleteLink;
  }

  serialize() {
    return {
      ...super.serialize(),
    };
  }

  deserialize(event: DeserializeEvent<this>): void {
    super.deserialize(event);
  }
}
