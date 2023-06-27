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

export function URLRewriteMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };
  const [urlRewriteAction, setURLRewriteAction] = useState("");
  const [inProperty, setInProperty] = useState("");
  const [outProperty, setOutProperty] = useState("");
  const [description, setDescription] = useState("");

  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleURLRewriteAction = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setURLRewriteAction(event.target.value);
  };
  const handleInProperty = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInProperty(event.target.value);
  };
  const handleOutProperty = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOutProperty(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  return (
    <>
      <Modal show={props.modalOpen} onHide={handleCancelClick}>
        <Modal.Header>
          <Modal.Title className="text-primary">
            URL Rewrite Mediator
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <br />
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Properties</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="URLRewriteAction">
                  URL Rewrite Action
                </Form.Label>
                {/* When a user clicks this textbox, the URLRewriteRule Model appears.*/}
                <Form.Control
                  as="textarea"
                  style={{ minHeight: "200px" }}
                  readOnly
                  value={urlRewriteAction}
                  onChange={handleURLRewriteAction}
                />
                <br />
                <Row className="mb-4">
                  <Modal.Title className="text-secondary">
                    In-Out Properties
                  </Modal.Title>
                  <Form>
                    <Form.Group>
                      <Form.Label className="InProperty">
                        In Property
                      </Form.Label>
                      <OverlayTrigger
                        placement="right"
                        overlay={
                          <Tooltip id="help-tooltip">
                            The rewrite rules are applied to the value of the
                            property entered in this parameter to generate the
                            result URL. If no property is entered,the rewrite
                            rules will be applied to the To header of the
                            message
                          </Tooltip>
                        }
                      >
                        <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                          <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                        </span>
                      </OverlayTrigger>
                      <Form.Control
                        type="text"
                        placeholder="eg: In Property"
                        value={inProperty}
                        onChange={handleInProperty}
                      />
                      <Form.Label className="OutProperty">
                        In Property
                      </Form.Label>
                      <OverlayTrigger
                        placement="right"
                        overlay={
                          <Tooltip id="help-tooltip">
                            This parameter is used to enter the property to
                            which the transformations done via the rewrite rules
                            should be applied. If no property is entered, the
                            transformations will be applied to the to header of
                            the message
                          </Tooltip>
                        }
                      >
                        <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                          <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                        </span>
                      </OverlayTrigger>
                      <Form.Control
                        type="text"
                        placeholder="eg: Out Property"
                        value={outProperty}
                        onChange={handleOutProperty}
                      />
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
