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
import { FileContext } from './FileContext';

type FileContextProviderProps = {
  children: React.ReactNode;
};

const FileContextProvider: React.FC<FileContextProviderProps> = ({ children }) => {
  const [schemaInput, setSchemaInput] = React.useState<any>(null);
  const [schemaOutput, setSchemaOutput] = React.useState<any>(null);
  const [addedNode, setAddedNode] = React.useState<CustomNodeModel[]>([]);
  const [removedNode, setRemovedNode] = React.useState<any>(null);
  const [projectName, setProjectName] = React.useState<any>('');

  return (
    <FileContext.Provider value={{ schemaInput, schemaOutput, addedNode, removedNode,  projectName, setSchemaInput, setSchemaOutput, setAddedNode, setRemovedNode, setProjectName }}>
      {children}
    </FileContext.Provider>
  );
};

export default FileContextProvider;
