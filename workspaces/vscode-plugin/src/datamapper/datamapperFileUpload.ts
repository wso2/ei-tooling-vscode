import { writeFile } from "fs";
import toJsonSchema = require("to-json-schema");
import { window } from 'vscode';
import { workspace } from 'vscode';
import { join,dirname } from 'path';
import { parseString } from "xml2js";

export default class datamapperFileUpload {

  public static handleFileUpload(fileContent: string, fileName: string, extension: string, callback: (message: any) => void) {
    var fileContent1: string = "";
    if (extension === 'xml'){
      fileContent1 = this.xml2json(fileContent);
    }
    if (extension === 'json') {
      fileContent1 = fileContent;
    }
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

  public static xml2json(xmlSchema:string){
    var jsonString = "";
    parseString(xmlSchema, (err, result) => {
      if (err) {
        console.error('Failed to parse XML:', err);
        return;
      }
    
      // Convert JavaScript object to JSON string
      jsonString = JSON.stringify(result);
    });
    return jsonString;
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

