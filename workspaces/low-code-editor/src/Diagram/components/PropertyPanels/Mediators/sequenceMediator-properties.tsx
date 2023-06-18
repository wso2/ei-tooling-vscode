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

import React, { Component, useContext, useState } from "react";
import {
  Col,
  Form,
  Modal,
  Row,
  OverlayTrigger,
  Tooltip,
  Button,
} from "react-bootstrap";
import "./style.scss";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CompletionResponse,
  DiagramEditorLangClientInterface,
  SnippetCompletionResponse,
  TextEdit,
} from "@wso2-ei/low-code-editor-commons";
import {
  applyChange,
  getCompletion,
  getSnippetCompletion,
} from "../../../../DiagramGenerator/generatorUtil";
import { Context as DiagramContext } from "../../../../Contexts";

type Props = {
    textDocumentUrl: string;
    textDocumentFsPath: string;
    previousComponentStartPosition: number
    textEdit?: TextEdit;
}
type State = {
  selectedRSType: string;
  staReferenceKey: string;
  dynReferenceKey: string;
  description: string;
};

export function SequenceMediatorProperty (props: Props) {
  const {textDocumentUrl, textDocumentFsPath, previousComponentStartPosition, textEdit} = props;
  const [selectedRSType, setSelectedRSType] = useState<string>('Static');
const [description, setDescription] = useState<string>('');
const [staReferenceKey, setStaReferenceKey] = useState<string>('');
const [dynReferenceKey, setDynReferenceKey] = useState<string>('');
const {
    api: {
        ls: {
            getDiagramEditorLangClient
        }
    }
} = useContext(DiagramContext);
const handleRSTypeSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRSType(event.target.value);
};
const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
};
const handleStaReferenceKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStaReferenceKey(event.target.value);
};
const handleDynReferenceKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDynReferenceKey(event.target.value);
};
const handleSubmit = async () => {
  if (!getDiagramEditorLangClient || !textEdit) {
    return [];
  }
};
const handleCancelClick = async () => {
  setSelectedRSType('Static');
  setDescription('');
  setStaReferenceKey('');
  setDynReferenceKey('');
};
    return (
        <>
            <Modal.Header>
                <Modal.Title className='text-primary'>Sequence Mediator Properties</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <br />
              <Row className='mb-4'>
                <Modal.Title className='text-secondary'>
                    Properties
                </Modal.Title>
                <Form>
                  <Form.Group>
                  <Form.Label className='Description'>Description</Form.Label>
                    <OverlayTrigger placement="right" overlay={<Tooltip id="help-tooltip">Default description</Tooltip>}>
                      <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                        <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                      </span>
                    </OverlayTrigger>
                    <Form.Control as="textarea" value={description} onChange={handleDescription} placeholder="eg: None" />
                  </Form.Group>
                </Form>
              </Row>  
              <br />    
              <Row className='mb-4'>
                <Modal.Title className='text-secondary'>
                    Referring Sequence
                </Modal.Title>
                <Form>
                  <Form.Group>
                    <Form.Label className='RSType'>Referring Sequence Type</Form.Label>
                    <Form.Select value={selectedRSType} onChange={handleRSTypeSelectChange}>
                      <option value="Static">Static</option>
                      <option value="Dynamic">Dynamic</option>
                    </Form.Select>
                    {selectedRSType === "Static" && (
                      <>
                        <Form.Label className="StaReferenceKey">Static Reference Key</Form.Label>
                        <Form.Control type="text" value={staReferenceKey} onChange={handleStaReferenceKey} readOnly /> {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                      </>
                    )}
                    {selectedRSType === "Dynamic" && (
                      <>
                        <Form.Label className="DynReferenceKey">Dynamic Reference Key</Form.Label>
                        <Form.Control type="text" value={dynReferenceKey} onChange={handleDynReferenceKey} readOnly /> {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                      </>
                    )}
                  </Form.Group>
                </Form>
              </Row>
            </Modal.Body>
            <Modal.Footer>
        <div className="footer-button-container">
          <Button id="primary-button" onClick={handleSubmit}>
            Save
          </Button>
          <Button id="secondary-button" onClick={handleCancelClick}>
            Cancel
          </Button>
        </div>
      </Modal.Footer>
        </>
    )
  }
async function modifyTextOnComponentSelection(url: string, fsPath: string, text: TextEdit, previousComponentStartPosition: number, langClient: any) {
    await applyChange(url, fsPath, text, previousComponentStartPosition, langClient);
}
