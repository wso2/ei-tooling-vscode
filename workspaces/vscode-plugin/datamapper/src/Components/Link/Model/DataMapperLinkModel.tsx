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

import { BezierCurve } from '@projectstorm/geometry';
import { DefaultLinkModel } from '@projectstorm/react-diagrams';
import { DataMapperLabelModel } from '../../LinkLabel/DataMapperLabelModel';
import { DeserializeEvent } from '@projectstorm/react-canvas-core';

export class DataMapperLinkModel extends DefaultLinkModel {
	constructor() {
		super({
			type: 'DataMapper-link',
			width: 2,
			curvyness: 5,
			locked: true,
			color: "#00c0ff"
		})
	}

	addLabel(label: DataMapperLabelModel) {
		this.labels.push(label);
	}

	getSVGPath(): string {
		if (this.points.length === 2) {
			const curve = new BezierCurve();
			curve.setSource(this.getFirstPoint().getPosition());
			curve.setTarget(this.getLastPoint().getPosition());

			const srcControl = this.getFirstPoint().getPosition().clone();
			srcControl.translate(220, 0);
			const targetControl = this.getLastPoint().getPosition().clone();
			targetControl.translate(-220, 0);
			curve.setSourceControl(srcControl);
			curve.setTargetControl(targetControl);

			if (this.sourcePort) {
				curve.getSourceControl().translate(...this.calculateControlOffset(this.getSourcePort()));
			}

			if (this.targetPort) {
				curve.getTargetControl().translate(...this.calculateControlOffset(this.getTargetPort()));
			}
			return curve.getSVGCurve();
		}
		return "";
	}

	serialize() {
		return {
			...super.serialize(),
		};
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
	}
}

