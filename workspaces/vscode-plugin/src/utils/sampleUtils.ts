import * as vscode from 'vscode';
const fs = require('fs');
const path = require('path');
import * as admzip from 'adm-zip';
export namespace sampleUtils {

    export function createSample(sampleType: string, sampleName: string) {
        const settings: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('wso2');
        const workspace = String(settings.get('workspace'));
        const destFolder = workspace + "/" + sampleName;
        const regEx = new RegExp('IS_SAMPLE', "g");
        const versionRegex = new RegExp('<version>5.2.27</version>', "g");
        fs.mkdirSync(destFolder);
        const srcFolder = path.join((global as any).pluginPath, 'resources', 'Samples', sampleType.replace(/ /g, ''), 'IS_SAMPLE.zip');

        const zip = new admzip(srcFolder);
        const zipEntries = zip.getEntries();

        for (const zipEntry of zipEntries) {
            if (!zipEntry.isDirectory) {
                zip.readAsText(zipEntry);
                // read file content to a variable  
                var data = zipEntry.getData().toString('utf8');
                // replace the string 'IS_SAMPLE' with the sample name
                data = data.replace(regEx, sampleName);
                if (zipEntry.entryName.endsWith('pom.xml')) {
                    data = data.replace(versionRegex, '<version>5.2.41</version>');
                }
                // remove root folder name and placeholder from the path
                const filepath = zipEntry.entryName.substring(10).replace(regEx, sampleName);
                fs.writeFileSync(destFolder + '/' + filepath, data);
            } else {
                if (zipEntry.entryName === 'IS_SAMPLE/') {
                    // skip root folder
                    continue;
                }
                //create a folder in the destination folder 
                fs.mkdirSync(destFolder + '/' + zipEntry.entryName.substring(10).replace(regEx, sampleName));
            }
        }
    }
}