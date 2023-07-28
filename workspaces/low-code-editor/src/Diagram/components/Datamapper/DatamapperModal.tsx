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
import { Form } from 'react-bootstrap';
import { Modal, Button } from "react-bootstrap";
import { useStyles } from '../../styles';

interface Props {
    modalOpen: boolean;
    modalClose: (value: boolean) => void;
    projectName: (value: string) => void;
    registryName: (value: string) => void;
}

interface vscode {
    postMessage(message: any): void;
}
declare const vscode: vscode;

/* Datamapper mediator configuration modal to get user input for project name and registry resource project folder name.
json schema,dmc files will be saved in the name of project name inside registry resource project folder.*/
const DatamapperModal = (props: Props) => {

    const [datamapperProject, setDatamapperProject] = React.useState('');
    const [datamapperRegistry, setDatamapperRegistry] = React.useState('');
    const [registryProject, setregistryProject] = React.useState(['No Projects']);
    const classes = useStyles();

    React.useEffect(() => {
        const handleRegistryResource = (e: MessageEvent) => {
            if (e.data.command === 'registryResource') {
                setregistryProject(e.data.data);
            }
        }

        vscode.postMessage({ command: 'currentRegistryprojects' });
        window.addEventListener('message', handleRegistryResource);
    }, [props.modalOpen])

    const handleCancelClick = () => {
        props.modalClose(false);
    };

    const handleDatamapperRegistrySelection = (e : any) =>{
        setDatamapperRegistry(e.target.value);
    }

    const handleSubmit = () => {
        props.projectName(datamapperProject);
        props.registryName(datamapperRegistry);
        props.modalClose(false);
    }

    return (
        <>
            <Modal show={props.modalOpen}>
                <Modal.Header>
                    <Modal.Title className="text-primary">Data Mapper Configuration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className={classes.formSpacing}>
                            <Form.Label>Configuration Project name </Form.Label>
                            <Form.Control name='text' type='text' onChange={(e) => { setDatamapperProject(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className={classes.formSpacing}>
                            <Form.Label>Save Project in </Form.Label>
                            <Form.Select className="custom-form-control"
                                onChange={handleDatamapperRegistrySelection}>
                                {registryProject.map((project) => {
                                    return (<option value={project}>{project}</option>)
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className={classes.formSpacing}>
                            <Form.Label className={classes.formLabel}>or Create New Registry Project</Form.Label>
                            <Form.Control name='text' type='text' onChange={(e) => { setDatamapperRegistry(e.target.value) }} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCancelClick}>Close</Button>
                    <Button variant="secondary" onClick={handleSubmit}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DatamapperModal;
