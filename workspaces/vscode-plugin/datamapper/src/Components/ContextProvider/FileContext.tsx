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
import { CustomNodeModel } from '../Nodes/Customs/CustomNodeModel';

//Declration of JSON schema 
interface Schema {
  $schema?: string;
  inputType?: string;
  id?: string;
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
  addedNode: CustomNodeModel[];
  removedNode: CustomNodeModel | null;
  projectName : String;
  setSchemaInput: (schemaInput: Schema) => void;
  setSchemaOutput: (schemaOutput: Schema) => void;
  setAddedNode: (addedNode: CustomNodeModel[]) => void;
  setRemovedNode: (removedNode: CustomNodeModel) => void;
  setProjectName : (projectName: String) => void;
}

//  Global declaration of states(variables) 
export const FileContext = React.createContext<FileContextProps>({
  schemaInput: null,
  schemaOutput: null,
  addedNode: [],
  removedNode: null,
  projectName : '',
  setSchemaInput: () => { },
  setSchemaOutput: () => { },
  setAddedNode: () => { },
  setRemovedNode: () => { },
  setProjectName: () => { },
});

