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

import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { InputsNodeModel } from "./InputsNodeModel";
import { InputsNodeWidget } from "./InputsNodeWidget";

// Implemenattion of nodes for the global functions.
export class InputsNodeFactory extends AbstractReactFactory<InputsNodeModel, DiagramEngine> {
	constructor() {
		super("my-input-node");
	}

	generateModel(event: any): InputsNodeModel {
		return new InputsNodeModel();
	}

	generateReactWidget(event: any): JSX.Element {
		return <InputsNodeWidget node={event.model} engine={this.engine} />;
	}
}
