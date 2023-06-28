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

export function FastXSLTMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };

  const [description, setDescription] = useState("");
  const [selectedFastXSLTSchemaType, setSelectedFastXSLTSchemaType] =
    useState("Static");
  const [stXSLTSchemaKey, setStXSLTSchemaKey] = useState("");
  const [dyXSLTSchemaKey, setDyXSLTSchemaKey] = useState("");

  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  const handleFastXSLTSchemaTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedFastXSLTSchemaType(event.target.value);
  };
  const handleStXSLTSchemaKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStXSLTSchemaKey(event.target.value);
  };
  const handleDyXSLTSchemaKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDyXSLTSchemaKey(event.target.value);
  };

  return (
    <>
      <Modal
        show={props.modalOpen}
        onHide={handleCancelClick}
        dialogClassName="custom-modal-dialog"
      >
        <Modal.Header>
          <Modal.Title className="text-primary">Fast XSLT Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Properties</Modal.Title>
            <Form>
              <Form.Group>
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
                <br />
                <Row className="mb-4">
                  <Modal.Title className="text-secondary">
                    Schema Key
                  </Modal.Title>
                  <Form>
                    <Form.Group>
                      <Form.Label className="FastXSLTSchemaType">
                        Fast XSLT Schema Key Type
                      </Form.Label>
                      <Form.Select
                        className="custom-form-control"
                        value={selectedFastXSLTSchemaType}
                        onChange={handleFastXSLTSchemaTypeSelectChange}
                      >
                        <option value="Static">Static</option>
                        <option value="Dynamic">Dynamic</option>
                      </Form.Select>
                      {selectedFastXSLTSchemaType === "Static" && (
                        <>
                          <Form.Label className="StXSLTSchemaKey">
                            XSLT Static Schema Key
                          </Form.Label>
                          {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                          <Form.Control
                            className="custom-form-control"
                            type="text"
                            readOnly
                            value={stXSLTSchemaKey}
                            onChange={handleStXSLTSchemaKey}
                          />
                        </>
                      )}
                      {selectedFastXSLTSchemaType === "Dynamic" && (
                        <>
                          <Form.Label className="DyXSLTSchemaKey">
                            XSLT Dynamic Schema Key
                          </Form.Label>
                          {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                          <Form.Control
                            className="custom-form-control"
                            type="text"
                            readOnly
                            value={dyXSLTSchemaKey}
                            onChange={handleDyXSLTSchemaKey}
                          />
                        </>
                      )}
                    </Form.Group>
                  </Form>
                </Row>
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
