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
  executor: string;
  priority: string;
  sequenceKey: string;
  description: string;
};
export function EnqueueMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [executor, setExecutor] = useState<string>("");
  const [priority, setPriority] = useState<string>("0");
  const [sequenceKey, setSequenceKey] = useState<string>("None");
  const [description, setDescription] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleExecutor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExecutor(event.target.value);
  };
  const handlePriority = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriority(event.target.value);
  };
  const handleSequenceKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSequenceKey(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };
  const handleSubmit = async () => {
    if (!getDiagramEditorLangClient || !textEdit) {
      return [];
    }
  };
  const handleCancelClick = async () => {
    setExecutor("");
    setPriority("");
    setSequenceKey("None");
    setDescription("");
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          Enqueue Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Properties</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="Executor">Executor</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg: Executor"
                value={executor}
                onChange={handleExecutor}
              />
              <Form.Label className="Priority">Priority</Form.Label>
              <Form.Control
                type="text"
                placeholder="0"
                value={priority}
                onChange={handlePriority}
              />
              <Form.Label className="SequenceKey">Sequence Key</Form.Label>
              {/* When a user clicks this textbox, the Resource Key Model appears.*/}
              <Form.Control
                type="text"
                readOnly
                value={sequenceKey}
                onChange={handleSequenceKey}
              />
              <Form.Label className="mt-2 mb-0">Description</Form.Label>
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
                placeholder="eg: None"
                value={description}
                onChange={handleDescription}
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
