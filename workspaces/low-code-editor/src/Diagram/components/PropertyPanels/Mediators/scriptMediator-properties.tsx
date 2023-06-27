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

export function ScriptMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };

  const [selectedScriptLanguage, setSelectedScriptLanguage] = useState("js");
  const [selectedScriptType, setSelectedScriptType] = useState("INLINE");
  const [scriptBody, setScriptBody] = useState("");
  const [functionName, setFunctionName] = useState("");
  const [selectedKeyType, setSelectedKeyType] = useState("STATIC_KEY");
  const [scriptKeys, setScriptKeys] = useState("");
  const [scriptStaticKey, setScriptStaticKey] = useState("");
  const [scriptDynamicKey, setScriptDynamicKey] = useState("");
  const [description, setDescription] = useState("");

  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleScriptLanguageSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedScriptLanguage(event.target.value);
  };
  const handleScriptTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedScriptType(event.target.value);
  };
  const handleScriptBody = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScriptBody(event.target.value);
  };
  const handleFunctionName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFunctionName(event.target.value);
  };
  const handleKeyTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedKeyType(event.target.value);
  };
  const handleScriptKeys = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScriptKeys(event.target.value);
  };
  const handleScriptStaticKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScriptStaticKey(event.target.value);
  };
  const handleScriptDynamicKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScriptDynamicKey(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  return (
    <>
      <Modal show={props.modalOpen} onHide={handleCancelClick}>
        <Modal.Header>
          <Modal.Title className="text-primary">Script Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <br />
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Properties</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="ScriptLanguage">
                  Script Language
                </Form.Label>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">
                      JavaScript:
                      <br />
                      E4X support is enabled by default
                      <br />
                      <br />
                      Ruby:
                      <br />
                      Download the jruby-complete-1.3.0.wso22v1.jar file from
                      the WSO2 P2 repository and copy it to the
                      &lt;EI_HOME&gt;/dropins directory
                      <br />
                      <br />
                      Groovy:
                      <br />
                      Download the groovy-all-2.4.4.jar file and copy it to the
                      &lt;EI_HOME&gt;/dropins directory
                    </Tooltip>
                  }
                >
                  <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                <Form.Select
                  value={selectedScriptLanguage}
                  onChange={handleScriptLanguageSelectChange}
                >
                  <option value="js">js</option>
                  <option value="rb">rb</option>
                  <option value="groovy">groovy</option>
                  <option value="nashornJs">nashornJs</option>
                </Form.Select>
                <br />
                <Row className="mb-4">
                  <Modal.Title className="text-secondary">
                    Script Type
                  </Modal.Title>
                  <Form>
                    <Form.Group>
                      <Form.Label className="ScriptType">
                        Script Type
                      </Form.Label>
                      <Form.Select
                        value={selectedScriptType}
                        onChange={handleScriptTypeSelectChange}
                      >
                        <option value="INLINE">INLINE</option>
                        <option value="REGISTRY_REFERENCE">
                          REGISTRY_REFERENCE
                        </option>
                      </Form.Select>
                      {selectedScriptType === "INLINE" && (
                        <>
                          <Form.Label className="ScriptBody">
                            Script Body
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            style={{ minHeight: "200px" }}
                            value={scriptBody}
                            onChange={handleScriptBody}
                          >
                            script_code;
                          </Form.Control>
                        </>
                      )}
                      {selectedScriptType === "REGISTRY_REFERENCE" && (
                        <>
                          <Form.Label className="FunctionName">
                            Function Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Function Name"
                            value={functionName}
                            onChange={handleFunctionName}
                          />
                          <Form.Label className="KeyType">Key Type</Form.Label>
                          <Form.Select
                            value={selectedKeyType}
                            onChange={handleKeyTypeSelectChange}
                          >
                            <option value="STATIC_KEY">STATIC_KEY</option>
                            <option value="DYNAMIC_KEY">DYNAMIC_KEY</option>
                          </Form.Select>
                          <Form.Label className="ScriptKeys">
                            Script Keys
                          </Form.Label>
                          {/* When a user clicks this textbox, the RegisrtyKeyProperty Model appears.*/}
                          <Form.Control
                            as="textarea"
                            style={{ minHeight: "200px" }}
                            readOnly
                            value={scriptKeys}
                            onChange={handleScriptKeys}
                          />
                          {selectedKeyType === "STATIC_KEY" && (
                            <>
                              <Form.Label className="ScriptStaticKey">
                                Script Static Keys
                              </Form.Label>
                              {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                              <Form.Control
                                type="text"
                                readOnly
                                value={scriptStaticKey}
                                onChange={handleScriptStaticKey}
                              />
                            </>
                          )}
                          {selectedKeyType === "DYNAMIC_KEY" && (
                            <>
                              <Form.Label className="ScriptDynamicKey">
                                Script Dynamic Keys
                              </Form.Label>
                              {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                              <Form.Control
                                type="text"
                                readOnly
                                value={scriptDynamicKey}
                                onChange={handleScriptDynamicKey}
                              />
                            </>
                          )}
                        </>
                      )}
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
