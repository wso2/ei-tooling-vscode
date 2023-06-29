/**
 * Copyright (c) 2023, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

import { DeserializeEvent } from "@projectstorm/react-canvas-core";
import DataMapperPortModel from "../../Port/DataMapperPort/DataMapperPortModel";
import { CustomNodeModel } from "../Customs/CustomNodeModel";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import { IntermediatePortModel } from "../../Port/IntermediatePort/IntermediatePortModel";

interface SchemaProperty {
  [key: string]: {
    type: string;
    id?: string;
    description?: string;
    properties?: SchemaProperty;
  };
}

export class DataMapperNodeModel extends CustomNodeModel {
  name: string;
  schema: SchemaProperty;
  engine!: DiagramEngine;

  constructor(schema: SchemaProperty, options: any = {}) {
    super("my-datamapper-node", options.name);
    this.name = options.name || undefined;
    this.schema = schema;
    this.initPorts();
  }

  initPorts(): void {
    let portType: "IN" | "OUT" = "OUT";
    let port: DataMapperPortModel | IntermediatePortModel;
    let alignment = "right";
    if (this.name === "Output") {
      portType = "IN";
      alignment = "left";
    }

    if (this.schema) {
      const processProperties = (properties: SchemaProperty) => {
        for (const [propertyName, property] of Object.entries(properties)) {
          if (property.type === 'object') {
            port = new DataMapperPortModel(`${propertyName}`, portType, alignment);
            this.addPort(port);
            if (property.properties) {
              processProperties(property.properties);
            }
          }
          else {
            port = new DataMapperPortModel(`${propertyName} : ${property.type}`, portType, alignment);
            this.addPort(port);
          }
        }
      }
      processProperties(this.schema);
    }
  }

  initLinks(): void { }

  serialize() {
    return {
      ...super.serialize(),
      name: this.name,
      schema: this.schema,
    };
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.name = event.data.name;
    this.schema = event.data.schema;
  }
}
