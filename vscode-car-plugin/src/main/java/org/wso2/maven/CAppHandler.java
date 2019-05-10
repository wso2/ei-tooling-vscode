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

import org.apache.axiom.om.OMElement;
import org.apache.commons.io.FileUtils;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.project.MavenProject;
import org.wso2.maven.Model.AbstractXmlDoc;
import org.wso2.maven.Model.Artifact;
import org.wso2.maven.Model.ArtifactDependency;
import org.wso2.maven.Utils.CAppFileUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import javax.xml.stream.XMLStreamException;

class CAppHandler extends AbstractXmlDoc {

    /*
     * Read /synapse-config/artifact.xml file and create corresponding files in archive directory.
     * */
    void processConfigArtifactXmlFile(File projectBaseDir, String archiveDirectory,
                                      List<ArtifactDependency> dependencies)
            throws IOException, XMLStreamException, MojoExecutionException {

        String configArtifactXmlFileAsString = FileUtils.readFileToString(new File(
                Paths.get(projectBaseDir.getAbsolutePath(), "src", "main", "synapse-config", "artifact.xml")
                        .toString()));

        OMElement artifactsElement = getElement(configArtifactXmlFileAsString);
        List<OMElement> artifactChildElements = getChildElements(artifactsElement, Constants.ARTIFACT);

        for (OMElement artifact : artifactChildElements) {
            // Create an Artifact object to represent the artifact mentioned in artifact.xml file.
            Artifact artifactObject = createArtifactObject(artifact, getAttribute(artifact,
                                                                                  Constants.NAME) + "-" +
                    getAttribute(artifact, Constants.VERSION) + ".xml");

            // Create dependency info from artifacts in artifact.xml file.
            dependencies.add(new ArtifactDependency(artifactObject.getName(), artifactObject.getVersion(),
                                                    artifactObject.getServerRole(), true));

            // generate new folder name and new file name to be put in the archive file.
            String artifactFolderName = artifactObject.getName() + "_" + artifactObject.getVersion();
            String artifactFileName = artifactObject.getName() + "-" + artifactObject.getVersion() + ".xml";

            /*
             * Create content to be put into each artifact's artifact.xml file in archive file and
             * create corresponding artifact.xml in archive file.
             * */
            String artifactDataAsString = createArtifactData(artifactObject);
            CAppFileUtils.createFile(
                    new File(Paths.get(archiveDirectory, artifactFolderName).toString(), "artifact.xml"),
                    artifactDataAsString);


            // Directly copy artifact from ESB project to archive file.
            String copyArtifactFileFrom = Paths.get(projectBaseDir.getAbsolutePath(), "src", "main", "synapse-config",
                                                    getFirstChildWithName(artifact, Constants.FILE).getText())
                    .toString();
            CAppFileUtils.copy(new File(copyArtifactFileFrom),
                               new File(Paths.get(archiveDirectory, artifactFolderName, artifactFileName)
                                                .toString()));

        }
    }

    /*
     * Read /registry-resources/artifact.xml file and create corresponding files in archive directory.
     * */
    void processRegistryResourceArtifactXmlFile(File projectBaseDir, String archiveDirectory,
                                                List<ArtifactDependency> dependencies)
            throws IOException, XMLStreamException, MojoExecutionException {

        String registryArtifactXmlFileAsString = FileUtils.readFileToString(new File(
                Paths.get(projectBaseDir.getAbsolutePath(), "src", "main", "registry-resources", "artifact.xml")
                        .toString()));

        OMElement artifactsElement = getElement(registryArtifactXmlFileAsString);
        List<OMElement> artifactChildElements = getChildElements(artifactsElement, Constants.ARTIFACT);

        for (OMElement artifact : artifactChildElements) {
            // Create an Registry object to represent the registry resource mentioned in artifact.xml file.
            Artifact registryObject = createArtifactObject(
                    artifact, getAttribute(artifact, Constants.NAME) + "-info.xml");

            // Abstract registry resource file name from item element in artifact.xml file
            OMElement itemElement = getFirstChildWithName(artifact, Constants.ITEM);
            String registryResourceFileName = getFirstChildWithName(itemElement, Constants.FILE).getText();

            // Create dependency info from registry resources in artifact.xml file.
            dependencies.add(new ArtifactDependency(registryObject.getName(), registryObject.getVersion(),
                                                    registryObject.getServerRole(), true));

            // generate new folder name to put registry resource info in archive file
            String artifactFolderName = registryObject.getName() + "_" + registryObject.getVersion();

            /*
             * Create data for each artifact's artifact.xml file in archive file.
             * Create corresponding artifact.xml for resource in archive file.
             * */
            String artifactDataAsString = createArtifactData(registryObject);
            CAppFileUtils.createFile(new File(Paths.get(archiveDirectory, artifactFolderName).toString(),
                                              "artifact.xml"), artifactDataAsString);


            // Directly copy registry resource from ESB project to corresponding resources folder in archive file.
            String copyArtifactFileFrom = Paths.get(projectBaseDir.getAbsolutePath(), "src", "main",
                                                    "registry-resources", registryResourceFileName).toString();
            CAppFileUtils.copy(new File(copyArtifactFileFrom),
                               new File(Paths.get(archiveDirectory, artifactFolderName, "resources",
                                                  registryResourceFileName).toString()));

            // Create resource-info.xml file in archive file.
            String registryResourceData = createRegistryResourceData(getFirstChildWithName(artifact, Constants.ITEM));
            CAppFileUtils.createFile(new File(Paths.get(archiveDirectory, artifactFolderName).toString(),
                                              registryObject.getName() + "-info.xml"), registryResourceData);
        }
    }

    private Artifact createArtifactObject(OMElement artifact, String artifactFileLocation) {
        Artifact artifactObject = new Artifact();
        artifactObject.setName(getAttribute(artifact, Constants.NAME));
        artifactObject.setType(getAttribute(artifact, Constants.TYPE));
        artifactObject.setVersion(getAttribute(artifact, Constants.VERSION));
        artifactObject.setServerRole(getAttribute(artifact, Constants.SERVER_ROLE));
        artifactObject.setFile(artifactFileLocation);

        return artifactObject;
    }

    private String createArtifactData(Artifact artifact) throws MojoExecutionException {
        OMElement artifactElement = getElement(Constants.ARTIFACT, "");
        artifactElement = addAttribute(artifactElement, Constants.NAME, artifact.getName());
        artifactElement = addAttribute(artifactElement, Constants.VERSION, artifact.getVersion());
        artifactElement = addAttribute(artifactElement, Constants.TYPE, artifact.getType());
        artifactElement = addAttribute(artifactElement, Constants.SERVER_ROLE, artifact.getServerRole());
        OMElement fileChildElement = getElement(Constants.FILE, artifact.getFile());
        artifactElement.addChild(fileChildElement);

        return serialize(artifactElement);
    }

    private String createRegistryResourceData(OMElement item) throws MojoExecutionException {
        OMElement resourcesElement = getElement(Constants.RESOURCES, "");
        resourcesElement.addChild(item);
        return serialize(resourcesElement);
    }

    /*
     * Create artifacts.xml file including meta data of each artifact in WSO2-ESB project.
     * */
    void createDependencyArtifactsXmlFile(String archiveDirectory, List<ArtifactDependency> dependencies,
                                          MavenProject project)
            throws MojoExecutionException, IOException {
        /*
         * Create artifacts.xml file content.
         * Create artifact element.
         * Create corresponding dependency elements.
         * */
        OMElement artifactsElement = getElement(Constants.ARTIFACTS, "");
        OMElement artifactElement = getElement(Constants.ARTIFACT, "");

        artifactElement = addAttribute(artifactElement, Constants.NAME, getCAppName(project));
        artifactElement = addAttribute(artifactElement, Constants.VERSION, project.getVersion());
        artifactElement = addAttribute(artifactElement, Constants.TYPE, "carbon/application");

        for (ArtifactDependency dependency : dependencies) {
            OMElement dependencyElement = getElement(Constants.DEPENDENCY, "");
            dependencyElement = addAttribute(dependencyElement, Constants.ARTIFACT, dependency.getArtifact());
            dependencyElement = addAttribute(dependencyElement, Constants.VERSION, dependency.getVersion());
            dependencyElement = addAttribute(dependencyElement, Constants.INCLUDE, dependency.getInclude().toString());
            if (dependency.getServerRole() != null) {
                dependencyElement = addAttribute(dependencyElement, Constants.SERVER_ROLE, dependency.getServerRole());
            }
            artifactElement.addChild(dependencyElement);
        }
        artifactsElement.addChild(artifactElement);

        // Create artifacts.xml file in archive file.
        String artifactsXmlFileDataAsString = serialize(artifactsElement);
        CAppFileUtils.createFile(new File(archiveDirectory, "artifacts.xml"), artifactsXmlFileDataAsString);
    }

    private String getCAppName(MavenProject project) {
        return project.getArtifactId() + "CompositeApplication_" + project.getVersion();
    }
}
