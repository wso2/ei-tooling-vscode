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
  previousComponentStartPosition: number;
  textEdit?: TextEdit;
};
type State = {
    forEachID: string;
    forEachExpression: string;
  description: string;
    sequenceType: string;
    sequenceKey: string;
    sequenceName: string;
};
export function ForEachMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
 const [forEachID, setForEachID] = useState<string>("");
    const [forEachExpression, setForEachExpression] = useState<string>("");
  const [description, setDescription] = useState<string>("");
    const [selectedSequenceType, setSelectedSequenceType] = useState<string>("Anonymous");
    const [sequenceKey, setSequenceKey] = useState<string>("");
    const [sequenceName, setSequenceName] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleForEachID = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForEachID(event.target.value);
    };
    const handleForEachExpression = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForEachExpression(event.target.value);
    };
  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
    const handleSequenceTypeSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSequenceType(event.target.value);
    };
    const handleSequenceKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSequenceKey(event.target.value);
    };
    const handleSequenceName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSequenceName(event.target.value);
    };
  const handleSubmit = async () => {
    if (!getDiagramEditorLangClient || !textEdit) {
      return [];
    }
  };
  const handleCancelClick = async () => {
   setForEachID("");
    setForEachExpression("");
    setDescription("");
    setSelectedSequenceType("Anonymous");
    setSequenceKey("");
    setSequenceName("");
  };
    return (
        <>
            <Modal.Header>
                <Modal.Title className='text-primary'>Iterate Mediator Property</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <br />
                <Row className='mb-4'>
                    <Modal.Title className='text-secondary'>
                        Properties
                    </Modal.Title>
                    <Form>
                        <Form.Group>    
                            <Form.Label className="ForEachID">ForEach ID</Form.Label>
                            <Form.Control type="text" placeholder="eg: ForEach ID" value={forEachID} onChange={handleForEachID} />
                            <Form.Label className="ForEachExpression">ForEach Expression</Form.Label>
                            {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                            <Form.Control type="text" readOnly value={forEachExpression} onChange={handleForEachExpression} />
                            <Form.Label className="Description">Description</Form.Label>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="help-tooltip">Default description</Tooltip>
                }
              >
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Control
                as="textarea"
                value={description}
                onChange={handleDescription}
                placeholder="eg: None"
              />
                        </Form.Group>
                    </Form>
                </Row> 
                < br/ >
                <Row className='mb-4'>
                    <Modal.Title className='text-secondary'>
                        Sequence
                    </Modal.Title>
                    <Form>
                        <Form.Group>
                            <Form.Label className="SequenceType">Sequence Type</Form.Label>
                            <Form.Select value={selectedSequenceType} onChange={handleSequenceTypeSelectChange}>
                                <option value="Anonymous">Anonymous</option>
                                <option value="RegistryReference">Registry Reference</option>
                                <option value="NamedReference">Named Reference</option>
                            </Form.Select>
                            {selectedSequenceType === "RegistryReference" && (
                                <>
                                    <Form.Label className="SequenceKey">Sequence Key</Form.Label>
                                    {/* When a user clicks this textbox, the Resource KeyModel appears.*/}
                                    <Form.Control type="text" readOnly value={sequenceKey} onChange={handleSequenceKey} />
                                </>
                            )}
                            {selectedSequenceType === "NamedReference" && (
                                <>
                                    <Form.Label className="SequenceName">Sequence Name</Form.Label>
                                    <Form.Control type="text" placeholder="eg: Sequence Name" value={sequenceName} onChange={handleSequenceName} />
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
  );
}
async function modifyTextOnComponentSelection(
  url: string,
  fsPath: string,
  text: TextEdit,
  previousComponentStartPosition: number,
  langClient: any
) {
  await applyChange(
    url,
    fsPath,
    text,
    previousComponentStartPosition,
    langClient
  );
}
