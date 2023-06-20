import React from 'react';
import { CustomNodeModel } from '../Nodes/Customs/CustomNodeModel';

interface Schema {
  $schema?: string;
  inputType?: string;
  id?:string;
  description?: string;
  title?: string;
  type: string | object;
  properties: {
    [key: string]: {
      type: string;
      id?: string;
      description?: string;
    }
  };
}

type FileContextProps = {
  schemaInput: Schema | null;
  schemaOutput: Schema | null;
  addedNode : CustomNodeModel[];
  removedNode : CustomNodeModel | null;
  setSchemaInput: (schemaInput: Schema) => void;
  setSchemaOutput: (schemaOutput: Schema) => void;
  setAddedNode : (addedNode : CustomNodeModel []) => void;
  setRemovedNode : (removedNode : CustomNodeModel) => void;
}

export const FileContext = React.createContext<FileContextProps>({
  schemaInput: null,
  schemaOutput: null,
  addedNode : [],
  removedNode : null,
  setSchemaInput: () => {},
  setSchemaOutput: () => {},
  setAddedNode : () => {},
  setRemovedNode : () => {},
});
