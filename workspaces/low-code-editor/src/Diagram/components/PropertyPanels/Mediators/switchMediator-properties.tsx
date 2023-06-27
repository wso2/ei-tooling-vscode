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

export function SwitchMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };

  const [sourceXPath, setSourceXPath] = useState("");
  const [caseBranches, setCaseBranches] = useState("");
  const [description, setDescription] = useState("");

  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleSourceXPathChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSourceXPath(event.target.value);
  };
  const handleCaseBranches = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCaseBranches(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  return (
    <>
      <Modal show={props.modalOpen} onHide={handleCancelClick}>
        <Modal.Header>
          <Modal.Title className="text-primary">Switch Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <br />
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Properties</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="SourceXPath">Source XPath</Form.Label>
                {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">
                      The source XPath or JSONPath to be evaluated. When
                      specifying a JSONPath, use the format
                      json-eval(&lt;JSON_PATH&gt;), such as
                      json-eval(getQuote.request.symbol)
                    </Tooltip>
                  }
                >
                  <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                <Form.Control
                  type="text"
                  readOnly
                  value={sourceXPath}
                  onChange={handleSourceXPathChange}
                />
                <Form.Label className="CaseBranches">Case Branches</Form.Label>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">
                      Right click on the mediator and click "Add\Remove Case..."
                      to add more cases
                    </Tooltip>
                  }
                >
                  <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                <Form.Control
                  as="textarea"
                  style={{ minHeight: "200px" }}
                  readOnly
                  value={caseBranches}
                  onChange={handleCaseBranches}
                />{" "}
                {/* Cases will be display in this textbox*/}
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
            <Button variant="secondary" onClick={handleCancelClick}>
              Save
            </Button>
            <Button variant="primary" onClick={handleCancelClick}>
              Cancel
            </Button>
          </div>
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
