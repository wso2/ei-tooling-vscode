import { Button, FormControl, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import React from 'react';
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

const UploadForm = (props: Props) => {

  const classes = uploadStyles();
  const supportedFileType = ['XML', 'JSON', 'XSD', 'CSV', 'JSON SCHEMA', 'CONNECTOR'];

  const [fileType, setFileType] = React.useState("JSON SCHEMA");
  const [fileName, setFileName] = React.useState(props.title);
  const [file, setFile] = React.useState<File | null>(null);
  const { setSchemaInput, setSchemaOutput } = React.useContext(FileContext);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }

  const handleFileType = (e: SelectChangeEvent) => {
    setFileType(e.target.value);
  }

  const handleFileName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (file) {
      try {
        var filename = fileName + "_" + props.title;
        var fileExtension = file.name.split('.').pop();

        fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onloadend = () => {
          let content = fileReader.result;
          console.log(content);
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

        <InputLabel className={classes.Label}>{props.title} File name : </InputLabel>
        <TextField className={classes.TextField}
          name='fileName' onChange={handleFileName} size="small" />
        <InputLabel className={classes.Label}>Select from file system : </InputLabel>
        <input className={classes.Label} type="file" name='file' onChange={handleFile} />
        <Button className={classes.saveButton} type="submit" variant='contained' disabled={!file}>Save</Button>
      </form>
    </>
  )
}

export default UploadForm