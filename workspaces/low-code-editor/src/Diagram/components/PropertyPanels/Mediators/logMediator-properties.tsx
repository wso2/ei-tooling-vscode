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
  selectedVersionType: string;
  selectedLogLevel: string;
  logSeparator: string;
  properties: string;
  description: any;
};

export function LogMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [selectedVersionType, setSelectedVersionType] =
    useState<string>("INFO");
  const [selectedLogLevel, setSelectedLogLevel] = useState<string>("SIMPLE");
  const [logSeparator, setLogSeparator] = useState<string>("");
  const [properties, setProperties] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleVersionTypeSelectChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedVersionType(event.target.value);
  };
  const handleLogLevelSelectChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLogLevel(event.target.value);
  };
  const handleLogSeparatorChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLogSeparator(event.target.value);
  };
  const handlePropertiesChange = async (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setProperties(event.target.value);
  };
  const handleDescriptionChange = async (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async () => {
    if (!getDiagramEditorLangClient || !textEdit) {
      return [];
    }
    const langClient = await getDiagramEditorLangClient();
    let snippetCompletionResponse: SnippetCompletionResponse =
      await getSnippetCompletion(
        selectedLogLevel,
        selectedVersionType,
        logSeparator,
        properties,
        description,
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
    setSelectedVersionType("INFO");
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          Log Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Properties</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="VersionType">Version Type</Form.Label>
              <Form.Select
                value={selectedVersionType}
                onChange={handleVersionTypeSelectChange}
              >
                <option value="INFO">INFO</option>
                <option value="TRACE">TRACE</option>
                <option value="DEBUG">DEBUG</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
                <option value="FATAL">FATAL</option>
              </Form.Select>
              <Form.Label className="LogLevel">Log Level</Form.Label>
              <Form.Select
                value={selectedLogLevel}
                onChange={handleLogLevelSelectChange}
              >
                <option value="SIMPLE">SIMPLE</option>
                <option value="HEADERS">HEADERS</option>
                <option value="FULL">FULL</option>
                <option value="CUSTOM">CUSTOM</option>
              </Form.Select>
              <Form.Label className="LogSeparator">Log Separator</Form.Label>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="help-tooltip">
                    This parameter is used to specify a value to be used in the
                    log to separate attributes. The comma is default. Can be add
                    tab as "/t" and new line as "/n"
                  </Tooltip>
                }
              >
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Control
                type="text"
                value={logSeparator}
                onChange={handleLogSeparatorChange}
                placeholder=" "
              />
              <Form.Label className="Properties">Properties</Form.Label>
              {/* When a user clicks this textbox, the LogProperty Model appears.*/}
              <Form.Control
                as="textarea"
                value={properties}
                onChange={handlePropertiesChange}
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
                onChange={handleDescriptionChange}
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
