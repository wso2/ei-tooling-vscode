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
import { applyChange } from "../../../../DiagramGenerator/generatorUtil";
import { Context as DiagramContext } from "../../../../Contexts";

interface Props {
  modalOpen: boolean;
  modalClose: (value: boolean) => void;
}

export function ForEachMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };

  const [forEachID, setForEachID] = useState("");
  const [forEachExpression, setForEachExpression] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSequenceType, setSelectedSequenceType] = useState("Anonymous");
  const [sequenceKey, setSequenceKey] = useState("");
  const [sequenceName, setSequenceName] = useState("");

  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleForEachID = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForEachID(event.target.value);
  };
  const handleForEachExpression = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForEachExpression(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  const handleSequenceTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSequenceType(event.target.value);
  };
  const handleSequenceKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSequenceKey(event.target.value);
  };
  const handleSequenceName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSequenceName(event.target.value);
  };

  return (
    <>
      <Modal
        show={props.modalOpen}
        onHide={handleCancelClick}
        dialogClassName="custom-modal-dialog"
      >
        <Modal.Header>
          <Modal.Title className="text-primary">For Each Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Properties</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="ForEachID">ForEach ID</Form.Label>
                <Form.Control
                  className="custom-form-control"
                  type="text"
                  placeholder="eg: ForEach ID"
                  value={forEachID}
                  onChange={handleForEachID}
                />
                <Form.Label className="ForEachExpression">
                  ForEach Expression
                </Form.Label>
                {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                <Form.Control
                  className="custom-form-control"
                  type="text"
                  readOnly
                  value={forEachExpression}
                  onChange={handleForEachExpression}
                />
                <Form.Label className="Description">Description</Form.Label>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">Default description</Tooltip>
                  }
                >
                  <span className="custom-question-icon">
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                <Form.Control
                  className="custom-form-control"
                  as="textarea"
                  value={description}
                  onChange={handleDescription}
                  placeholder="eg: None"
                />
              </Form.Group>
            </Form>
          </Row>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Sequence</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="SequenceType">Sequence Type</Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedSequenceType}
                  onChange={handleSequenceTypeSelectChange}
                >
                  <option value="Anonymous">Anonymous</option>
                  <option value="RegistryReference">Registry Reference</option>
                  <option value="NamedReference">Named Reference</option>
                </Form.Select>
                {selectedSequenceType === "RegistryReference" && (
                  <>
                    <Form.Label className="SequenceKey">
                      Sequence Key
                    </Form.Label>
                    {/* When a user clicks this textbox, the Resource KeyModel appears.*/}
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      readOnly
                      value={sequenceKey}
                      onChange={handleSequenceKey}
                    />
                  </>
                )}
                {selectedSequenceType === "NamedReference" && (
                  <>
                    <Form.Label className="SequenceName">
                      Sequence Name
                    </Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      placeholder="eg: Sequence Name"
                      value={sequenceName}
                      onChange={handleSequenceName}
                    />
                  </>
                )}
              </Form.Group>
            </Form>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCancelClick}>
            Close
          </Button>
          <Button variant="secondary" onClick={handleCancelClick}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
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
