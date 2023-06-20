import {  MouseEvent } from 'react';
import { Action, ActionEvent, InputType, State } from '@projectstorm/react-canvas-core';
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
                fire: (actionEvent: ActionEvent<MouseEvent>) => {
                    const element = this.engine.getActionEventBus().getModelForEvent(actionEvent);

                    if (element instanceof PortModel && !this.sourcePort) {
                        if (element instanceof DataMapperPortModel) {
                            if (element.portType === "OUT") {
                                this.sourcePort = element;
                                element.fireEvent({}, "mappingStartedFrom");
                                element.linkedPorts.forEach((linkedPort) => {
                                    linkedPort.fireEvent({}, "disableNewLinking")
                                })
                                const link = element.createLinkModel();
                                if (link) {
                                    link.setSourcePort(element);
                                    this.link = link;
                                }
                            } else {
                                element.fireEvent({}, "mappingStartedTo");
                                this.clearState();
                                this.eject();
                            }
                        } else if (element instanceof IntermediatePortModel) {
                            if (element.portType === "OUT") {
                                this.sourcePort = element;
                                element.fireEvent({}, "mappingStartedFrom");
                                element.linkedPorts.forEach((linkedPort) => {
                                    linkedPort.fireEvent({}, "disableNewLinking")
                                })
                                const link = element.createLinkModel();
                                if (link) {
                                    link.setSourcePort(element);
                                    this.link = link;
                                }
                            } else {
                                element.fireEvent({}, "mappingStartedTo");
                                this.clearState();
                                this.eject();
                            }
                        }
                    } else if (element instanceof PortModel && this.sourcePort && element !== this.sourcePort) {
                        if (element instanceof DataMapperPortModel) {
                            if (element.portType === "IN") {
                                element.fireEvent({}, "mappingFinishedTo");
                                if (this.sourcePort.canLinkToPort(element)) {
                                    this.link.setTargetPort(element);
                                    this.link.addLabel(new DataMapperLabelModel());
                                    this.engine.getModel().addAll(this.link);
                                    console.log("link added to diagram: ", this.engine.getModel().getLinks());
                                    if (this.sourcePort instanceof DataMapperPortModel) {
                                        this.sourcePort.linkedPorts.forEach((linkedPort) => {
                                            linkedPort.fireEvent({}, "enableNewLinking")
                                        })
                                    }
                                    this.clearState();
                                    this.eject();
                                }
                            } else {
                                this.sourcePort.fireEvent({}, "linkUnselected");
                                if (this.sourcePort instanceof DataMapperPortModel) {
                                    this.sourcePort.linkedPorts.forEach((linkedPort) => {
                                        linkedPort.fireEvent({}, "enableNewLinking")
                                    })
                                }
                                this.sourcePort.removeLink(this.link);
                                this.sourcePort = element;
                                this.link.setSourcePort(element);
                                element.fireEvent({}, "mappingStartedFrom");
                                if (element instanceof DataMapperPortModel) {
                                    element.linkedPorts.forEach((linkedPort) => {
                                        linkedPort.fireEvent({}, "disableNewLinking")
                                    })
                                }
                            }
                        } else if (element instanceof IntermediatePortModel) {
                            if (element.portType === "IN") {
                                element.fireEvent({}, "mappingFinishedTo");
                                if (this.sourcePort.canLinkToPort(element)) {
                                    this.link.setTargetPort(element);
                                    this.link.addLabel(new DataMapperLabelModel());
                                    this.engine.getModel().addAll(this.link);
                                    if (this.sourcePort instanceof IntermediatePortModel) {
                                        this.sourcePort.linkedPorts.forEach((linkedPort) => {
                                            linkedPort.fireEvent({}, "enableNewLinking")
                                        })
                                    }
                                    this.clearState();
                                    this.eject();
                                }
                            } else {
                                this.sourcePort.fireEvent({}, "linkUnselected");
                                if (this.sourcePort instanceof IntermediatePortModel) {
                                    this.sourcePort.linkedPorts.forEach((linkedPort) => {
                                        linkedPort.fireEvent({}, "enableNewLinking")
                                    })
                                }
                                this.sourcePort.removeLink(this.link);
                                this.sourcePort = element;
                                this.link.setSourcePort(element);
                                element.fireEvent({}, "mappingStartedFrom");
                                if (element instanceof IntermediatePortModel) {
                                    element.linkedPorts.forEach((linkedPort) => {
                                        linkedPort.fireEvent({}, "disableNewLinking")
                                    })
                                }
                            }
                        }
                    } else if (element === this.link.getLastPoint()) {
                        this.link.point(0, 0, -1);
                    } else if (element === this.sourcePort) {
                        element.fireEvent({}, "mappingStartedFromSelectedAgain");
                        if (element instanceof DataMapperPortModel) {
                            element.linkedPorts.forEach((linkedPort) => {
                                linkedPort.fireEvent({}, "enableNewLinking")
                            })
                        }
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