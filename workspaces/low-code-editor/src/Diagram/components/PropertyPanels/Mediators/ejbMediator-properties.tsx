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

export function EJBMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };

  const [beanstalk, setBeanstalk] = useState("");
  const [ejbClass, setEJBClass] = useState("");
  const [ejbMethod, setEJBMethod] = useState("");
  const [selectedCheckboxMethod, setSelectedCheckboxMethod] = useState("");
  const [target, setTarget] = useState("");
  const [jndiName, setJNDIName] = useState("");
  const [methodArguments, setMethodArguments] = useState("");
  const [selectedSessionIdType, setSelectedSessionIdType] = useState("LITERAL");
  const [sessionIdLiteral, setSessionIdLiteral] = useState("");
  const [sessionIdExpression, setSessionIdExpression] = useState("");
  const [description, setDescription] = useState("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleBeanstalk = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBeanstalk(event.target.value);
  };
  const handleClass = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEJBClass(event.target.value);
  };
  const handleMethod = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEJBMethod(event.target.value);
  };
  const handleRemoveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCheckboxMethod(event.target.value);
  };
  const handleTarget = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTarget(event.target.value);
  };
  const handleJNDIName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJNDIName(event.target.value);
  };
  const handleMethodArguments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMethodArguments(event.target.value);
  };
  const handleSessionIdTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSessionIdType(event.target.value);
  };
  const handleSessionIdLiteral = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSessionIdLiteral(event.target.value);
  };
  const handleSessionIdExpression = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSessionIdExpression(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  return (
    <>
      <Modal
        show={props.modalOpen}
        onHide={handleCancelClick}
        dialogClassName="custom-modal-dialog"
      >
        <Modal.Header>
          <Modal.Title className="text-primary">EJB Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Properties</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="Beanstalk">Beanstalk</Form.Label>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">
                      Reference to the application server specific connection
                      source information, which is defined at the
                      synapse.properties
                    </Tooltip>
                  }
                >
                  <span className="custom-question-icon">
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                <Form.Control
                  className="custom-form-control"
                  type="text"
                  placeholder="eg: Beanstalk"
                  value={beanstalk}
                  onChange={handleBeanstalk}
                />
                <Form.Label className="Class">Class</Form.Label>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">
                      This required the remote interface definition provided in
                      the EJB 3.0 &#40;EJB service invocation remote/home
                      interface&#41;
                    </Tooltip>
                  }
                >
                  <span className="custom-question-icon">
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                <Form.Control
                  className="custom-form-control"
                  type="text"
                  placeholder="eg: /Class"
                  value={ejbClass}
                  onChange={handleClass}
                />
                <Form.Label className="Method">Method</Form.Label>
                <Form.Control
                  className="custom-form-control"
                  type="text"
                  placeholder="eg: /Method"
                  value={ejbMethod}
                  onChange={handleMethod}
                />
                <Form.Group style={{ textAlign: "left" }}>
                  <br />
                  <div>
                    <Form.Check
                      type="checkbox"
                      className="checkbox"
                      label={<span className="checkbox-font">Remove</span>}
                      checked={selectedCheckboxMethod === "Remove"}
                      value="Remove"
                      onChange={handleRemoveChange}
                    />
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id="help-tooltip">
                          Specifies whether the Enterprise Entity Manager should
                          remove the EJB context related parameters once the
                          state full/ stateless session is invoked
                        </Tooltip>
                      }
                    >
                      <span className="custom-question-icon">
                        <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                      </span>
                    </OverlayTrigger>
                  </div>
                </Form.Group>
                <Form.Label className="Target">Target</Form.Label>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">
                      If a particular EJB method returns, then the object can be
                      saved against the name provided in the target at the
                      synapse property context
                    </Tooltip>
                  }
                >
                  <span className="custom-question-icon">
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                <Form.Control
                  className="custom-form-control"
                  type="text"
                  value={target}
                  onChange={handleTarget}
                  placeholder="eg: Target"
                />
                <Form.Label className="Context">JNDI Name</Form.Label>
                <Form.Control
                  className="custom-form-control"
                  type="text"
                  value={jndiName}
                  onChange={handleJNDIName}
                  placeholder="eg: JNDI Name"
                />
                <Form.Label className="MethodArguments">
                  Method Arguments
                </Form.Label>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">
                      Can be used to define the arguments which is required for
                      the particular EJB method to be invoked Expression/Value
                    </Tooltip>
                  }
                >
                  <span className="custom-question-icon">
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                {/* When a user clicks this textbox, the MethodArgument Model appears.*/}
                <Form.Control
                  className="custom-form-control"
                  as="textarea"
                  readOnly
                  value={methodArguments}
                  onChange={handleMethodArguments}
                />
                <br />
                <Row className="mb-4">
                  <Modal.Title className="text-secondary">Session</Modal.Title>
                  <Form>
                    <Form.Group>
                      <Form.Label className="SessionIdType">
                        Session Id Type
                      </Form.Label>
                      <OverlayTrigger
                        placement="right"
                        overlay={
                          <Tooltip id="help-tooltip">
                            When the EJB context is invoked in the form
                            state-full bean then the related EJB session status
                            specified will be stored in here
                          </Tooltip>
                        }
                      >
                        <span className="custom-question-icon">
                          <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                        </span>
                      </OverlayTrigger>
                      <Form.Select
                        className="custom-form-control"
                        value={selectedSessionIdType}
                        onChange={handleSessionIdTypeSelectChange}
                      >
                        <option value="LITERAL">LITERAL</option>
                        <option value="EXPRESSION">EXPRESSION</option>
                      </Form.Select>
                      {selectedSessionIdType === "LITERAL" && (
                        <>
                          <Form.Label className="SessionIdLiteral">
                            Session Id Literal
                          </Form.Label>
                          <Form.Control
                            className="custom-form-control"
                            type="text"
                            placeholder="eg: Session Id Literal"
                            value={sessionIdLiteral}
                            onChange={handleSessionIdLiteral}
                          />
                        </>
                      )}
                      {selectedSessionIdType === "EXPRESSION" && (
                        <>
                          <Form.Label className="SessionIdExpression">
                            Session Id Expression
                          </Form.Label>
                          {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                          <Form.Control
                            className="custom-form-control"
                            type="text"
                            readOnly
                            value={sessionIdExpression}
                            onChange={handleSessionIdExpression}
                          />
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
