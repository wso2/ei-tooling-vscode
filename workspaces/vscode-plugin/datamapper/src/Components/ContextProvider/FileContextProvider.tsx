import React from 'react';
import { CustomNodeModel } from '../Nodes/Customs/CustomNodeModel';
import { FileContext } from './FileContext';

type FileContextProviderProps = {
  children: React.ReactNode;
};

const FileContextProvider: React.FC<FileContextProviderProps> = ({ children }) => {
    const [schemaInput, setSchemaInput] = React.useState<any>(null);
    const [schemaOutput, setSchemaOutput] = React.useState<any>(null);
    const [addedNode, setAddedNode] = React.useState<CustomNodeModel[]>([]);
    const [removedNode, setRemovedNode] = React.useState<any>(null);

  return (
    <FileContext.Provider value={{schemaInput,schemaOutput,addedNode,removedNode,setSchemaInput,setSchemaOutput, setAddedNode,setRemovedNode}}>
      {children}
    </FileContext.Provider>
  );
};

export default FileContextProvider;


