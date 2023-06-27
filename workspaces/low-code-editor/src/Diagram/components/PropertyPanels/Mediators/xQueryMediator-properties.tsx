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

export function XQueryMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };

  const [selectedScriptKeyType, setSelectedScriptKeyType] = useState("Static");
  const [targetXPath, setTargetXPath] = useState("");
  const [staticScriptKey, setStaticScriptKey] = useState("");
  const [dynamicScriptKey, setDynamicScriptKey] = useState("");
  const [variables, setVariables] = useState("");
  const [description, setDescription] = useState("");

  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleScriptKeyTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedScriptKeyType(event.target.value);
  };
  const handleTargetXPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetXPath(event.target.value);
  };
  const handleStaticScriptKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStaticScriptKey(event.target.value);
  };
  const handleDynamicScriptKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDynamicScriptKey(event.target.value);
  };
  const handleVariables = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVariables(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  return (
    <>
      <Modal show={props.modalOpen} onHide={handleCancelClick}>
        <Modal.Header>
          <Modal.Title className="text-primary">XQuery Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <br />
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Properties</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="ScriptKeyType">
                  Script Key Type
                </Form.Label>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">
                      Specifies whether the key which represents the XQuery
                      transformation should be a static key or a dynamic key
                    </Tooltip>
                  }
                >
                  <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                <Form.Select
                  value={selectedScriptKeyType}
                  onChange={handleScriptKeyTypeSelectChange}
                >
                  <option value="Static">Static</option>
                  <option value="Dynamic">Dynamic</option>
                </Form.Select>
                <Form.Label className="TargetXpath">Target Xpath</Form.Label>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">
                      Specifies the node of the message to which the XQuery
                      transformation should be applied. The node is evaluated
                      via an XPath expression. If no value is specified for this
                      parameter, the XQuery transformation is applied to the
                      first child of the SOAP body
                    </Tooltip>
                  }
                >
                  <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                <Form.Control
                  type="text"
                  readOnly
                  value={targetXPath}
                  onChange={handleTargetXPath}
                />
                {selectedScriptKeyType === "Static" && (
                  <>
                    <Form.Label className="StScriptKey">
                      Static Script Key
                    </Form.Label>
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id="help-tooltip">
                          The key that represents XQuery transformation
                        </Tooltip>
                      }
                    >
                      <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                        <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                      </span>
                    </OverlayTrigger>
                    {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                    <Form.Control
                      type="text"
                      placeholder="eg: Static Script Key"
                      value={staticScriptKey}
                      onChange={handleStaticScriptKey}
                    />
                  </>
                )}
                {selectedScriptKeyType === "Dynamic" && (
                  <>
                    <Form.Label className="DyScriptKey">
                      Dynamic Script Key
                    </Form.Label>
                    {/* When a user clicks this textbox, the Resource Key Model Model appears.*/}
                    <Form.Control
                      type="text"
                      readOnly
                      value={dynamicScriptKey}
                      onChange={handleDynamicScriptKey}
                    />
                  </>
                )}
                <br />
                <Row className="mb-4">
                  <Modal.Title className="text-secondary">
                    Variables
                  </Modal.Title>
                  <Form>
                    <Form.Group>
                      <Form.Label className="Variables">Variables</Form.Label>
                      {/* When a user clicks this textbox, the XQueryVariable Model appears.*/}
                      <Form.Control
                        as="textarea"
                        style={{ minHeight: "200px" }}
                        readOnly
                        value={variables}
                        onChange={handleVariables}
                      />
                    </Form.Group>
                  </Form>
                </Row>
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
            <Button variant="secondary" onClick={handleCancelClick}>
              Save
            </Button>
            <Button variant="primary" onClick={handleCancelClick}>
              Cancel
            </Button>
          </div>
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
