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

import { Uri, window, workspace, WorkspaceEdit } from "vscode";
import * as fse from "fs-extra";
import * as path from 'path';
import { XMLSerializer as XMLSerializer } from 'xmldom';
import { SubDirectories, ESBArtifactPath, Common } from "../artifacts/artifactUtils";
import { Utils } from "../utils/Utils";
import { MediatorProjectInfo } from "./mediarorProjectUtils";

let DOM = require('xmldom').DOMParser;
var fs = require('fs');

export namespace MediatorProjectModule {

    const dirName = __dirname;
    const SRC = ESBArtifactPath.SRC;
    const MAIN = ESBArtifactPath.MAIN;
    const POM = Common.POM;
    const CONF = Common.CONF;
    const TEMPLATES = Common.TEMPLATES;
    const POM_FILE = Common.POM_FILE;
    const PROJECT_FILE = Common.PROJECT_FILE;
    const MODULE = Common.MODULE;
    const MODULES = Common.MODULES;

    export async function createProject(rootDirectory: string, projectName: string, packageName: string,
        version: string, serverRole: string, className?: string) {

        //check for composite pom.xml
        let compositePomFilePath: string = path.join(Utils.getDirectoryFromDirectoryType(SubDirectories.COMPOSITE_EXPORTER, rootDirectory), POM_FILE);
        if (!fse.existsSync(compositePomFilePath)) {
            window.showErrorMessage("Composite pom.xml is missing, Mediator Project creation aborted...");
            return;
        }

        //check whether project name already exists
        let mediatorProjectDirectory: string = path.join(rootDirectory, projectName);
        if (fse.existsSync(mediatorProjectDirectory)) {
            window.showErrorMessage("Mediator project name already exists!");
            return;
        }

        //create directory structure
        let javaFilePath: string = path.join(rootDirectory, projectName, SRC, MAIN, "java");
        if (typeof className !== "undefined") {
            let packageSubdirectories: string[] = packageName.split(".");
            let packageSubDirPath: string = packageSubdirectories.join(path.sep);
            javaFilePath = path.join(javaFilePath, packageSubDirPath);
        }

        fs.mkdirSync(javaFilePath, { recursive: true });

        let rootPomFilePath: string = path.join(rootDirectory, POM_FILE);
        let mediatorProjectPomFilePath: string = path.join(rootDirectory, projectName, POM_FILE);
        let project: Utils.Project = Utils.getProjectInfoFromPOM(rootPomFilePath);

        //add new pom.xml
        let templatePomFilePath: string = path.join(dirName, "..", "..", TEMPLATES, POM, "MediatorProjectPom.xml");
        const buff: Buffer = fse.readFileSync(templatePomFilePath);
        let pomXmlDoc = new DOM().parseFromString(buff.toString(), "text/xml");

        let artifactIds = pomXmlDoc.getElementsByTagName("artifactId");
        let groupIds = pomXmlDoc.getElementsByTagName("groupId");
        let versions = pomXmlDoc.getElementsByTagName("version");
        let childProjectName = pomXmlDoc.getElementsByTagName("name")[0];
        let childProjectDescription = pomXmlDoc.getElementsByTagName("description")[0];
        let bundleSymbolicName = pomXmlDoc.getElementsByTagName("Bundle-SymbolicName")[0];
        let bundleName = pomXmlDoc.getElementsByTagName("Bundle-Name")[0];
        let exportPackage = pomXmlDoc.getElementsByTagName("Export-Package")[0];

        //parent
        artifactIds[0].textContent = project.artifactId;
        groupIds[0].textContent = project.groupId;
        versions[0].textContent = project.version;

        //child
        artifactIds[1].textContent = projectName;
        groupIds[1].textContent = packageName;
        versions[1].textContent = version;
        childProjectName.textContent = projectName;
        childProjectDescription.textContent = projectName;
        bundleSymbolicName.textContent = projectName;
        bundleName.textContent = projectName;
        exportPackage.textContent = packageName;

        Utils.createXmlFile(mediatorProjectPomFilePath, pomXmlDoc);

        //add new .project file
        let templateProjNatureFilePath: string = path.join(dirName, "..", "..", TEMPLATES, CONF, "mediatorProject.xml");
        const buf: Buffer = fse.readFileSync(templateProjNatureFilePath);
        let projectNature = new DOM().parseFromString(buf.toString(), "text/xml");

        let name = projectNature.getElementsByTagName("name")[0];
        name.textContent = projectName.trim();

        let projectNatureFilePath: string = path.join(rootDirectory, projectName, PROJECT_FILE);
        Utils.createXmlFile(projectNatureFilePath, projectNature);

        //add new .classpath file
        let templateclassPathFilePath: string = path.join(dirName, "..", "..", TEMPLATES, CONF, "mediatorProjectClassPath.xml");
        const buffer: Buffer = fse.readFileSync(templateclassPathFilePath);
        let classPath = new DOM().parseFromString(buffer.toString(), "text/xml");

        let classPathFilePath: string = path.join(rootDirectory, projectName, ".classpath");
        Utils.createXmlFile(classPathFilePath, classPath);

        //add mediatorProject module to root pom
        if (!fse.existsSync(rootPomFilePath)) {
            window.showErrorMessage("No root pom.xml found...!");
            return;
        }
        const rootPomBuffer: Buffer = fse.readFileSync(rootPomFilePath);
        let rootPomXmlDoc = new DOM().parseFromString(rootPomBuffer.toString(), "text/xml");
        let modules = rootPomXmlDoc.getElementsByTagName(MODULES)[0];
        let firstModule = modules.getElementsByTagName(MODULE);
        let mediatorProjectChild = rootPomXmlDoc.createElement(MODULE);
        mediatorProjectChild.textContent = projectName;

        if (firstModule.length === 0) {
            modules.appendChild(mediatorProjectChild);
        }
        else if (firstModule.length > 0) {
            rootPomXmlDoc.insertBefore(mediatorProjectChild, firstModule[0]);
        }
        fse.writeFileSync(rootPomFilePath, new XMLSerializer().serializeToString(rootPomXmlDoc));

        //update composite pom
        let compositePomDirectory: string = Utils.getDirectoryFromDirectoryType(SubDirectories.COMPOSITE_EXPORTER, rootDirectory);
        Utils.updateCompositePomXml(compositePomDirectory, projectName, MediatorProjectInfo.TYPE, serverRole, packageName, version);

        //no java class is created
        if (typeof className === "undefined") return;

        //create sample java class
        let sampleJavaClassfilePath: string = path.join(javaFilePath, className + ".java");

        const data: string =
            `package ${packageName};
            
            import org.apache.synapse.MessageContext; 
            import org.apache.synapse.mediators.AbstractMediator;
        
            public class ${className} extends AbstractMediator {
        
                public boolean mediate(MessageContext context) { 
                    // TODO Implement your mediation logic here 
                    return true;
                }
            }`;

        let fileUri: Uri = Uri.file(sampleJavaClassfilePath);
        let edit = new WorkspaceEdit();
        edit.createFile(fileUri);
        workspace.applyEdit(edit);
        fse.writeFileSync(fileUri.fsPath, data);

        // Open and show newly created java file in the editor.
        workspace.openTextDocument(fileUri).then(doc => window.showTextDocument(doc));

    }

    export function safeDeleteMediatorProjectDetails(filePath: string, rootDirectory: string) {

        let extensionSplit: string[] = filePath.split(".");
        let fileExtension: string = extensionSplit[extensionSplit.length - 1].trim();

        //chech whether a java file was deleted
        if (fileExtension === "java") {
            //detele project related details if there are any

            //get package name
            let parentDirectory: string = path.join(filePath, "..");
            let splitRegex: string = `java${path.sep}`;
            let pathSplit: string[] = parentDirectory.split(splitRegex);
            let packageDirectory: string = pathSplit[pathSplit.length - 1];
            let packageNameArray: string[] = packageDirectory.split(path.sep);
            let packageName: string = packageNameArray.join(".");

            //get project name
            splitRegex = `${path.sep}src`;
            let projectDirectory: string = filePath.split(splitRegex)[0];
            let projectDirectoryArray: string[] = projectDirectory.split(path.sep);
            let projectName: string = projectDirectoryArray[projectDirectoryArray.length - 1].trim();

            //delete mediator project details from composite pom
            Utils.deleteArtifactFromPomXml(projectName, projectName, rootDirectory, packageName);

        }
    }
}