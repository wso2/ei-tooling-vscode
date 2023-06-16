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
  headerName: string;
  selectedHeaderAction: string;
  selectedValueType: string;
  valueLiteral: string;
  valueExpression: string;
  valueInlineEx: string;
  selectedScope: string;
  description: string;
};
export function HeaderMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [headerName, setHeaderName] = useState<string>("");
  const [selectedHeaderAction, setSelectedHeaderAction] =
    useState<string>("set");
  const [selectedValueType, setSelectedValueType] = useState<string>("LITERAL");
  const [valueLiteral, setValueLiteral] = useState<string>("");
  const [valueExpression, setValueExpression] = useState<string>("");
  const [valueInlineEx, setValueInlineEx] = useState<string>("");
  const [selectedScope, setSelectedScope] = useState<string>("default");
  const [description, setDescription] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleHeaderName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderName(event.target.value);
  };
  const handleHeaderActionSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedHeaderAction(event.target.value);
  };
  const handleValueTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedValueType(event.target.value);
  };
  const handleValueLiteral = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueLiteral(event.target.value);
  };
  const handleValueExpression = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValueExpression(event.target.value);
  };
  const handleValueInlineEx = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueInlineEx(event.target.value);
  };
  const handleScopeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedScope(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  const handleSubmit = async () => {
    if (!getDiagramEditorLangClient || !textEdit) {
      return [];
    }
    const langClient = await getDiagramEditorLangClient();
    let snippetCompletionResponse: SnippetCompletionResponse =
      await getSnippetCompletion(
        headerName,
        selectedHeaderAction,
        selectedValueType,
        valueLiteral,
        // valueExpression,
        // valueInlineEx,
        // selectedScope,
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
    setHeaderName("");
    setSelectedHeaderAction("set");
    setSelectedValueType("LITERAL");
    setValueLiteral("");
    setValueExpression("");
    setValueInlineEx("");
    setSelectedScope("default");
    setDescription("");
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          Header Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Properties</Modal.Title>
          <Form>
            <Form.Group>
              {(selectedValueType !== "INLINE" ||
                selectedHeaderAction === "remove") && (
                <>
                  <Form.Label className="HeaderName">Header Name</Form.Label>
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id="help-tooltip">
                        The name of the header element
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
                    value={headerName}
                    onChange={handleHeaderName}
                  />
                </>
              )}

              <Form.Label className="HeaderAction">Header Action</Form.Label>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="help-tooltip">
                    Set: <br />
                    if you want to set the header as a new header <br /> <br />
                    Remove: <br /> if you want to remove the header from the
                    incoming message
                  </Tooltip>
                }
              >
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Select
                value={selectedHeaderAction}
                onChange={handleHeaderActionSelectChange}
              >
                <option value="set">set</option>
                <option value="remove">remove</option>
              </Form.Select>
              {selectedHeaderAction === "set" && (
                <>
                  <br />
                  <Row className="mb-4">
                    <Modal.Title className="text-secondary">
                      Header Value
                    </Modal.Title>
                    <Form>
                      <Form.Group>
                        <Form.Label className="ValueType">
                          Value Type
                        </Form.Label>
                        <Form.Select
                          value={selectedValueType}
                          onChange={handleValueTypeSelectChange}
                        >
                          <option value="LITERAL">LITERAL</option>
                          <option value="EXPRESSION">EXPRESSION</option>
                          <option value="INLINE">INLINE</option>
                        </Form.Select>
                        {selectedValueType === "LITERAL" && (
                          <>
                            <Form.Label className="ValueLiteral">
                              Value Literal
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="eg: Value for Literal"
                              value={valueLiteral}
                              onChange={handleValueLiteral}
                            />
                          </>
                        )}
                        {selectedValueType === "EXPRESSION" && (
                          <>
                            <Form.Label className="ValueExpression">
                              Value Expression
                            </Form.Label>
                            {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                            <Form.Control
                              type="text"
                              readOnly
                              value={valueExpression}
                              onChange={handleValueExpression}
                            />
                          </>
                        )}
                        {selectedValueType === "INLINE" && (
                          <>
                            <Form.Label className="ValueExpression">
                              Value Expression
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="eg: Value for Inline"
                              value={valueInlineEx}
                              onChange={handleValueInlineEx}
                            />
                          </>
                        )}
                      </Form.Group>
                    </Form>
                  </Row>
                </>
              )}
              <Form.Label className="Scope<">Scope</Form.Label>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="help-tooltip">
                    Synapse: <br />
                    To manipulate the SOAP headers <br /> <br />
                    Transport: <br /> To manipulate the HTTP headers
                  </Tooltip>
                }
              >
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Select
                value={selectedScope}
                onChange={handleScopeSelectChange}
              >
                <option value="default">default</option>
                <option value="transport">transport</option>
              </Form.Select>
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
