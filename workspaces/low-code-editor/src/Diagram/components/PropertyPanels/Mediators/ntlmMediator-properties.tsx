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

export function NTLMMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };

  const [description, setDescription] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [host, setHost] = useState("");
  const [domain, setDomain] = useState("");
  const [ntlmVersion, setNtlmVersion] = useState("");
  const [UserNameEx, setUserNameEx] = useState("");
  const [passwordEx, setPasswordEx] = useState("");
  const [hostEx, setHostEx] = useState("");
  const [domainEx, setDomainEx] = useState("");
  const [ntlmVersionEx, setNtlmVersionEx] = useState("");

  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };
  const handleUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleHost = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHost(event.target.value);
  };
  const handleDomain = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(event.target.value);
  };
  const handleNtlmVersion = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNtlmVersion(event.target.value);
  };
  const handleUserNameEx = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserNameEx(event.target.value);
  };
  const handlePasswordEx = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordEx(event.target.value);
  };
  const handleHostEx = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHostEx(event.target.value);
  };
  const handleDoaminEx = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDomainEx(event.target.value);
  };
  const handleNtlmVersionEx = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNtlmVersionEx(event.target.value);
  };

  return (
    <>
      <Modal
        show={props.modalOpen}
        onHide={handleCancelClick}
        dialogClassName="custom-modal-dialog"
      >
        <Modal.Header>
          <Modal.Title className="text-primary">NTLM Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Properties</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="description">Description</Form.Label>
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
                <Form.Label className="UserName">User Name</Form.Label>
                <div className="row">
                  <div className="col-auto">
                    <Form.Control
                      type="text"
                      placeholder="Ex"
                      readOnly
                      className="small-text"
                      value={UserNameEx}
                      onChange={handleUserNameEx}
                    />
                    {/* When a user clicks this EX textbox, the Expression Selector Model appears*/}
                  </div>
                  <div className="col">
                    <Form.Control
                      type="text"
                      placeholder="eg: Username"
                      className="large-space"
                      value={userName}
                      onChange={handleUserName}
                    />
                  </div>
                </div>
                <Form.Label className="Password">Password</Form.Label>
                <div className="row">
                  <div className="col-auto">
                    <Form.Control
                      type="text"
                      placeholder="Ex"
                      readOnly
                      className="small-text"
                      value={passwordEx}
                      onChange={handlePasswordEx}
                    />
                    {/* When a user clicks this EX textbox, the Expression Selector Model appears*/}
                  </div>
                  <div className="col">
                    <Form.Control
                      type="text"
                      placeholder="eg: Password"
                      className="large-space"
                      value={password}
                      onChange={handlePassword}
                    />
                  </div>
                </div>
                <Form.Label className="Host">Host</Form.Label>
                <div className="row">
                  <div className="col-auto">
                    <Form.Control
                      type="text"
                      placeholder="Ex"
                      readOnly
                      className="small-text"
                      value={hostEx}
                      onChange={handleHostEx}
                    />
                    {/* When a user clicks this EX textbox, the Expression Selector Model appears*/}
                  </div>
                  <div className="col">
                    <Form.Control
                      type="text"
                      placeholder="eg: Host"
                      className="large-space"
                      value={host}
                      onChange={handleHost}
                    />
                  </div>
                </div>
                <Form.Label className="Domain">Domain</Form.Label>
                <div className="row">
                  <div className="col-auto">
                    <Form.Control
                      type="text"
                      placeholder="Ex"
                      readOnly
                      className="small-text"
                      value={domainEx}
                      onChange={handleDoaminEx}
                    />
                    {/* When a user clicks this EX textbox, the Expression Selector Model appears*/}
                  </div>
                  <div className="col">
                    <Form.Control
                      type="text"
                      placeholder="eg: Domain"
                      className="large-space"
                      value={domain}
                      onChange={handleDomain}
                    />
                  </div>
                </div>
                <Form.Label className="NtlmVersion">Ntlm Version</Form.Label>
                <div className="row">
                  <div className="col-auto">
                    <Form.Control
                      type="text"
                      placeholder="Ex"
                      readOnly
                      className="small-text"
                      value={ntlmVersionEx}
                      onChange={handleNtlmVersionEx}
                    />
                    {/* When a user clicks this EX textbox, the Expression Selector Model appears*/}
                  </div>
                  <div className="col">
                    <Form.Control
                      type="text"
                      placeholder="eg: Ntlm Version"
                      className="large-space"
                      value={ntlmVersion}
                      onChange={handleNtlmVersion}
                    />
                  </div>
                </div>
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
