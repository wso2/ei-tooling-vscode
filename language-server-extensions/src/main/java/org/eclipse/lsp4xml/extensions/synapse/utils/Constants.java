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

package org.eclipse.lsp4xml.extensions.synapse.utils;

public class Constants {
    /** location of Synapse schema files */
    public static final String SCHEMA_LOCATION;

    /** namespace of Synapse */
    public static final String SYNAPSE_NAMESPACE = "http://ws.apache.org/ns/synapse";

    /** name of the config file */
    public static final String CONFIG_FILE = "configuration.properties";

    /** Synapse directory path */
    public static final String SYNAPSE_CONFIG_PROJECT_PATH = "/src/main/synapse-config/";

    /** Synapse sequence element tag value*/
    public static final String SEQUENCE = "sequence";

    /** Synapse endpoint element tag value*/
    public static final String ENDPOINT = "endpoint";

    /** sequence folder name in Synapse project */
    public static final String SEQUENCE_FOLDER_NAME = "sequences";

    /** endpoint folder name in Synapse project */
    public static final String INBOUND_ENDPOINT_FOLDER_NAME = "inbound-endpoints";


    private Constants(){};

    static {
        SCHEMA_LOCATION = System.getProperty("SCHEMA_PATH");
    }


}
