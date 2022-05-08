/*
Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

'use strict';

export class ServerRoleInfo {
    static readonly ENTERPRISE_INTEGRATOR: string = "EnterpriseIntegrator";
}

export class MediatorProjectInfo {
    static readonly PROJECT_PROMPT_MESSAGE: string = "Enter Mediator Project name...";
    static readonly PACKAGE_PROMPT_MESSAGE: string = "Enter Package name...";
    static readonly CLASS_PROMPT_MESSAGE: string = "Enter Class name...";
    static readonly TYPE: string = "lib/synapse/mediator";
    static readonly FOLDER: string = "mediator"
}


