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
  selectedAvailableTemplates: string;
  parameterName: string;
  targetProperty: string;
  onError: string;
  description: string;
};

export function CallTemplateMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [selectedAvailableTemplates, setSelectedAvailableTemplates] =
    useState<string>("SelectFromTemplates");
  const [parameterName, setParameterName] = useState<string>("Parameter Name");
  const [targetProperty, setTargetProperty] =
    useState<string>("Target Property");
  const [onError, setOnError] = useState<string>("OnError");
  const [description, setDescription] = useState<string>("Description");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleAvailableTemplatesSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedAvailableTemplates(event.target.value);
  };
  const handleParameterName = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setParameterName(event.target.value);
  };
  const handleTargetProperty = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetProperty(event.target.value);
  };
  const handleOnError = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnError(event.target.value);
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
    setSelectedAvailableTemplates("SelectFromTemplates");
    setParameterName("");
    setTargetProperty("");
    setOnError("");
    setDescription("");
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          Call Template Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Properties</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="AvailableTemplates">
                Available Templates
              </Form.Label>
              <Form.Select
                value={selectedAvailableTemplates}
                onChange={handleAvailableTemplatesSelectChange}
              >
                <option value="SelectFromTemplates">
                  Select From Templates
                </option>
              </Form.Select>
              <Form.Label className="ParameterName">Parameter Name</Form.Label>
              {/* When a user clicks this textbox, the CallTemplateParameter Model appears.*/}
              <Form.Control
                as="textarea"
                style={{ minHeight: "100px" }}
                value={parameterName}
                onChange={handleParameterName}
                readOnly
              />
              <Form.Label className="TargetProperty">
                Target Property
              </Form.Label>
              <Form.Control
                type="text"
                value={targetProperty}
                onChange={handleTargetProperty}
                placeholder="eg: Target Property"
              />
              <Form.Label className="OnError">OnError</Form.Label>
              {/* When a user clicks this textbox, the Resource Key Model appears.*/}
              <Form.Control
                type="text"
                value={onError}
                onChange={handleOnError}
                readOnly
              />
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
