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

import {ArchetypeModule} from "../archetype/ArchetypeModule";
import {Runner} from "./mavenRunner";
import * as path from 'path';
import {
    ARCHETYPE_ARTIFACT_ID,
    ARCHETYPE_GROUP_ID,
    ARCHETYPE_JAR, ARCHETYPE_PLUGIN_POM, ARCHETYPE_POM,
    ARCHETYPE_VERSION,
    SYNAPSE_CAR_PLUGIN_ARTIFACT_ID,
    SYNAPSE_CAR_PLUGIN_GROUP_ID,
    SYNAPSE_CAR_PLUGIN_JAR,
    SYNAPSE_CAR_PLUGIN_VERSION
} from "../archetype/archetypeUtils";

export async function executeProjectCreateCommand(newProject: ArchetypeModule.ESBProject, targetLocation: string) {
    let cmd = getMavenArchetypeInstallCommand() + " && " + getMavenGenerateCommand(newProject);
    const projectRootDir: string = path.join(targetLocation, newProject.artifactId);

    let commandRunner: Runner = new Runner();
    commandRunner.runProjectCreateCommand(cmd, [], projectRootDir, targetLocation);
}

export function executeProjectBuildCommand(pathToPom: string) {
    let cmd = getSynapseCarPluginInstallCommand() + " && " + createMavenBuildCommand();
    let commandRunner: Runner = new Runner();
    commandRunner.runProjectBuildCommand(cmd, pathToPom);
}

function getMavenArchetypeInstallCommand(): string {
    let archetypeJar = path.join(__dirname, '..', '..', 'lib', ARCHETYPE_JAR);
    let archetypePom = path.join(__dirname, '..', '..', 'lib', ARCHETYPE_POM);
    return [
        "mvn",
        "install:install-file",
        `-Dfile=${archetypeJar}`,
        `-DgroupId=${ARCHETYPE_GROUP_ID}`,
        `-DartifactId=${ARCHETYPE_ARTIFACT_ID}`,
        `-Dversion=${ARCHETYPE_VERSION}`,
        `-Dpackaging=jar`,
        `-DpomFile=${archetypePom}`
    ].join(" ");
}

function getMavenGenerateCommand(newProject: ArchetypeModule.ESBProject): string {
    return [
        "mvn",
        "archetype:generate",
        `-DarchetypeArtifactId=${newProject.archetypeArtifactId}`,
        `-DarchetypeGroupId=${newProject.archetypeGroupId}`,
        `-DarchetypeVersion=${newProject.archetypeVersion}`,
        `-DgroupId=${newProject.groupId}`,
        `-DartifactId=${newProject.artifactId}`,
        `-DinteractiveMode=false`,
        `-DarchetypeCatalog=internal`
    ].join(" ");
}

function createMavenBuildCommand(): string {
    return [
        "mvn",
        "clean",
        "install"
    ].join(" ");
}

function getSynapseCarPluginInstallCommand() {
    let synapseCarPluginJar = path.join(__dirname, '..', '..', 'lib', SYNAPSE_CAR_PLUGIN_JAR);
    let synapseCarPluginPom = path.join(__dirname, '..', '..', 'lib', ARCHETYPE_PLUGIN_POM);
    return [
        "mvn",
        "install:install-file",
        `-Dfile=${synapseCarPluginJar}`,
        `-DgroupId=${SYNAPSE_CAR_PLUGIN_GROUP_ID}`,
        `-DartifactId=${SYNAPSE_CAR_PLUGIN_ARTIFACT_ID}`,
        `-Dversion=${SYNAPSE_CAR_PLUGIN_VERSION}`,
        `-Dpackaging=maven-plugin`,
        `-DpomFile=${synapseCarPluginPom}`
    ].join(" ");
}
