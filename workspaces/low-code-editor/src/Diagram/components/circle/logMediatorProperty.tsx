import React, {Component, useContext, useState} from 'react'
import { Col, Form, Modal, Row, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    CompletionResponse,
    DiagramEditorLangClientInterface,
    SnippetCompletionResponse, TextEdit
} from "@wso2-ei/low-code-editor-commons";
import {applyChange, getCompletion, getSnippetCompletion} from "../../../DiagramGenerator/generatorUtil";
import {Context as DiagramContext} from "../../../Contexts";

type Props = {
    // langClient: DiagramEditorLangClientInterface;
    textDocumentUrl: string;
    textDocumentFsPath: string;
    previousComponentStartPosition: number
    textEdit?: TextEdit;
};
type State = {
    selectedVersionType: string,
    selectedLogLevel: string,
    selectedPropertyValueType: string,
    showModal: boolean;
};

// const LogMediatorProperty: React.FC<Props> = ({ textDocumentUrl, textDocumentFsPath, previousComponentStartPosition}) => {
//
// }

export function LogMediatorProperty(props: Props) {
    const {textDocumentUrl, textDocumentFsPath, previousComponentStartPosition, textEdit} = props;
    const [selectedVersionType, setSelectedVersionType] = useState<string>('INFO');
    const [selectedLogLevel, setSelectedLogLevel] = useState<string>('SIMPLE');
    const [description, setDescription] = useState<string>('');
    const [selectedPropertyValueType, setSelectedPropertyValueType] = useState<string>('LITERAL');
    const [showModal, setShowModal] = useState<boolean>(false);

    const {
        api: {
            ls: {
                getDiagramEditorLangClient
            }
        }
    } = useContext(DiagramContext);

    const handleVersionTypeSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVersionType(event.target.value);
    }

    const handleLogLevelSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLogLevel(event.target.value);
    }

    // const handleDescriptionChange = async (event: React.ChangeEvent<FormControlElement>) => {
    //     setDescription(event.target.value);
    // }

    const handleDescriptionChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        // 👇️ access textarea value
        setDescription(event.target.value);
        console.log(event.target.value);
    };

    const handlePropertyValueTypeSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPropertyValueType(event.target.value);
    }

    const handleShowModal = async () => {
        setShowModal(true);
    }

    const handleHideModal = async () => {
        setShowModal(false);
    }

    const handleFinish = async () => {
        handleShowModal();
    }

    const handleSubmit = async () => {
        if (!getDiagramEditorLangClient || !textEdit) {
            return [];
        }
        const langClient = await getDiagramEditorLangClient();
        let snippetCompletionResponse: SnippetCompletionResponse = await getSnippetCompletion(selectedLogLevel, selectedVersionType, ",", description, null, langClient);
        textEdit.newText = snippetCompletionResponse.snippet;
        await modifyTextOnComponentSelection(textDocumentUrl, textDocumentFsPath, textEdit, previousComponentStartPosition, langClient);
    }


    return (
        <>
            <Modal.Header>
                <Modal.Title className='text-primary'>Properties</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className='mb-4'>
                    <Modal.Title className='text-secondary'>
                        Properties
                    </Modal.Title>
                    <Form>
                        <Form.Group>
                            <Form.Label className='VersionType'>Version Type</Form.Label>
                            <Form.Select value={selectedVersionType} onChange={handleVersionTypeSelectChange}>
                                <option value="INFO">INFO</option>
                                <option value="TRACE">TRACE</option>
                                <option value="DEBUG">DEBUG</option>
                                <option value="WARN">WARN</option>
                                <option value="ERROR">ERROR</option>
                                <option value="FATAL">FATAL</option>
                            </Form.Select>
                            <Form.Label className='LogLevel'>Log Level</Form.Label>
                            <Form.Select value={selectedLogLevel} onChange={handleLogLevelSelectChange}>
                                <option value="SIMPLE">SIMPLE</option>
                                <option value="HEADERS">HEADERS</option>
                                <option value="FULL">FULL</option>
                                <option value="CUSTOM">CUSTOM</option>
                            </Form.Select>
                            <Form.Label className='LogSeparator'>Log Separator</Form.Label>
                            <OverlayTrigger placement="right" overlay={<Tooltip id="help-tooltip">This parameter is used to specify a value to be used in the log to separate attributes. The comma is default. Can be add tab as "/t" and new line as "/n"</Tooltip>}>
                                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                                </span>
                            </OverlayTrigger>
                            <Form.Control type='text' placeholder=' ' />
                            <Form.Label className='Properties'>Properties</Form.Label>
                            <Form.Control as='textarea' style={{ minHeight: '100px' }} placeholder=' ' onClick={handleShowModal} />
                            <Form.Label className='Description'>Description</Form.Label>
                            <textarea
                                id="message"
                                name="message"
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                        </Form.Group>
                    </Form>
                    <button className='btn btn-secondary' onClick={handleSubmit}>Save</button>
                </Row>
            </Modal.Body>
            <Modal show={showModal} onHide={handleHideModal}>
                <Modal.Header closeButton>
                    <Modal.Title >LogProperty</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className='mb-4'>
                        <form>
                            <Form.Group>
                                <p>Editing of the properties of an object LogProperty</p><br></br>
                                <Modal.Title >Properties</Modal.Title><br/>
                                <Form.Label className="PropertyName">Property Name</Form.Label>
                                <Form.Control type="text" placeholder=" " />
                                <Form.Label className="PropertyValueType">Property Value Type</Form.Label>
                                <Form.Select value={selectedPropertyValueType} onChange={handlePropertyValueTypeSelectChange}>
                                    <option value="LITERAL">LITERAL</option>
                                    <option value="EXPRESSION">EXPRESSION</option>
                                </Form.Select>
                                {selectedPropertyValueType === "LITERAL" && (
                                    <>
                                        <Form.Label className="PropertyValue">Property Value</Form.Label>
                                        <Form.Control type="text" placeholder="eg: None" />
                                    </>
                                )}
                                {selectedPropertyValueType === "EXPRESSION" && (
                                    <>
                                        <Form.Label className="PropertyExpression">Property Expression</Form.Label>
                                        <Form.Control type="text" placeholder="eg: None" />
                                    </>
                                )}
                            </Form.Group>
                        </form>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-secondary' onClick={handleHideModal}>Cancel</button>
                    <button className='btn btn-primary' onClick={handleFinish}>Finish</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

// export default class LogMediatorProperty extends Component<Props, State> {
//     private langClient: DiagramEditorLangClientInterface;
//     private textDocumentUrl: string;
//     private textDocumentFsPath: string;
//     private previousComponentStartPosition: number;
//     private textEdit: TextEdit | undefined;
//
//     constructor(props: Props) {
//         super(props);
//         this.langClient = props.langClient;
//         this.textDocumentUrl = props.textDocumentUrl;
//         this.textDocumentFsPath = props.textDocumentFsPath;
//         this.previousComponentStartPosition = props.previousComponentStartPosition;
//         this.textEdit = props.textEdit;
//         this.state = {
//             selectedVersionType: 'INFO',
//             selectedLogLevel: 'SIMPLE',
//             selectedPropertyValueType: 'LITERAL',
//             showModal: false,
//         };
//     }
//
//     handleVersionTypeSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         this.setState({ selectedVersionType: event.target.value });
//     };
//     handleLogLevelSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         this.setState({ selectedLogLevel: event.target.value });
//     };
//     handlePropertyValueTypeSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         this.setState({ selectedPropertyValueType: event.target.value });
//     };
//     handleShowModal = () => {
//         this.setState({ showModal: true });
//     };
//
//     handleHideModal = () => {
//         this.setState({ showModal: false });
//     };
//     handleFinish = () => {
//         // Perform actions to save the Properties selected option == Finish
//         // ...
//
//         // Hide the modal
//         this.handleHideModal();
//     };
//
//     handleSubmit = async () => {
//         if (this.langClient && this.textEdit) {
//             let snippetCompletionResponse: SnippetCompletionResponse = await getSnippetCompletion("simple", "INFO", ",", "this is a simple info log", null, this.langClient);
//             this.textEdit.newText = snippetCompletionResponse.snippet;
//             await modifyTextOnComponentSelection(this.textDocumentUrl, this.textDocumentFsPath, this.textEdit, this.previousComponentStartPosition, this.langClient);
//         }
//     }
//
//     render() {
//         const { selectedVersionType, selectedLogLevel, selectedPropertyValueType, showModal } = this.state;
//
//         return (
//             <>
//                 <Modal.Header>
//                     <Modal.Title className='text-primary'>Properties</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Row className='mb-4'>
//                         <Modal.Title className='text-secondary'>
//                             Properties
//                         </Modal.Title>
//                         <Form>
//                             <Form.Group>
//                                 <Form.Label className='VersionType'>Version Type</Form.Label>
//                                 <Form.Select value={selectedVersionType} onChange={this.handleVersionTypeSelectChange}>
//                                     <option value="INFO">INFO</option>
//                                     <option value="TRACE">TRACE</option>
//                                     <option value="DEBUG">DEBUG</option>
//                                     <option value="WARN">WARN</option>
//                                     <option value="ERROR">ERROR</option>
//                                     <option value="FATAL">FATAL</option>
//                                 </Form.Select>
//                                 <Form.Label className='LogLevel'>Log Level</Form.Label>
//                                 <Form.Select value={selectedLogLevel} onChange={this.handleLogLevelSelectChange}>
//                                     <option value="SIMPLE">SIMPLE</option>
//                                     <option value="HEADERS">HEADERS</option>
//                                     <option value="FULL">FULL</option>
//                                     <option value="CUSTOM">CUSTOM</option>
//                                 </Form.Select>
//                                 <Form.Label className='LogSeparator'>Log Separator</Form.Label>
//                                 <OverlayTrigger placement="right" overlay={<Tooltip id="help-tooltip">This parameter is used to specify a value to be used in the log to separate attributes. The comma is default. Can be add tab as "/t" and new line as "/n"</Tooltip>}>
//                                 <span style={{ marginLeft: "10px", cursor: "pointer" }}>
//                                     <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
//                                 </span>
//                                 </OverlayTrigger>
//                                 <Form.Control type='text' placeholder=' ' />
//                                 <Form.Label className='Properties'>Properties</Form.Label>
//                                 <Form.Control as='textarea' style={{ minHeight: '100px' }} placeholder=' ' onClick={this.handleShowModal} />
//                             </Form.Group>
//                         </Form>
//                     </Row>
//                 </Modal.Body>
//                 <Modal show={showModal} onHide={this.handleHideModal}>
//                     <Modal.Header closeButton>
//                         <Modal.Title >LogProperty</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <Row className='mb-4'>
//                             <form>
//                                 <Form.Group>
//                                     <p>Editing of the properties of an object LogProperty</p><br></br>
//                                     <Modal.Title >Properties</Modal.Title><br/>
//                                     <Form.Label className="PropertyName">Property Name</Form.Label>
//                                     <Form.Control type="text" placeholder=" " />
//                                     <Form.Label className="PropertyValueType">Property Value Type</Form.Label>
//                                     <Form.Select value={selectedPropertyValueType} onChange={this.handlePropertyValueTypeSelectChange}>
//                                         <option value="LITERAL">LITERAL</option>
//                                         <option value="EXPRESSION">EXPRESSION</option>
//                                     </Form.Select>
//                                     {selectedPropertyValueType === "LITERAL" && (
//                                         <>
//                                             <Form.Label className="PropertyValue">Property Value</Form.Label>
//                                             <Form.Control type="text" placeholder="eg: None" />
//                                         </>
//                                     )}
//                                     {selectedPropertyValueType === "EXPRESSION" && (
//                                         <>
//                                             <Form.Label className="PropertyExpression">Property Expression</Form.Label>
//                                             <Form.Control type="text" placeholder="eg: None" />
//                                         </>
//                                     )}
//                                 </Form.Group>
//                             </form>
//                             <button className='btn btn-secondary' onClick={this.handleSubmit}>Save</button>
//                         </Row>
//                     </Modal.Body>
//                     <Modal.Footer>
//                         <button className='btn btn-secondary' onClick={this.handleHideModal}>Cancel</button>
//                         <button className='btn btn-primary' onClick={this.handleFinish}>Finish</button>
//                     </Modal.Footer>
//                 </Modal>
//             </>
//         )
//     }
// }

async function modifyTextOnComponentSelection(url: string, fsPath: string, text: TextEdit, previousComponentStartPosition: number, langClient: any) {
    await applyChange(url, fsPath, text, previousComponentStartPosition, langClient);
}
