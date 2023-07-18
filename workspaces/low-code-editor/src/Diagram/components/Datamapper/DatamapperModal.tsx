import React from 'react';
import { Form } from 'react-bootstrap';
import { Modal,Button } from "react-bootstrap";

interface Props {
    modalOpen: boolean;
    modalClose: (value: boolean) => void;
    projectName: (value: string) => void;
    registryName: (value: string) => void;
}

const DatamapperModal = (props: Props) => {

    const [datamapperProject,setDatamapperProject] = React.useState('');
    const [datamapperRegistry,setDatamapperRegistry] = React.useState('');

    const handleCancelClick = () => {
        props.modalClose(false);
    };

    const handleSubmit = () =>{
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
                        <Form.Group>
                            <Form.Label>Configuration Project name </Form.Label>
                            <Form.Control name='text' type='text' onChange={(e)=>{setDatamapperProject(e.target.value)}}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Save Project in </Form.Label>
                            <Form.Control name='text' type='text' onChange={(e)=>{setDatamapperRegistry(e.target.value)}}/>
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

export default DatamapperModal
