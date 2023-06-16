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
  // langClient: DiagramEditorLangClientInterface;
  textDocumentUrl: string;
  textDocumentFsPath: string;
  previousComponentStartPosition: number;
  textEdit?: TextEdit;
};
type State = {
  selectedSpecifyAs: string;
  selectedAvaiMessageStore: string;
  onStoreSequence: string;
  messageStore: string;
  dynReferenceKey: string;
  description: string;
};

export function StoreMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [selectedSpecifyAs, setSelectedSpecifyAs] = useState<string>("Value");
  const [selectedAvaiMessageStore, setSelectedAvaiMessageStore] =
    useState<string>("SFMessageStore");
  const [onStoreSequence, setOnStoreSequence] = useState<string>("");
  const [messageStore, setMessageStore] = useState<string>("");
  const [dynReferenceKey, setDynReferenceKey] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleSpecifyAsSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSpecifyAs(event.target.value);
  };
  const handleAvaiMessageStoreSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedAvaiMessageStore(event.target.value);
  };
  const handleOnStoreSequence = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOnStoreSequence(event.target.value);
  };
  const handleMessageStore = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageStore(event.target.value);
  };
  const handleDynReferenceKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDynReferenceKey(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };
  const handleSubmit = async () => {
    if (!getDiagramEditorLangClient || !textEdit) {
      return [];
    }
    const langClient = await getDiagramEditorLangClient();
    let snippetCompletionResponse: SnippetCompletionResponse =
      await getSnippetCompletion(
        selectedSpecifyAs,
        selectedAvaiMessageStore,
        onStoreSequence,
        messageStore,
        dynReferenceKey,
        // description,
        langClient
      );
    textEdit.newText = snippetCompletionResponse.snippet;
    await modifyTextOnComponentSelection(
      textDocumentUrl,
      textDocumentFsPath,
      textEdit,
      previousComponentStartPosition,
      langClient
    );
  };
  const handleCancelClick = async () => {
    setSelectedSpecifyAs("Value");
    setSelectedAvaiMessageStore("SFMessageStore");
    setOnStoreSequence("");
    setMessageStore("");
    setDynReferenceKey("");
    setDescription("");
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          Store Mediator Properties
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Properties</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="OnStoreSequence">
                On Store Sequence
              </Form.Label>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="help-tooltip">
                    The sequence that will be called before the message gets
                    stored. This sequence should be pre-defined in the registry
                    before it can be entered here
                  </Tooltip>
                }
              >
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Control
                type="text"
                value={onStoreSequence}
                onChange={handleOnStoreSequence}
                readOnly
              />{" "}
              {/* When user click it going to the Resource Key Model*/}
            </Form.Group>
          </Form>
        </Row>
        <Row className="mb-4">
          <br />
          <Modal.Title className="text-secondary">Message Store</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="SpecifyAs">Specify As</Form.Label>
              <Form.Select
                value={selectedSpecifyAs}
                onChange={handleSpecifyAsSelectChange}
              >
                <option value="Value">Value</option>
                <option value="Expression">Expression</option>
              </Form.Select>
              {selectedSpecifyAs === "Value" && (
                <>
                  <Form.Label className="AvaiMessageStore">
                    Available Message Store
                  </Form.Label>
                  <Form.Select
                    value={selectedAvaiMessageStore}
                    onChange={handleAvaiMessageStoreSelectChange}
                  >
                    <option value="SFMessageStore">
                      Select From Message Stores
                    </option>
                  </Form.Select>
                  <Form.Label className="MessageStore">
                    Message Store
                  </Form.Label>
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id="help-tooltip">
                        The Message Store, in which messages will be stored. You
                        can give the name of the Message Store either as a value
                        or as an expression
                      </Tooltip>
                    }
                  >
                    <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                      <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                    </span>
                  </OverlayTrigger>
                  <Form.Control
                    type="text"
                    value={messageStore}
                    onChange={handleMessageStore}
                    placeholder="eg: None"
                  />
                </>
              )}
              {selectedSpecifyAs === "Dynamic" && (
                <>
                  <Form.Label className="DynReferenceKey">
                    Dynamic Reference Key
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={dynReferenceKey}
                    onChange={handleDynReferenceKey}
                    readOnly
                  />{" "}
                  {/* When user click it going to the Expression Selector Model*/}
                </>
              )}
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
