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
    static readonly ENTERPRISE_SERVICE_BUS: string = "EnterpriseServiceBus";
}

export class ConnectorInfo {
    static readonly CONNECTOR_EXPORTER_PROMPT_MESSAGE: string = "Enter Connector Exporter Name...";
    static readonly CONNECTOR_PROMPT_MESSAGE: string = "Enter Connector Name...";
    static readonly CONNECTOR_SERVER_URL: string = "https://store.wso2.com";
    static readonly CONNECTOR_ASSETS_ES210: string = "/store/apis/assets?type=esbconnector";
    static readonly CONNECTOR_ASSETS_ES210_ASC: string = ConnectorInfo.CONNECTOR_ASSETS_ES210 + "&sort=+overview_name";
    static readonly CONNECTOR_ASSETS_ES210_SEARCH: string = ConnectorInfo.CONNECTOR_ASSETS_ES210_ASC + "&q=";
    static readonly DESTINATION_FOLDER: string = "lib";
    static readonly TYPE: string = "synapse/lib";
    static readonly DATA_SERVICE_LABEL: string = "lib";
}
