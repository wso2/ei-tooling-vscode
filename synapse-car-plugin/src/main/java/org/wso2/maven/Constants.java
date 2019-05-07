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

package org.wso2.maven;

public class Constants {
    static final String ARTIFACTS = "artifacts";
    static final String ARTIFACT = "artifact";
    static final String VERSION = "version";
    static final String TYPE = "type";
    static final String SERVER_ROLE = "serverRole";
    static final String NAME = "name";
    static final String FILE = "file";
    static final String ITEM = "item";
    static final String DEPENDENCY = "dependency";
    static final String INCLUDE = "include";
    static final String RESOURCES = "resources";
    public static final String PRETTY_PRINT_STYLESHEET =
            "<xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0' "
                    + " xmlns:xalan='http://xml.apache.org/xslt' "
                    + " exclude-result-prefixes='xalan'>"
                    + "  <xsl:output method='xml' indent='yes' xalan:indent-amount='4'/>"
                    + "  <xsl:strip-space elements='*'/>"
                    + "  <xsl:template match='/'>"
                    + "    <xsl:apply-templates/>"
                    + "  </xsl:template>"
                    + "  <xsl:template match='node() | @*'>"
                    + "        <xsl:copy>"
                    + "          <xsl:apply-templates select='node() | @*'/>"
                    + "        </xsl:copy>"
                    + "  </xsl:template>"
                    + "</xsl:stylesheet>";

    private Constants() {
    }
}
