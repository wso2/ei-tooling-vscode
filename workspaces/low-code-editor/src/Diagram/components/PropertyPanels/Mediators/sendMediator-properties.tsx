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
  selectedReSeqType: string;
  description: string;
  selectedSkipSerialization: string;
  selectedBuildMessage: string;
  stReSeq: string;
  reSeqExpr: string;
};
export function SendMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [selectedReSeqType, setSelectedReSeqType] = useState<string>("Default");
  const [description, setDescription] = useState<string>("");
  const [selectedSkipSerialization, setSelectedSkipSerialization] =
    useState<string>("");
  const [selectedBuildMessage, setSelectedBuildMessage] = useState<string>("");
  const [stReSeq, setStReSeq] = useState<string>("");
  const [reSeqExpr, setReSeqExpr] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleReSeqTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedReSeqType(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };
  const handleSkipSerialization = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedSkipSerialization(event.target.value);
  };
  const handleBuildMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBuildMessage(event.target.value);
  };
  const handleStReSeq = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStReSeq(event.target.value);
  };
  const handleReSeqExpr = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReSeqExpr(event.target.value);
  };
  const handleSubmit = async () => {
    if (!getDiagramEditorLangClient || !textEdit) {
      return [];
    }
    const langClient = await getDiagramEditorLangClient();
    let snippetCompletionResponse: SnippetCompletionResponse =
      await getSnippetCompletion(
        selectedReSeqType,
        description,
        selectedSkipSerialization,
        selectedBuildMessage,
        stReSeq,
        // reSeqExpr,
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
    setSelectedReSeqType("Default");
    setDescription("");
    setSelectedSkipSerialization("");
    setSelectedBuildMessage("");
    setStReSeq("");
    setReSeqExpr("");
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          Send Mediator Properties
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Properties</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Group style={{ textAlign: "left" }}>
                <div style={{ marginBottom: "10px" }}>
                  <Form.Check
                    type="checkbox"
                    className="SkipSerialization"
                    label={
                      <span style={{ marginLeft: "10px" }}>
                        Skip Serialization
                      </span>
                    }
                    checked={selectedSkipSerialization === "SkipSerialization"}
                    value="SkipSerialization"
                    onChange={handleSkipSerialization}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Check
                    type="checkbox"
                    className="BuildMessage"
                    label={
                      <span style={{ marginLeft: "10px" }}>
                        Build Message Before Sending
                      </span>
                    }
                    checked={selectedBuildMessage === "BuildMessage"}
                    value="BuildMessage"
                    onChange={handleBuildMessage}
                  />
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id="help-tooltip">
                        If this is selected, the full message XML is built in
                        the memory before the message is sent
                      </Tooltip>
                    }
                  >
                    <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                      <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                    </span>
                  </OverlayTrigger>
                </div>
              </Form.Group>
              <br />
              <Row className="mb-4">
                <Modal.Title className="text-secondary">
                  Receiving Sequence
                </Modal.Title>
                <Form>
                  <Form.Group>
                    <Form.Label className="ReSeqType">
                      Receiving Sequence Type
                    </Form.Label>
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id="help-tooltip">
                          The sequence to use for handling the response from the
                          endpoint. If Default selected mediation sequence in
                          the Out sequence will be used
                        </Tooltip>
                      }
                    >
                      <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                        <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                      </span>
                    </OverlayTrigger>
                    <Form.Select
                      value={selectedReSeqType}
                      onChange={handleReSeqTypeSelectChange}
                    >
                      <option value="Default">Default</option>
                      <option value="Static">Static</option>
                      <option value="Dynamic">Dynamic</option>
                    </Form.Select>
                    {selectedReSeqType === "Static" && (
                      <>
                        <Form.Label className="StReSeq">
                          Static Receiving Sequence
                        </Form.Label>
                        {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                        <Form.Control
                          type="text"
                          value={stReSeq}
                          onChange={handleStReSeq}
                          readOnly
                        />
                      </>
                    )}
                    {selectedReSeqType === "Dynamic" && (
                      <>
                        <Form.Label className="ReSeqExpr">
                          Receiving Sequence Expression
                        </Form.Label>
                        {/*When a user clicks this textbox, the Expression Selector appears.*/}
                        <Form.Control
                          type="text"
                          value={reSeqExpr}
                          onChange={handleReSeqExpr}
                          readOnly
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
      </Modal.Body>
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
