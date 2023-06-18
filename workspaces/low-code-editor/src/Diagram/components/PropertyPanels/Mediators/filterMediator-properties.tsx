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
  selectedConditionType: string;
  description: string;
  regularExpression: string;
  source: string;
  xPath: string;
};
export function FilterMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [selectedConditionType, setSelectedConditionType] =
    useState<string>("SandREX");
  const [description, setDescription] = useState<string>("");
  const [regularExpression, setRegularExpression] = useState<string>("");
  const [source, setSource] = useState<string>("Source");
  const [xPath, setXPath] = useState<string>("XPath");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleConditionTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedConditionType(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  const handleRegularExpression = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegularExpression(event.target.value);
  };
  const handleSource = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSource(event.target.value);
  };
  const handleXPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    setXPath(event.target.value);
  };
  const handleSubmit = async () => {
    if (!getDiagramEditorLangClient || !textEdit) {
      return [];
    }
  };
  const handleCancelClick = async () => {
    setSelectedConditionType("SandREX");
    setDescription("");
    setRegularExpression("");
    setSource("");
    setXPath("");
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          Filter Mediator Properties
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
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
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Condition</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="ConditionType">Condition Type</Form.Label>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="help-tooltip">
                    Source and Regular Expression:
                    <br />
                    If this option is selected, the Filter mediator matches the
                    evaluation XPath/JSONPath expression as a string against the
                    given regular expression
                    <br />
                    <br />
                    XPath:
                    <br />
                    If this option is selected, the Filter mediator tests the
                    given XPath/JSONPath expression as a Boolean expression.
                    When specifying a JSONPath, use the format
                    json-eval(&lt;JSON_PATH&gt;), such as
                    json-eval(getQuote.request.symbol)
                  </Tooltip>
                }
              >
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>

              <Form.Select
                onChange={handleConditionTypeSelectChange}
                value={selectedConditionType}
              >
                <option value="SandREX">Source and Regular Expression</option>
                <option value="XPath">XPath</option>
              </Form.Select>
              {selectedConditionType === "SandREX" && (
                <>
                  <Form.Label className="RegularExpression">
                    Regular Expression
                  </Form.Label>
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id="help-tooltip">
                        The regular expression to match source value
                      </Tooltip>
                    }
                  >
                    <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                      <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                    </span>
                  </OverlayTrigger>
                  <Form.Control
                    type="text"
                    placeholder="eg: Regular Expression"
                    value={regularExpression}
                    onChange={handleRegularExpression}
                  />
                  <Form.Label className="Source">Source</Form.Label>
                  {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id="help-tooltip">
                        The expression to locate the value that matches the
                        regular expression that you can define in the Regex
                        parameter
                      </Tooltip>
                    }
                  >
                    <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                      <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                    </span>
                  </OverlayTrigger>
                  <Form.Control
                    type="text"
                    readOnly
                    value={source}
                    onChange={handleSource}
                  />
                </>
              )}
              {selectedConditionType === "XPath" && (
                <>
                  <Form.Label className="XPath">XPath</Form.Label>
                  {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                  <Form.Control
                    type="text"
                    readOnly
                    value={xPath}
                    onChange={handleXPath}
                  />
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
