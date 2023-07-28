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

import { AbstractReactFactory, GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { DataMapperLabelModel } from './DataMapperLabelModel';
import { DataMapperLabelWidget } from './DataMapperlabelWidget';

// Implementation of customized label for link
export class DataMapperLabelFactory extends AbstractReactFactory<DataMapperLabelModel, DiagramEngine> {
	constructor() {
		super('DataMapper-label');
	}

	generateModel(): DataMapperLabelModel {
		return new DataMapperLabelModel();
	}

	generateReactWidget(event: GenerateWidgetEvent<DataMapperLabelModel>): JSX.Element {
		return <DataMapperLabelWidget model={event.model} engine={this.engine} />;
	}
}
