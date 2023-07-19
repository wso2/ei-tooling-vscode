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
    }, [datamapperProject])

    const handleCancelClick = () => {
        props.modalClose(false);
    };

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
                                onChange={(e) => { setDatamapperRegistry(e.target.value) }}>
                                {registryProject.map((val) => {
                                    return (<option value={val}>{val}</option>)
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
