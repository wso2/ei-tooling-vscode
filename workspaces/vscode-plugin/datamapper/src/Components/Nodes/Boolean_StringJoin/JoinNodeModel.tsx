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
import { IntermediatePortModel } from "../../Port/IntermediatePort/IntermediatePortModel";
import { CustomNodeModel } from "../Customs/CustomNodeModel";

// Declaration the model for arithmetic functional nodes.
export class JoinNodeModel extends CustomNodeModel {
    name: string;
    public inPort1!: IntermediatePortModel;
    public inPort2!: IntermediatePortModel;
    public outPort!: IntermediatePortModel;

    constructor(options: any = {}) {
        super('join-node', options.name);
        this.name = options.name;
        this.initPorts();
    }

    initPorts(): void {
        const inPort1Name =
            (this.name === 'Add' || this.name === 'Subtract' || this.name === 'Multiply' || this.name === 'Division' || this.name === 'Set Precision' || this.name === 'Min' || this.name === 'Max' || this.name === 'Compare') ? "IN_1 : [NUM] " : "IN_1 : [STRING] ";
        this.inPort1 = new IntermediatePortModel(inPort1Name, "IN", 'right');
        this.addPort(this.inPort1);

        const inPort2Name =
            (this.name === 'Add' || this.name === 'Subtract' || this.name === 'Multiply' || this.name === 'Division' || this.name === 'Min' || this.name === 'Max' || this.name === 'Compare') ? "IN_2 : [NUM] " : ((this.name === 'Set Precision') ? "NoOfDigits:NUM " : "IN_2 : [STRING] ");
        this.inPort2 = new IntermediatePortModel(inPort2Name, "IN", 'right');
        this.addPort(this.inPort2);

        const outPortName =
            (this.name === 'Add' || this.name === 'Subtract' || this.name === 'Multiply' || this.name === 'Division' || this.name === 'Set Precision' || this.name === 'Min' || this.name === 'Max' || this.name === 'Compare') ? ' Result : [NUM]' : ' Result : [STRING]';
        this.outPort = new IntermediatePortModel(outPortName, "OUT", 'left');
        this.addPort(this.outPort);
    }

    initLinks(): void { }

    serialize() {
        return {
            ...super.serialize(),
            name: this.name,
        };
    }

    deserialize(event: DeserializeEvent<this>) {
        super.deserialize(event);
        this.name = event.data.name;
    }

}

