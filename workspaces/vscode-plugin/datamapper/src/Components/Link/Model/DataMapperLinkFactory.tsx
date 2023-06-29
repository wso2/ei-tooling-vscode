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

