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

import { BaseModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';
import { LabelModel } from '@projectstorm/react-diagrams';

export interface DataMapperLabelOptions extends BaseModelOptions {
	editorLabel?: string;
	deleteLink?: () => void;
}

export class DataMapperLabelModel extends LabelModel {
	editorLabel?: string;
	deleteLink?: () => void;
	id: string ;

	constructor(options: DataMapperLabelOptions = {}) {
		super({
			...options,
			type: 'DataMapper-label'
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
