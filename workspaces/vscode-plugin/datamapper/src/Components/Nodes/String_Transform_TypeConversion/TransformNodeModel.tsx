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

import { IntermediatePortModel } from "../../Port/IntermediatePort/IntermediatePortModel";
import { CustomNodeModel } from "../Customs/CustomNodeModel";

export class TransformNodeModel extends CustomNodeModel {
    name: string;
    public inPort!: IntermediatePortModel;
    public outPort!: IntermediatePortModel;

    constructor(options: any = {}) {
        super('transform-node', options.name);
        this.name = options.name;
    }


    initPorts(): void {
        const inPortName = this.name === 'ToString' ? "IN : [BOOL/NUM] " :
            ((this.name === 'Ceiling' || this.name === 'Floor' || this.name === 'Round' || this.name === 'AbsoluteValue') ? "IN : [NUM] " : "IN : [STRING] ");
        this.inPort = new IntermediatePortModel(inPortName, "IN", 'right');
        this.addPort(this.inPort);

        const outPortName = (this.name === 'ToString' || this.name === 'Trim' || this.name === 'UpperCase' || this.name === 'LowerCase') ? "RESULT : STRING " : "RESULT : [NUM/BOOL] ";
        this.outPort = new IntermediatePortModel(outPortName, "OUT", 'left');
        this.addPort(this.outPort);
    }

    initLinks(): void { }
}
