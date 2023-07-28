/**
 * Copyright (c) 2023, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

import React from 'react';
import { Button, FormControl, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { uploadStyles } from './styles';
import { FileContext } from './../ContextProvider/FileContext';

interface Props {
  title: string;
}

interface vscode {
  postMessage(message: any): void;
}

declare const vscode: vscode;
let fileReader: FileReader;

/* File upload component. Project name given during configuration is passed to store the input and output files in that name.
Schema input and output state variables are updated with the recently uploaded file contents.*/
const UploadForm = (props: Props) => {

  const classes = uploadStyles();
  const supportedFileType = ['XML', 'JSON', 'XSD', 'CSV', 'JSON SCHEMA', 'CONNECTOR'];

  const [fileType, setFileType] = React.useState("JSON SCHEMA");
  const [file, setFile] = React.useState<File | null>(null);
  const { setSchemaInput, setSchemaOutput,projectName } = React.useContext(FileContext);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }

  const handleFileType = (e: SelectChangeEvent) => {
    setFileType(e.target.value);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (file) {
      try {
        var filename = projectName + "_" + props.title;
        var fileExtension = file.name.split('.').pop();

        fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onloadend = () => {
          let content = fileReader.result; 
          vscode.postMessage({
            command: 'fileUpload', fileName: filename,
            fileContent: content, extension: fileExtension
          });
        }
        window.addEventListener('message', (e) => {
          if (e.data.type === 'InputSchema') {
            setSchemaInput(e.data.value);
          } else if (e.data.type === 'OutputSchema') {
            setSchemaOutput(e.data.value);
          }
        });
        vscode.postMessage({ command: 'success_alert', text: 'File Uploaded successfully' });
      } catch (error) {
        vscode.postMessage({ command: 'fail_alert', text: 'Error, Cant upload file' });
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel className={classes.Label} >Resource Type : </FormLabel>
          <Select value={fileType} onChange={handleFileType} className={classes.Select} >
            {
              supportedFileType.map((type, index) =>
                (<MenuItem className={classes.Label} key={index} value={type}>{type}</MenuItem>))
            }
          </Select>
        </FormControl>
        <InputLabel className={classes.Label}>Select from file system : </InputLabel>
        <input className={classes.Label} type="file" name='file' onChange={handleFile} />
        <Button className={classes.saveButton} type="submit" variant='contained' disabled={!file}>Save</Button>
      </form>
    </>
  )
}

export default UploadForm;
