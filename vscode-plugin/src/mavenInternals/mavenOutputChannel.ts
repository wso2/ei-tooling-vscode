/*
Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the "License"); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import {Disposable, window, OutputChannel} from "vscode";

class MavenOutputChannel implements Disposable {
    private readonly channel: OutputChannel = window.createOutputChannel("Maven for Java");
    
    public appendLine(message: any, title?: string): void {
        if (title) {
            const simplifiedTime: string = (new Date()).toISOString().replace(/z|t/gi, " ").trim(); // YYYY-MM-DD HH:mm:ss.sss
            const highlightingTitle: string = `[${title} ${simplifiedTime}]`;
            this.channel.appendLine(highlightingTitle);
        }
        this.channel.appendLine(message);
    }

    public append(message: any): void {
        this.channel.append(message);
    }

    public show(): void {
        this.channel.show();
    }

    public dispose(): void {
        this.channel.dispose();
    }

    public clear(): void {
        this.channel.clear();
    }    
}

export const mavenOutputChannel: MavenOutputChannel = new MavenOutputChannel();
