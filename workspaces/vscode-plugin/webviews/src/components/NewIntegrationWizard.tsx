import {TextField, Button, Stack, Checkbox, FormGroup, FormControlLabel} from "@mui/material";
import React, { useState } from 'react';

export const NewIntegrationWizard = (props: any) => {
    const [groupId, setGroupId] = useState("com.example");
    const [artifactId, setArtifactId] = useState("example");
    const [enableEsbConfigs, setEnableEsbConfigs] = useState(false);
    const [configsProjectName, setConfigsProjectName] = useState("exampleConfigs");
    const [enableComposite, setEnableComposite] = useState(false);
    const [compositeProjectName, setCompositeProjectName] = useState("exampleCompositeExporter");
    const [enableRegistry, setEnableRegistry] = useState(false);
    const [registryProjectName, setRegistryProjectName] = useState("exampleRegistryResource");
    const [enableConenctor, setEnableConnector] = useState(false);
    const [connectorProjectName, setConnectorProjectName] = useState("exampleConnectorExporter");
    const [enableMediator, setEnableMediator] = useState(false);
    const [mediatorProjectName, setMediatorProjectName] = useState("exampleClassMediator");
    const [classGroupId, setCalssGroupId] = useState("com.example");
    const [className, setClassName] = useState("SampleClassMediator");
    const [enableDataService, setEnableDataService] = useState(false);
    const [dataServiceProjectName, setdataServiceProjectName] = useState("exampleDataService");
    const [version, setVersion] = useState("1.0.0-SNAPSHOT");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    let artifactIdRegex = /^[a-zA-Z0-9_-]+$/;
    let groupIdRegex = /^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*$/;

    const handleArtifactIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setArtifactId(value);
        setError(false);
        const folders = workspaceFolders.split(',') as string[];
        if(!artifactIdRegex.test(value)){
            setError(true);
            setErrorMessage('Enter a valid artifact id');
            return;
        }
        folders.forEach(element => {
            if (element === value) {
                setError(true);
                setErrorMessage('Project with the name ' + value + ' already exists');
                return;
            }
        });
        setConfigsProjectName(value + 'Configs');
        setCompositeProjectName(value + 'CompositeExporter')
        setRegistryProjectName(value + 'RegistryResource');
        setMediatorProjectName(value + 'ClassMediator');
        setdataServiceProjectName(value + 'DataService');
        setConnectorProjectName(value + 'ConnectorExporter');
    };
    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        vscodeReference.postMessage({
            "command": "CreateNewIntegrationProject",
            "groupID": {groupId}.groupId,
            "artifactID": {artifactId}.artifactId,
            "version": {version}.version,
            "enableEsbConfigs": {enableEsbConfigs}.enableEsbConfigs,
            "configsProjectName": {configsProjectName}.configsProjectName,
            "enableComposite": {enableComposite}.enableComposite,
            "compositeProjectName": {compositeProjectName}.compositeProjectName,
            "enableRegistry": {enableRegistry}.enableRegistry,
            "registryProjectName": {registryProjectName}.registryProjectName,
            "enableConnector": {enableConenctor}.enableConenctor,
            "connectorProjectName": {connectorProjectName}.connectorProjectName,
            "enableMediator": {enableMediator}.enableMediator,
            "mediatorProjectName": {mediatorProjectName}.mediatorProjectName,
            "classGroupId": {classGroupId}.classGroupId,
            "className": {className}.className,
            "enableDataService": {enableDataService}.enableDataService,
            "dataServiceProjectName": {dataServiceProjectName}.dataServiceProjectName
        });
    };
    const configProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfigsProjectName(event.target.value);
    };
    const compositeProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCompositeProjectName(event.target.value);
    };
    const registryProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRegistryProjectName(event.target.value);
    };
    const mediatorProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMediatorProjectName(event.target.value);
    };
    const classGroupIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCalssGroupId(event.target.value);
    };
    const classNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClassName(event.target.value);
    };
    const dataServiceNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setdataServiceProjectName(event.target.value);
    };
    const connectorNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConnectorProjectName(event.target.value);
    };

    return (
        <>
            <h3>Create New Integration Project</h3>
            <form noValidate>
                <Stack spacing={2} width={400}>
                    <TextField label="Group Id" required onChange={(e) => setGroupId(e.target.value)}
                        value={groupId} size="small"
                        error={!groupIdRegex.test(groupId)} helperText="Enter a valid group id"
                    />
                    <TextField label="Artifact Id" required onChange={handleArtifactIdChange}
                        value={artifactId} error={error} size="small"
                        helperText={error ? errorMessage : ""}
                    />
                    <TextField label="Version" required onChange={(e) => setVersion(e.target.value)}
                        size="small" value={version}
                    />
                    <FormControlLabel control={<Checkbox size="small" checked={enableEsbConfigs} 
                        onChange={(e) => setEnableEsbConfigs(e.target.checked)}/>} 
                        label="Create ESB Configs Project"/>
                    {enableEsbConfigs && (
                        <TextField size="small" label="ESB Configs Project Name" 
                        value={configsProjectName} onChange={configProjectNameChange}/>
                    )}
                    <FormControlLabel control={<Checkbox size="small" checked={enableComposite} 
                        onChange={(e) => setEnableComposite(e.target.checked)}/>} 
                        label="Create Composite Exporter Project" />
                    {enableComposite && (
                        <TextField size="small" label="Composite Exporter Project Name" 
                        value={compositeProjectName} onChange={compositeProjectNameChange}/>
                    )}
                    <FormControlLabel control={<Checkbox size="small" checked={enableRegistry} 
                        onChange={(e) => setEnableRegistry(e.target.checked)}/>} 
                        label="Create Registry Resource Project" />
                    {enableRegistry && (
                        <TextField size="small" label="Registry Resource Project Name" 
                        value={registryProjectName} onChange={registryProjectNameChange}/>
                    )}
                    <FormControlLabel control={<Checkbox size="small" checked={enableConenctor} 
                        onChange={(e) => setEnableConnector(e.target.checked)}/>} 
                        label="Create Connector Exporter Project" />
                    {enableConenctor && (
                        <TextField size="small" label="Connector Exporter Project Name" 
                        value={connectorProjectName} onChange={connectorNameChange}/>
                    )}
                    <FormControlLabel control={<Checkbox size="small" checked={enableMediator} 
                        onChange={(e) => setEnableMediator(e.target.checked)}/>} 
                        label="Create Class Mediator Project" />
                    {enableMediator && (
                        <TextField size="small" label="Class Mediator Project Name"
                        value={mediatorProjectName} onChange={mediatorProjectNameChange}/>
                    )}
                    {enableMediator && (
                        <TextField size="small" label="Class Mediator Group ID"
                        value={classGroupId} onChange={classGroupIdChange}/>
                    )}
                    {enableMediator && (
                        <TextField size="small" label="Class Mediator Group ID"
                        value={className} onChange={classNameChange}/>
                    )}
                    <FormControlLabel control={<Checkbox size="small" checked={enableDataService}
                        onChange={(e) => setEnableDataService(e.target.checked)}/>}
                        label="Create Data Service Project" />
                    {enableDataService && (
                        <TextField size="small" label="Data Service Project Name"
                        value={dataServiceProjectName} onChange={dataServiceNameChange}/>
                    )}
                    <Button size="small" type="submit" variant="contained" color="primary" onClick={handleSubmit}>Create</Button>
                </Stack>   
            </form>
        </>
    )
}

