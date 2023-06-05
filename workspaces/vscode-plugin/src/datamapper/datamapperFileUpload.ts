import { writeFile } from "fs";
import toJsonSchema = require("to-json-schema");
import { window } from 'vscode';
import { workspace } from 'vscode';
import { join,dirname } from 'path';

export default class datamapperFileUpload {

  public static handleFileUpload(fileContent: string, fileName: string, extension: string, callback: (message: any) => void) {

    var jsonObj = JSON.parse(fileContent);
    var schema = toJsonSchema(jsonObj);
    var schemaJson = JSON.stringify(schema);
    var node: string;
    if (fileName.endsWith('Input')) {
      node = 'Input';
    } else if (fileName.endsWith('Output')) {
      node = 'Output';
    }

    var currentFolder = workspace.workspaceFolders?.[0];
    if (currentFolder) {
      var filePath = join(currentFolder.uri.fsPath, `${fileName}_schema.json`);
      writeFile(filePath, schemaJson, (err) => {
        if (err) {
          window.showErrorMessage("Cant create Json schema");
        } else {
          window.showInformationMessage("Json schema file created");
          if (node === 'Input') {
            callback({ type: 'InputSchema', value: schema });
          } else {
            callback({ type: 'OutputSchema', value: schema });
          }
        }
      })
    } else {
      window.showErrorMessage("No current workspace");
    }
  }

  public static serializingDiagram(fileContent: string){

    var currentFolder = workspace.workspaceFolders?.[0];
    if(currentFolder){
      var filePath = join(currentFolder.uri.fsPath, "data.json");
      writeFile(filePath, fileContent, (err) => {
        if (err) {
          window.showErrorMessage('Unable to save serialized data file.');
        } else {
          window.showInformationMessage('Serialized data file created.',filePath);
        }
      });
    }else{
      console.log("no serialized data stored");
    }
  }

}

