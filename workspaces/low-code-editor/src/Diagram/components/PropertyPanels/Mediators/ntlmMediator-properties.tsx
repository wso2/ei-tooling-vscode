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
  description: string;
  userName: string;
  password: string;
  host: string;
  domain: string;
  ntlmVersion: string;
  UserNameEx: string;
  passwordEx: string;
  hostEx: string;
  domainEx: string;
  ntlmVersionEx: string;
};
export function NTLMMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [description, setDescription] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [host, setHost] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [ntlmVersion, setNtlmVersion] = useState<string>("");
  const [UserNameEx, setUserNameEx] = useState<string>("");
  const [passwordEx, setPasswordEx] = useState<string>("");
  const [hostEx, setHostEx] = useState<string>("");
  const [domainEx, setDomainEx] = useState<string>("");
  const [ntlmVersionEx, setNtlmVersionEx] = useState<string>("");
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
  const handleSubmit = async () => {
    if (!getDiagramEditorLangClient || !textEdit) {
      return [];
    }
    const langClient = await getDiagramEditorLangClient();
    let snippetCompletionResponse: SnippetCompletionResponse =
      await getSnippetCompletion(
        description,
        userName,
        password,
        host,
        domain,
        // ntlmVersion,
        // UserNameEx,
        // passwordEx,
        // hostEx,
        // domainEx,
        // ntlmVersionEx,
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
    setDescription("");
    setUserName("");
    setPassword("");
    setHost("");
    setDomain("");
    setNtlmVersion("");
    setUserNameEx("");
    setPasswordEx("");
    setHostEx("");
    setDomainEx("");
    setNtlmVersionEx("");
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          NTLM Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
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
                  />{" "}
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
                  />{" "}
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
                  />{" "}
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
                  />{" "}
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
