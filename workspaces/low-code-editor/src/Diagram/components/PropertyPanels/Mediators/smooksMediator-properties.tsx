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
  selectedInputType: string;
  inputExpression: string;
  configurationKey: string;
  selectedOutputType: string;
  selectedOutputMethod: string;
  outputProperty: string;
  selectedOutputAction: string;
  outputExpression: string;
  description: string;
};
export function SmooksMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [selectedInputType, setSelectedInputType] = useState<string>("xml");
  const [inputExpression, setInputExpression] = useState<string>("");
  const [configurationKey, setConfigurationKey] = useState<string>("");
  const [selectedOutputType, setSelectedOutputType] = useState<string>("xml");
  const [selectedOutputMethod, setSelectedOutputMethod] =
    useState<string>("Default");
  const [outputProperty, setOutputProperty] = useState<string>("");
  const [selectedOutputAction, setSelectedOutputAction] =
    useState<string>("Add");
  const [outputExpression, setOutputExpression] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleInputTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedInputType(event.target.value);
  };
  const handleInputExpression = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputExpression(event.target.value);
  };
  const handleConfigurationKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfigurationKey(event.target.value);
  };
  const handleOutputTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOutputType(event.target.value);
  };
  const handleOutputMethodSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOutputMethod(event.target.value);
  };
  const handleOutputProperty = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOutputProperty(event.target.value);
  };
  const handleOutputActionSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOutputAction(event.target.value);
  };
  const handleOutputExpression = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOutputExpression(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  const handleSubmit = async () => {
    if (!getDiagramEditorLangClient || !textEdit) {
      return [];
    }
  };
  const handleCancelClick = async () => {
    setSelectedInputType("xml");
    setInputExpression("");
    setConfigurationKey("");
    setSelectedOutputType("xml");
    setSelectedOutputMethod("Default");
    setOutputProperty("");
    setSelectedOutputAction("Add");
    setOutputExpression("");
    setDescription("");
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          Smooks Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Input</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="InputType">Input Type</Form.Label>
              <Form.Select
                value={selectedInputType}
                onChange={handleInputTypeSelectChange}
              >
                <option value="xml">xml</option>
                <option value="text">text</option>
              </Form.Select>
              <Form.Label className="InputExpression">
                Input Expression
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="eg: Input Expression"
                value={inputExpression}
                onChange={handleInputExpression}
              />
            </Form.Group>
          </Form>
        </Row>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Key</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="ConfigurationKey">
                Configuration Key
              </Form.Label>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="help-tooltip">
                    The key to access the Smooks configuration. The Smooks
                    configuration should be saved in the Registry as a local
                    entry before it can be used here
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
                readOnly
                value={configurationKey}
                onChange={handleConfigurationKey}
              />
            </Form.Group>
          </Form>
        </Row>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Output</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="OutputType">Output Type</Form.Label>
              <Form.Select
                value={selectedOutputType}
                onChange={handleOutputTypeSelectChange}
              >
                <option value="xml">xml</option>
                <option value="text">text</option>
                <option value="java">java</option>
              </Form.Select>
              <Form.Label className="OutputMethod">Output Method</Form.Label>
              <Form.Select
                value={selectedOutputMethod}
                onChange={handleOutputMethodSelectChange}
              >
                <option value="Default">Default</option>
                <option value="Property">Property</option>
                <option value="Expression">Expression</option>
              </Form.Select>
              {selectedOutputMethod === "Property" && (
                <>
                  <Form.Label className="OutputProperty">
                    Output Property
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="eg: Output Property"
                    value={outputProperty}
                    onChange={handleOutputProperty}
                  />
                </>
              )}
              {selectedOutputMethod === "Expression" && (
                <>
                  <Form.Label className="OutputAction">
                    Output Action
                  </Form.Label>
                  <Form.Select
                    value={selectedOutputAction}
                    onChange={handleOutputActionSelectChange}
                  >
                    <option value="Add">Add</option>
                    <option value="Replace">Replace</option>
                    <option value="Sibling">Sibling</option>
                  </Form.Select>
                  <Form.Label className="OutputExpression">
                    Output Expression
                  </Form.Label>
                  {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                  <Form.Control
                    type="text"
                    readOnly
                    value={outputExpression}
                    onChange={handleOutputExpression}
                  />
                </>
              )}
            </Form.Group>
          </Form>
        </Row>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Misc</Modal.Title>
          <Form>
            <Form.Group>
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
