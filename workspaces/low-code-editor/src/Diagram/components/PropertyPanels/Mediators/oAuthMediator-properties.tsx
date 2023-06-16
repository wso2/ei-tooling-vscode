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
    remoteServiceUrl: string;
    username: string;
    password: string;
  description: string;
};
export function OAuthMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
    const [remoteServiceUrl, setRemoteServiceUrl] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
    const handleRemoteServiceUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemoteServiceUrl(event.target.value);
    };
    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };
    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };
  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  const handleSubmit = async () => {
    if (!getDiagramEditorLangClient || !textEdit) {
      return [];
    }
    // const langClient = await getDiagramEditorLangClient();
    // let snippetCompletionResponse: SnippetCompletionResponse =
    //   await getSnippetCompletion(
    //     remoteServiceUrl
    //     username,
    //     password,
    //     description,
    //     langClient
    //   );
    // textEdit.newText = snippetCompletionResponse.snippet;
    // await modifyTextOnComponentSelection(
    //   textDocumentUrl,
    //   textDocumentFsPath,
    //   textEdit,
    //   previousComponentStartPosition,
    //   langClient
    // );
  };
  const handleCancelClick = async () => {
    setRemoteServiceUrl("");
    setUsername("");
    setPassword("");
    setDescription("");
  };
    return (
        <>
            <Modal.Header>
                <Modal.Title className='text-primary'>OAuth Mediator Property</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <br />
                <Row className='mb-4'>
                    <Modal.Title className='text-secondary'>
                      Properties
                    </Modal.Title>
                    <Form>
                        <Form.Group>
                            <Form.Label className="RemoteServiceUrl">Remote Service Url</Form.Label>
                            <Form.Control type="text" placeholder="eg: Remote Service Url" value={remoteServiceUrl} onChange={handleRemoteServiceUrl} />
                            <br />
                            <Row className='mb-4'>
                                <Modal.Title className='text-secondary'>
                                    Credentials
                                </Modal.Title>
                                <Form>
                                    <Form.Group>
                                        <Form.Label className="Username">Username</Form.Label>
                                        <Form.Control type="text" placeholder="eg: Username" value={username} onChange={handleUsername} />
                                        <Form.Label className="Password">Password</Form.Label>
                                        <Form.Control type="text" placeholder="eg: Password" value={password} onChange={handlePassword} />
                                    </Form.Group>
                                </Form>
                            </Row>
                            <Form.Label className='description'>Description</Form.Label>
                                <OverlayTrigger placement="right" overlay={<Tooltip id="help-tooltip">Default description</Tooltip>}>
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
        </> 
    )
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