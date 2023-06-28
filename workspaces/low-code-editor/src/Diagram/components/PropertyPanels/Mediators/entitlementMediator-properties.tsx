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

export function EntitlementMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };

  const [entitlementServerURL, setEntitlementServerURL] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCallbackHandler, setSelectedCallbackHandler] = useState("");
  const [callbackClassName, setCallbackClassName] = useState("");
  const [selectedEntitlementClientType, setSelectedEntitlementClientType] =
    useState("SOAPBasicAuth");
  const [thriftHost, setThriftHost] = useState("");
  const [thriftPort, setThriftPort] = useState("");
  const [description, setDescription] = useState("");
  const [selectedOnAcceptSeqType, setSelectedOnAcceptSeqType] =
    useState("ANONYMOUS");
  const [onAcceptSeqKey, setOnAcceptSeqKey] = useState("");
  const [selectedOnRejectSeqType, setSelectedOnRejectSeqType] =
    useState("ANONYMOUS");
  const [onRejectSeqKey, setOnRejectSeqKey] = useState("");
  const [selectedObligationSeqType, setSelectedObligationSeqType] =
    useState("ANONYMOUS");
  const [obligationSeqKey, setObligationSeqKey] = useState("");
  const [selectedAdviceSeqType, setSelectedAdviceSeqType] =
    useState("ANONYMOUS");
  const [adviceSeqKey, setAdviceSeqKey] = useState("");

  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleEntitlementServerURL = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEntitlementServerURL(event.target.value);
  };
  const handleUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleCallbackHandlerSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCallbackHandler(event.target.value);
  };
  const handleCallbackClassName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCallbackClassName(event.target.value);
  };
  const handleEntitlementClientTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedEntitlementClientType(event.target.value);
  };
  const handleThriftHost = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThriftHost(event.target.value);
  };
  const handleThriftPort = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThriftPort(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  const handleOnAcceptSeqTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOnAcceptSeqType(event.target.value);
  };
  const handleOnAcceptSeqKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnAcceptSeqKey(event.target.value);
  };
  const handleOnRejectSeqTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOnRejectSeqType(event.target.value);
  };
  const handleOnRejectSeqKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnRejectSeqKey(event.target.value);
  };
  const handleObligationSeqTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedObligationSeqType(event.target.value);
  };
  const handleObligationSeqKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setObligationSeqKey(event.target.value);
  };
  const handleAdviceSeqTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedAdviceSeqType(event.target.value);
  };
  const handleAdviceSeqKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdviceSeqKey(event.target.value);
  };

  return (
    <>
      <Modal
        show={props.modalOpen}
        onHide={handleCancelClick}
        dialogClassName="custom-modal-dialog"
      >
        <Modal.Header>
          <Modal.Title className="text-primary">
            Entitlement Mediator
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Properties</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="EntitlementServerURL">
                  Entitlement Server URL
                </Form.Label>
                <Form.Control
                  className="custom-form-control"
                  type="text"
                  placeholder="eg: Entitlement Server URL"
                  value={entitlementServerURL}
                  onChange={handleEntitlementServerURL}
                />
                <Form.Label className="UserName">Username</Form.Label>
                <Form.Control
                  className="custom-form-control"
                  type="text"
                  placeholder="eg: Username"
                  value={userName}
                  onChange={handleUserName}
                />
                <Form.Label className="Password">Password</Form.Label>
                <Form.Control
                  className="custom-form-control"
                  type="text"
                  placeholder="eg: Password"
                  value={password}
                  onChange={handlePassword}
                />
                <Form.Label className="CallbackHandler">
                  Callback handler
                </Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedCallbackHandler}
                  onChange={handleCallbackHandlerSelectChange}
                >
                  <option value="UT">UT</option>
                  <option value="X509">X509</option>
                  <option value="SAML">SAML</option>
                  <option value="Kerberos">Kerberos</option>
                  <option value="Custom">Custom</option>
                </Form.Select>
                {selectedCallbackHandler === "Custom" && (
                  <>
                    <Form.Label className="CallbackClassName">
                      Callback Class Name
                    </Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      placeholder="eg: Callback Class Name"
                      value={callbackClassName}
                      onChange={handleCallbackClassName}
                    />
                  </>
                )}
                <Form.Label className="EntitlementClientType">
                  Entitlement Client Type
                </Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedEntitlementClientType}
                  onChange={handleEntitlementClientTypeSelectChange}
                >
                  <option value="SOAPBasicAuth">
                    SOAP - Basic Auth &#40;WSO2 IS 4.0.0 or later&#41;
                  </option>
                  <option value="Thrift">Thrift</option>
                  <option value="SOAPAuthentication">
                    SOAP - Authentication Admin &#40;WSO2 IS 3.2.3 or
                    earlier&#41;
                  </option>
                  <option value="WSXACML">WSXACML</option>
                </Form.Select>
                {selectedEntitlementClientType === "Thrift" && (
                  <>
                    <Form.Label className="ThriftHost">Thrift Host</Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      placeholder="eg: Thrift Host"
                      value={thriftHost}
                      onChange={handleThriftHost}
                    />
                    <Form.Label className="ThriftPort">Thrift Port</Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      placeholder="eg: Thrift Port"
                      value={thriftPort}
                      onChange={handleThriftPort}
                    />
                  </>
                )}
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
          <br />
          <Row className="mb-4">
            <Modal.Title className="text-secondary">On Acceptance</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="OnAcceptSeqType">
                  On Acceptance Sequence Type
                </Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedOnAcceptSeqType}
                  onChange={handleOnAcceptSeqTypeSelectChange}
                >
                  <option value="ANONYMOUS">ANONYMOUS</option>
                  <option value="REGISTRY_REFERENCE">Registry Reference</option>
                </Form.Select>
                {selectedOnAcceptSeqType === "REGISTRY_REFERENCE" && (
                  <>
                    <Form.Label className="OnAcceptSeqKey">
                      On Accept Sequence Key
                    </Form.Label>
                    {/* When a user clicks this textbox, the Resource KeyModel appears.*/}
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      readOnly
                      value={onAcceptSeqKey}
                      onChange={handleOnAcceptSeqKey}
                    />
                  </>
                )}
              </Form.Group>
            </Form>
          </Row>
          <br />
          <Row className="mb-4">
            <Modal.Title className="text-secondary">On Rejection</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="OnRejectSeqType">
                  On Rejection Sequence Type
                </Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedOnRejectSeqType}
                  onChange={handleOnRejectSeqTypeSelectChange}
                >
                  <option value="ANONYMOUS">ANONYMOUS</option>
                  <option value="REGISTRY_REFERENCE">Registry Reference</option>
                </Form.Select>
                {selectedOnRejectSeqType === "REGISTRY_REFERENCE" && (
                  <>
                    <Form.Label className="OnRejectSeqKey">
                      On Reject Sequence Key
                    </Form.Label>
                    {/* When a user clicks this textbox, the Resource KeyModel appears.*/}
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      readOnly
                      value={onRejectSeqKey}
                      onChange={handleOnRejectSeqKey}
                    />
                  </>
                )}
              </Form.Group>
            </Form>
          </Row>
          <br />
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Obligations</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="ObligationSeqType">
                  Obligation Sequence Type
                </Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedObligationSeqType}
                  onChange={handleObligationSeqTypeSelectChange}
                >
                  <option value="ANONYMOUS">ANONYMOUS</option>
                  <option value="REGISTRY_REFERENCE">Registry Reference</option>
                </Form.Select>
                {selectedObligationSeqType === "REGISTRY_REFERENCE" && (
                  <>
                    <Form.Label className="ObligationSeqKey">
                      Obligation Sequence Key
                    </Form.Label>
                    {/* When a user clicks this textbox, the Resource KeyModel appears.*/}
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      readOnly
                      value={obligationSeqKey}
                      onChange={handleObligationSeqKey}
                    />
                  </>
                )}
              </Form.Group>
            </Form>
          </Row>
          <br />
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Advice</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="AdviceSeqType">
                  Advice Sequence Type
                </Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedAdviceSeqType}
                  onChange={handleAdviceSeqTypeSelectChange}
                >
                  <option value="ANONYMOUS">ANONYMOUS</option>
                  <option value="REGISTRY_REFERENCE">Registry Reference</option>
                </Form.Select>
                {selectedAdviceSeqType === "REGISTRY_REFERENCE" && (
                  <>
                    <Form.Label className="AdviceSeqKey">
                      Advice Sequence Key
                    </Form.Label>
                    {/* When a user clicks this textbox, the Resource KeyModel appears.*/}
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      readOnly
                      value={adviceSeqKey}
                      onChange={handleAdviceSeqKey}
                    />
                  </>
                )}
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
