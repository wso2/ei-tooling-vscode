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

export function SendMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };

  const [selectedReSeqType, setSelectedReSeqType] = useState("Default");
  const [description, setDescription] = useState("");
  const [selectedSkipSerialization, setSelectedSkipSerialization] =
    useState("");
  const [selectedBuildMessage, setSelectedBuildMessage] = useState("");
  const [stReSeq, setStReSeq] = useState("");
  const [reSeqExpr, setReSeqExpr] = useState("");

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

  return (
    <>
      <Modal
        show={props.modalOpen}
        onHide={handleCancelClick}
        dialogClassName="custom-modal-dialog"
      >
        <Modal.Header>
          <Modal.Title className="text-primary">Send Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Properties</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Group className="custom-form-group">
                  <div>
                    <Form.Check
                      type="checkbox"
                      className="checkbox"
                      label={
                        <span className="checkbox-font">
                          Skip Serialization
                        </span>
                      }
                      checked={
                        selectedSkipSerialization === "SkipSerialization"
                      }
                      value="SkipSerialization"
                      onChange={handleSkipSerialization}
                    />
                  </div>
                  <div className="checkbox-wrapper">
                    <Form.Check
                      type="checkbox"
                      className="checkbox"
                      label={
                        <span className="checkbox-font">
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
                      <span className="custom-question-icon">
                        <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                      </span>
                    </OverlayTrigger>
                  </div>
                </Form.Group>
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
                            The sequence to use for handling the response from
                            the endpoint. If Default selected mediation sequence
                            in the Out sequence will be used
                          </Tooltip>
                        }
                      >
                        <span className="custom-question-icon">
                          <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                        </span>
                      </OverlayTrigger>
                      <Form.Select
                        className="custom-form-control"
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
                            className="custom-form-control"
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
                            className="custom-form-control"
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
