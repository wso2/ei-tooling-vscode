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

export class SplitNodeModel extends CustomNodeModel {
    name: string;
    public outPort1!: IntermediatePortModel;
    public outPort2!: IntermediatePortModel;
    public inPort!: IntermediatePortModel;

    constructor(options: any = {}) {
        super('split-node', options.name);
        this.name = options.name;
    }

    initPorts(): void {
        this.outPort1 = new IntermediatePortModel(" Result_1 : [STRING]", "OUT", 'left');
        this.addPort(this.outPort1);

        this.outPort2 = new IntermediatePortModel(" Result_2 : [STRING]", "OUT", 'left');
        this.addPort(this.outPort2);

        this.inPort = new IntermediatePortModel(' Result : [STRING]', "IN", 'right');
        this.addPort(this.inPort);
    }

    initLinks(): void { }
}
