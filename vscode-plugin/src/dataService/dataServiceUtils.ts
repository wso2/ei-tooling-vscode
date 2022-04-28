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
    static readonly DATA_SERVICES_SERVER: string = "DataServicesServer";
}

export class DataServiceProjectInfo {
    //static readonly ARTIFACT_TYPE: string = "api";
    //static readonly PLACEHOLDER: string = "Select an API Artifact Creation Option...";
    static readonly PROMPT_MESSAGE: string = "Enter Data Service Project name...";
}

export class DataServiceInfo {
    static readonly DESTINATION_FOLDER: string = "dataservice";
    static readonly PROMPT_MESSAGE: string = "Enter Data Service name...";
    static readonly TYPE: string = "service/dataservice";

    static readonly DATA_SERVICE_LABEL: string = "dataservice";
}

