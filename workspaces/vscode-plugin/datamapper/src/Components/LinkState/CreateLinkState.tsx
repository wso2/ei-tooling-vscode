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

import { Action, InputType, State } from '@projectstorm/react-canvas-core';
import { DiagramEngine, PortModel } from '@projectstorm/react-diagrams-core';
import DataMapperPortModel from '../Port/DataMapperPort/DataMapperPortModel';
import { DataMapperLinkModel } from './../Link/Model/DataMapperLinkModel';
import { DataMapperLabelModel } from '../LinkLabel/DataMapperLabelModel';
import { IntermediatePortModel } from '../Port/IntermediatePort/IntermediatePortModel';

export class CreateLinkState extends State<DiagramEngine> {
    sourcePort?: PortModel;
    link!: DataMapperLinkModel;

    constructor() {
        super({ name: 'create-new-link' });

        this.registerAction(
            new Action({
                type: InputType.MOUSE_UP,
                fire: (actionEvent: any) => {
                    const element = this.engine.getActionEventBus().getModelForEvent(actionEvent);

                    if (element instanceof PortModel && !this.sourcePort) {
                        if (element instanceof DataMapperPortModel) {
                            if (element.portType === "OUT") {
                                this.sourcePort = element;
                                const link = element.createLinkModel();
                                if (link) {
                                    link.setSourcePort(element);
                                    this.link = link;
                                }
                            } else {
                                this.clearState();
                                this.eject();
                            }
                        } else if (element instanceof IntermediatePortModel) {
                            if (element.portType === "OUT") {
                                this.sourcePort = element;
                                const link = element.createLinkModel();
                                if (link) {
                                    link.setSourcePort(element);
                                    this.link = link;
                                }
                            } else {
                                this.clearState();
                                this.eject();
                            }
                        }
                    } else if (element instanceof PortModel && this.sourcePort && element !== this.sourcePort) {
                        if (element instanceof DataMapperPortModel) {
                            if (element.portType === "IN") {
                                if (this.sourcePort.canLinkToPort(element)) {
                                    this.link.setTargetPort(element);
                                    this.link.addLabel(new DataMapperLabelModel());
                                    this.engine.getModel().addAll(this.link);
                                    this.clearState();
                                    this.eject();
                                }
                            } else {
                                this.sourcePort.removeLink(this.link);
                                this.sourcePort = element;
                                this.link.setSourcePort(element);
                            }
                        } else if (element instanceof IntermediatePortModel) {
                            if (element.portType === "IN") {
                                if (this.sourcePort.canLinkToPort(element)) {
                                    this.link.setTargetPort(element);
                                    this.link.addLabel(new DataMapperLabelModel());
                                    this.engine.getModel().addAll(this.link);
                                    this.clearState();
                                    this.eject();
                                }
                            } else {
                                this.sourcePort.removeLink(this.link);
                                this.sourcePort = element;
                                this.link.setSourcePort(element);
                            }
                        }
                    } else if (element === this.sourcePort) {
                        this.link.remove();
                        this.clearState();
                        this.eject();
                    }
                    this.engine.repaintCanvas();
                }
            })
        );
    }

    clearState() {
        this.sourcePort = undefined;
    }
}
