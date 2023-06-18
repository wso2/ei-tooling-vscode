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
  selectedContinueAfterRoute: string;
  conditionalRouteBranches: string;
  description: string;
};
export function ConditionalRouterProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [selectedContinueAfterRoute, setSelectedContinueAfterRoute] =
    useState<string>("");
  const [conditionalRouteBranches, setConditionalRouteBranches] =
    useState<string>("");
  const [description, setDescription] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleContinueAfterRoute = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedContinueAfterRoute(event.target.value);
  };
  const handleConditionalRouteBranches = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setConditionalRouteBranches(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  const handleSubmit = async () => {
    if (!getDiagramEditorLangClient || !textEdit) {
      return [];
    }
  };
  const handleCancelClick = async () => {
    setSelectedContinueAfterRoute("");
    setConditionalRouteBranches("");
    setDescription("");
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          ConditionalRouter Mediator Properties
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Properties</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Group style={{ textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Check
                    type="checkbox"
                    className="ContinueAfterRoute"
                    label={
                      <span style={{ marginLeft: "10px" }}>
                        Continue After Route
                      </span>
                    }
                    checked={
                      selectedContinueAfterRoute === "ContinueAfterRoute"
                    }
                    value="ContinueAfterRoute"
                    onChange={handleContinueAfterRoute}
                  />
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id="help-tooltip">
                        If this is selected, mediation continues to execute (any
                        other mediators specified) after the conditional router
                        mediator
                      </Tooltip>
                    }
                  >
                    <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                      <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                    </span>
                  </OverlayTrigger>
                </div>
                <br />
              </Form.Group>
              <Form.Label className="Conditional Route Branches">
                Conditional Route Branches
              </Form.Label>
              {/* When a user clicks this textbox, the Resource Key Model appears.*/}
              <Form.Control
                as="textarea"
                readOnly
                value={conditionalRouteBranches}
                onChange={handleConditionalRouteBranches}
                style={{ minHeight: "200px" }}
              />
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
