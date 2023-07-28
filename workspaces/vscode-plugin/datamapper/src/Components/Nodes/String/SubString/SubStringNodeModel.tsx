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

import { IntermediatePortModel } from "../../../Port/IntermediatePort/IntermediatePortModel";
import { CustomNodeModel } from "../../Customs/CustomNodeModel";

export class SubStringNodeModel extends CustomNodeModel {
    name: string;
    public inPort1!: IntermediatePortModel;
    public inPort2!: IntermediatePortModel;
    public inPort3!: IntermediatePortModel;
    public outPort!: IntermediatePortModel;

    constructor(options: any = {}) {
        super('sub-string-node', options.name);
        this.name = options.name;
    }


    initPorts(): void {
        const inPort1Name = (this.name === 'IfElse' ? 'CONDITION ' : 'VALUE : [STRING] ');
        const inPort2Name = this.name === 'Replace' ? 'TARGET ' : ((this.name === 'IfElse') ? 'THEN : STRING ' : 'START: [NUM] ');
        const inPort3Name = this.name === 'Replace' ? 'REPLACE WITH ' : ((this.name === 'IfElse') ? 'ELSE : STRING ' : 'LENGTH : [NUM] ');

        this.inPort1 = new IntermediatePortModel(inPort1Name, "IN", 'right');
        this.addPort(this.inPort1);

        this.inPort2 = new IntermediatePortModel(inPort2Name, "IN", 'right');
        this.addPort(this.inPort2);

        this.inPort3 = new IntermediatePortModel(inPort3Name, "IN", 'right');
        this.addPort(this.inPort3);

        this.outPort = new IntermediatePortModel(' Result : [STRING]', "OUT", 'left');
        this.addPort(this.outPort);
    }

    initLinks(): void { }
}

