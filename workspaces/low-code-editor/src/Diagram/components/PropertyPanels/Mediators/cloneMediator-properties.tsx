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

export function CloneMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };

  const [cloneID, setCloneID] = useState("");
  const [
    selectedSequentialMediationMethod,
    setSelectedSequentialMediationMethod,
  ] = useState("SequentialMediation");
  const [selectedContinueParentMethod, setSelectedContinueParentMethod] =
    useState("ContinueParent");
  const [targets, setTargets] = useState("");
  const [description, setDescription] = useState("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleCloneID = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCloneID(event.target.value);
  };
  const handleSequentialMediationMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedSequentialMediationMethod(event.target.value);
  };
  const handleContinueParentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedContinueParentMethod(event.target.value);
  };
  const handleTargets = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTargets(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
          <Modal.Title className="text-primary">Clone Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Properties</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="CloneID">Clone ID</Form.Label>
                <Form.Control
                  className="custom-form-control"
                  type="text"
                  placeholder="eg: Clone ID"
                  value={cloneID}
                  onChange={handleCloneID}
                />
                <br />
                <Form.Check
                  type="checkbox"
                  className="checkbox"
                  label={
                    <span className="checkbox-font">Sequential Mediation</span>
                  }
                  checked={
                    selectedSequentialMediationMethod === "SequentialMediation"
                  }
                  value="SequentialMediation"
                  onChange={handleSequentialMediationMethodChange}
                />
                <Form.Check
                  type="checkbox"
                  className="checkbox"
                  label={<span className="checkbox-font">Continue Parent</span>}
                  checked={selectedContinueParentMethod === "ContinueParent"}
                  value="ContinueParent"
                  onChange={handleContinueParentMethodChange}
                />
                <Form.Label className="Targets">Targets</Form.Label>
                {/* When a user clicks this textbox, the CloneTarget Model appears.*/}
                <Form.Control
                  className="custom-form-control"
                  as="textarea"
                  readOnly
                  value={targets}
                  onChange={handleTargets}
                />
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
