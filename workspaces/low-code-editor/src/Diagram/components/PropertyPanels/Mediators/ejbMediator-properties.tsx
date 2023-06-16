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
  beanstalk: string;
  ejbClass: string;
  ejbMethod: string;
  selectedCheckboxMethod: string;
  target: string;
  jndiName: string;
  methodArguments: string;
  selectedSessionIdType: string;
  sessionIdLiteral: string;
  sessionIdExpression: string;
  description: string;
};
export function EJBMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [beanstalk, setBeanstalk] = useState<string>("");
  const [ejbClass, setEJBClass] = useState<string>("");
  const [ejbMethod, setEJBMethod] = useState<string>("");
  const [selectedCheckboxMethod, setSelectedCheckboxMethod] =
    useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [jndiName, setJNDIName] = useState<string>("");
  const [methodArguments, setMethodArguments] = useState<string>("");
  const [selectedSessionIdType, setSelectedSessionIdType] =
    useState<string>("LITERAL");
  const [sessionIdLiteral, setSessionIdLiteral] = useState<string>("");
  const [sessionIdExpression, setSessionIdExpression] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleBeanstalk = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBeanstalk(e.target.value);
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
  const handleSubmit = async () => {
    if (!getDiagramEditorLangClient || !textEdit) {
      return [];
    }
    const langClient = await getDiagramEditorLangClient();
    let snippetCompletionResponse: SnippetCompletionResponse =
      await getSnippetCompletion(
        beanstalk,
        ejbClass,
        ejbMethod,
        selectedCheckboxMethod,
        // target,
        // jndiName,
        // methodArguments,
        // selectedSessionIdType,
        // sessionIdLiteral,
        // sessionIdExpression,
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
    setBeanstalk("");
    setEJBClass("");
    setEJBMethod("");
    setSelectedCheckboxMethod("");
    setTarget("");
    setJNDIName("");
    setMethodArguments("");
    setSelectedSessionIdType("LITERAL");
    setSessionIdLiteral("");
    setSessionIdExpression("");
    setDescription("");
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          EJB Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
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
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Control
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
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Control
                type="text"
                placeholder="eg: /Class"
                value={ejbClass}
                onChange={handleClass}
              />
              <Form.Label className="Method">Method</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg: /Method"
                value={ejbMethod}
                onChange={handleMethod}
              />
              <Form.Group style={{ textAlign: "left" }}>
                <br />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Check
                    type="checkbox"
                    className="Remove"
                    label={<span style={{ marginLeft: "10px" }}>Remove</span>}
                    checked={selectedCheckboxMethod === "Remove"}
                    value="Remove"
                    onChange={handleRemoveChange}
                  />
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id="help-tooltip">
                        Specifies whether the Enterprise Entity Manager should
                        remove the EJB context related parameters once the state
                        full/ stateless session is invoked
                      </Tooltip>
                    }
                  >
                    <span style={{ marginLeft: "10px", cursor: "pointer" }}>
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
                    saved against the name provided in the target at the synapse
                    property context
                  </Tooltip>
                }
              >
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Control
                type="text"
                value={target}
                onChange={handleTarget}
                placeholder="eg: Target"
              />
              <Form.Label className="Context">JNDI Name</Form.Label>
              <Form.Control
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
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              {/* When a user clicks this textbox, the MethodArgument Model appears.*/}
              <Form.Control
                as="textarea"
                style={{ minHeight: "200px" }}
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
                          When the EJB context is invoked in the form state-full
                          bean then the related EJB session status specified
                          will be stored in here
                        </Tooltip>
                      }
                    >
                      <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                        <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                      </span>
                    </OverlayTrigger>
                    <Form.Select
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
      </Modal.Body>{" "}
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
