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
import { DefaultConfig } from "../Visitors/default";
export class SimpleBBox {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.r = 0;
        this.w = 0;
        this.rw = 0;
        this.lw = 0;
        this.h = 0;
        this.rx = 0;
        this.ry = 0;
        this.cx = 0;
        this.cy = 0;
        this.length = 0;
        this.label = "";
        this.labelWidth = 0;
        this.offsetFromBottom = DefaultConfig.offSet;
        this.offsetFromTop = DefaultConfig.offSet;
        this.x1 = 0;
        this.x2 = 0;
        this.y1 = 0;
        this.y2 = 0;
    }
}
//# sourceMappingURL=simple-bbox.js.map