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

package org.eclipse.lemminx.extensions.synapse.definition.utils;

/**
 * Definition key store.
 */
public enum DefinitionSource {

    SEQUENCE("sequence", "key", "name"),
    ENDPOINT("endpoint", "key", "name");

    private String key;
    private String from;
    private String to;

    DefinitionSource(String key, String from, String to) {
        this.key = key;
        this.from = from;
        this.to = to;
    }

    public String getKey() {
        return this.key;
    }

    public String getFrom() {
        return this.from;
    }

    public String getTo() {
        return this.to;
    }
}
