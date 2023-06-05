import React from 'react';
import { FileContext } from '../ContextProvider/FileContext';
import { DataMapperNodeModel } from '../Nodes/DataMapperNodes/DataMapperNodeModel';
import { CustomNodeModel } from '../Nodes/Customs/CustomNodeModel';
import DataMapperDiagram from './DataMapperDiagram';

const NodeManager = () => {
    const { schemaInput, schemaOutput } = React.useContext(FileContext);
    const {setAddedNode,setRemovedNode} = React.useContext(FileContext);
    let InputDataMapper: CustomNodeModel,OutputDataMapper:CustomNodeModel;

    React.useEffect(() => {
        const newNodes : CustomNodeModel[]= [];
        if (schemaInput) {
            InputDataMapper = new DataMapperNodeModel(schemaInput.properties, { name: 'Input'});
            InputDataMapper.setPosition(100, 50);
            newNodes.push(InputDataMapper);
            setAddedNode(newNodes);
        }
    }, [schemaInput]);

    React.useEffect(() => {
        const newNodes : CustomNodeModel[]= [];
        if (schemaOutput) {
            OutputDataMapper = new DataMapperNodeModel(schemaOutput.properties, { name: 'Output'});
            OutputDataMapper.setPosition(800, 50);
            newNodes.push(OutputDataMapper);
            setAddedNode(newNodes);
        } 
    }, [schemaOutput]);

    return (<DataMapperDiagram />);
};

export default NodeManager;