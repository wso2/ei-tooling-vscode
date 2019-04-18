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

package org.eclipse.lsp4xml.extensions.synapse.contentmodel.completions;

import org.eclipse.lsp4xml.extensions.synapse.utils.Constants;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * Provides snippets for Synapse elements which are configured in configurations.properties file.
 */
public class SnippetProvider {

    private static final Map<String, String> snippets;

    static {
        snippets = new HashMap<>();

        Properties prop = new Properties();
        try(InputStream input = SnippetProvider.class.getClassLoader().getResourceAsStream(Constants.CONFIG_FILE)) {
            if (input != null) {
                prop.load(input);

                for (Enumeration<?> e = prop.propertyNames(); e.hasMoreElements(); ) {
                    String name = (String)e.nextElement();
                    String value = prop.getProperty(name);
                    snippets.put(name, value);
                }
            } else {
                throw new FileNotFoundException("property file not found in the classpath");
            }

        } catch (Exception ex) {
            ex.printStackTrace();

        }
    }

    /**
     * Restricted creating new SnippetProviders by making the constructor private
     */
    private SnippetProvider(){}

    /**
     *
     * @return Map\<SynapseElementName, snippet>
     */
    public static Map<String, String> getSnippets() {
        return snippets;
    }
}
