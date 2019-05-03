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

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.project.MavenProject;
import org.wso2.maven.Model.ArtifactDependency;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static org.wso2.maven.Utils.CAppFileUtils.createDirectory;

/**
 * Goal which touches a timestamp file.
 *
 * @goal car
 * @phase package
 */
@Mojo(name = "WSO2ESBDeployableArchive")
public class CARMojo extends AbstractMojo {

    /**
     * Location archiveLocation folder
     *
     * @parameter expression="${project.basedir}"
     */
    private File projectBaseDir;

    /**
     * Location archiveLocation folder
     *
     * @parameter expression="${project.build.directory}"
     */
    private File archiveLocation;

    /**
     * finalName to use for the generated capp project if the user wants to override the default name
     *
     * @parameter
     */
    private String finalName;

    /**
     * @parameter default-value="${project}"
     */
    private MavenProject project;

    /**
     * A classifier for the build final name
     *
     * @parameter
     */
    private String classifier;

    public void execute() throws MojoExecutionException {
        appendLogs();
        // Create CApp
        try {
            // Create directory to be compressed.
            String archiveDirectory = getArchiveFile("").getAbsolutePath();
            boolean createdArchiveDirectory = createDirectory(archiveDirectory);

            if (createdArchiveDirectory) {
                CAppHandler cAppHandler = new CAppHandler();
                List<ArtifactDependency> dependencies = new ArrayList<>();

                cAppHandler.processConfigArtifactXmlFile(projectBaseDir, archiveDirectory, dependencies);
                cAppHandler.processRegistryResourceArtifactXmlFile(projectBaseDir, archiveDirectory, dependencies);
                cAppHandler.createDependencyArtifactsXmlFile(archiveDirectory, dependencies, project);

                File fileToZip = new File(archiveDirectory);
                zipFolder(fileToZip.getPath(), getArchiveFile(".car").getPath());

                recursiveDelete(fileToZip);

            } else {
                getLog().error("Could not create corresponding archive directory.");
            }
        } catch (Exception e) {
            getLog().error(e);
        }
    }

    /**
     * Append log of BUILD process when building started.
     */
    private void appendLogs() {
        getLog().info("------------------------------------------------------------------------");
        getLog().info("Building Synapse Config Project");
        getLog().info("------------------------------------------------------------------------");
    }

    private File getArchiveFile(String fileExtension) {
        File archiveFile;
        if (finalName != null && !finalName.trim().equals("")) {
            archiveFile = new File(archiveLocation, finalName + fileExtension);
            return archiveFile;
        }
        String archiveFilename = project.getArtifactId() + "_" + project.getVersion() +
                (classifier != null ? "-" + classifier : "") + fileExtension;
        archiveFile = new File(archiveLocation, archiveFilename);

        return archiveFile;
    }

    private void zipFolder(String srcFolder, String destZipFile) {
        try {
            FileOutputStream fileWriter = new FileOutputStream(destZipFile);
            ZipOutputStream zip = new ZipOutputStream(fileWriter);

            addFolderContentsToZip(srcFolder, zip);

            zip.flush();
            zip.close();
        } catch (Exception ex) {
            getLog().error("Error occurred while creating CAR file. " + ex);
        }
    }

    private void addFolderContentsToZip(String srcFolder, ZipOutputStream zip) {
        File folder = new File(srcFolder);
        String[] fileList = folder.list();
        try {
            if (fileList != null) {
                int i = 0;
                while (true) {
                    if (fileList.length == i) break;
                    if (new File(folder, fileList[i]).isDirectory()) {
                        zip.putNextEntry(new ZipEntry(fileList[i] + "/"));
                        zip.closeEntry();
                    }
                    addToZip("", srcFolder + "/" + fileList[i], zip);
                    i++;
                }
            }
        } catch (Exception ex) {
            getLog().error("Error occurred while creating CAR file. " + ex);
        }
    }

    private void addToZip(String path, String srcFile, ZipOutputStream zip) {
        File folder = new File(srcFile);
        if (folder.isDirectory()) {
            addFolderToZip(path, srcFile, zip);
        } else {
            // Transfer bytes from in to out
            byte[] buf = new byte[1024];
            int len;
            try {
                FileInputStream in = new FileInputStream(srcFile);
                if (path.trim().equals("")) {
                    zip.putNextEntry(new ZipEntry(folder.getName()));
                } else {
                    zip.putNextEntry(new ZipEntry(path + "/" + folder.getName()));
                }
                while ((len = in.read(buf)) > 0) {
                    zip.write(buf, 0, len);
                }
                in.close();
            } catch (Exception ex) {
                getLog().error("Error occurred while creating CAR file. " + ex);
            }
        }
    }

    private void addFolderToZip(String path, String srcFolder, ZipOutputStream zip) {
        File folder = new File(srcFolder);
        String[] fileList = folder.list();
        try {
            if (fileList != null) {
                int i = 0;
                while (true) {
                    if (fileList.length == i) break;
                    String newPath = folder.getName();
                    if (!path.equalsIgnoreCase("")) {
                        newPath = path + "/" + newPath;
                    }
                    if (new File(folder, fileList[i]).isDirectory()) {
                        zip.putNextEntry(new ZipEntry(newPath + "/" + fileList[i] + "/"));
                    }
                    addToZip(newPath, srcFolder + "/" + fileList[i], zip);
                    i++;
                }
            }
        } catch (Exception ex) {
            getLog().error("Error occurred while creating CAR file. " + ex);
        }
    }

    private void recursiveDelete(File file) {
        //to end the recursive loop
        if (!file.exists()) {
            return;
        }

        //if directory, go inside and call recursively
        if (file.isDirectory()) {
            for (File f : file.listFiles()) {
                //call recursively
                recursiveDelete(f);
            }
        }
        //call delete to delete files and empty directory
        file.delete();
    }
}
