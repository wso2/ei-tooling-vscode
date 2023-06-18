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
  selectedAction: string;
  selectedValueType: string;
  selectedTargetType: string;
  createClass: string;
  variable: string;
  property: string;
  valueLiteral: string;
  valueExpression: string;
  targetLiteral: string;
  targetExpression: string;
  description: string;
};
export function BeanMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [selectedAction, setSelectedAction] = useState<string>("CREATE");
  const [selectedValueType, setSelectedValueType] = useState<string>("LITERAL");
  const [selectedTargetType, setSelectedTargetType] =
    useState<string>("LITERAL");
  const [createClass, setCreateClass] = useState<string>("");
  const [variable, setVariable] = useState<string>("");
  const [property, setProperty] = useState<string>("");
  const [valueLiteral, setValueLiteral] = useState<string>("");
  const [valueExpression, setValueExpression] = useState<string>("");
  const [targetLiteral, setTargetLiteral] = useState<string>("");
  const [targetExpression, setTargetExpression] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAction(event.target.value);
  };

  const handleValueTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValueType(event.target.value);
  };

  const handleTargetTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTargetType(event.target.value);
  };

  const handleCreateClassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreateClass(event.target.value);
  };

  const handleVariable = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVariable(event.target.value);
  };

  const handleProperty = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProperty(event.target.value);
  };
  const handleValueLiteral = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueLiteral(event.target.value);
  };
  const handleValueExpression = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValueExpression(event.target.value);
  };
  const handleTargetLiteral = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetLiteral(event.target.value);
  };
  const handleTargetExpression = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTargetExpression(event.target.value);
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
    setSelectedAction("CREATE");
    setSelectedValueType("LITERAL");
    setSelectedTargetType("LITERAL");
    setCreateClass("");
    setVariable("");
    setProperty("");
    setValueLiteral("");
    setValueExpression("");
    setTargetLiteral("");
    setTargetExpression("");
    setDescription("");
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          Bean Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Properties</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="Action">Action</Form.Label>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="help-tooltip">
                    CREATE:
                    <br />
                    This action creates a new JavaBean
                    <br />
                    <br />
                    REMOVE:
                    <br />
                    This action removes an existing JavaBean
                    <br />
                    <br />
                    SET_PROPERTY:
                    <br />
                    This action sets a property of an existing JavaBean
                    <br />
                    <br />
                    GET_PROPERTY:
                    <br />
                    This action retrieves a property of an existing JavaBean
                  </Tooltip>
                }
              >
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Select value={selectedAction} onChange={handleActionChange}>
                <option value="CREATE">CREATE</option>
                <option value="REMOVE">REMOVE</option>
                <option value="SET_PROPERTY">SET_PROPERTY</option>
                <option value="GET_PROPERTY">GET_PROPERTY</option>
              </Form.Select>
              <Form.Label className="Var">Var</Form.Label>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="help-tooltip">
                    The variable which is created, removed, set or retrieved for
                    the JavaBeans based on the value selected for the Action
                    Parameter
                  </Tooltip>
                }
              >
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Control
                type="text"
                placeholder="eg: Var"
                value={variable}
                onChange={handleVariable}
              />
              {selectedAction === "CREATE" && (
                <>
                  <Form.Label className="Class">Class</Form.Label>
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id="help-tooltip">
                        The class on which the action selected for the Action
                        parameter is performed by the Beanstalks manager
                      </Tooltip>
                    }
                  >
                    <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                      <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                    </span>
                  </OverlayTrigger>
                  <Form.Control
                    type="text"
                    placeholder="eg: Class"
                    value={createClass}
                    onChange={handleCreateClassChange}
                  />
                </>
              )}
              {selectedAction === "REMOVE" && <></>}
              {selectedAction === "SET_PROPERTY" && (
                <>
                  <Form.Label className="Property">Property</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="eg: Property"
                    value={property}
                    onChange={handleProperty}
                  />
                  <br />
                  <Row className="mb-4">
                    <Modal.Title className="text-secondary">Value</Modal.Title>
                    <Form>
                      <Form.Group>
                        <Form.Label className="ValueType">
                          Value Type
                        </Form.Label>
                        <Form.Select
                          value={selectedValueType}
                          onChange={handleValueTypeChange}
                        >
                          <option value="LITERAL">LITERAL</option>
                          <option value="EXPRESSION">EXPRESSION</option>
                        </Form.Select>
                        {selectedValueType === "LITERAL" && (
                          <>
                            <Form.Label className="Literal">Literal</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="eg: Literal"
                              value={valueLiteral}
                              onChange={handleValueLiteral}
                            />
                          </>
                        )}
                        {selectedValueType === "EXPRESSION" && (
                          <>
                            <Form.Label className="Expression">
                              Expression
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
                      </Form.Group>
                    </Form>
                  </Row>
                </>
              )}
              {selectedAction === "GET_PROPERTY" && (
                <>
                  <Form.Label className="Property">Property</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="eg: Property"
                    value={property}
                    onChange={handleProperty}
                  />
                  <br />
                  <Row className="mb-4">
                    <Modal.Title className="text-secondary">Target</Modal.Title>
                    <Form>
                      <Form.Group>
                        <Form.Label className="TargetType">
                          Target Type
                        </Form.Label>
                        <Form.Select
                          value={selectedTargetType}
                          onChange={handleTargetTypeChange}
                        >
                          <option value="LITERAL">LITERAL</option>
                          <option value="EXPRESSION">EXPRESSION</option>
                        </Form.Select>
                        {selectedTargetType === "LITERAL" && (
                          <>
                            <Form.Label className="Literal">Literal</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="eg: Literal"
                              value={targetLiteral}
                              onChange={handleTargetLiteral}
                            />
                          </>
                        )}
                        {selectedTargetType === "EXPRESSION" && (
                          <>
                            <Form.Label className="Expression">
                              Expression
                            </Form.Label>
                            {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                            <Form.Control
                              type="text"
                              readOnly
                              value={targetExpression}
                              onChange={handleTargetExpression}
                            />
                          </>
                        )}
                      </Form.Group>
                    </Form>
                  </Row>
                </>
              )}
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
