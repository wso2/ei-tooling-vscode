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

export function EventMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };

  const [selectedTopicType, setSelectedTopicType] = useState("static");
  const [staticTopic, setStaticTopic] = useState("");
  const [dynamicTopic, setDynamicTopic] = useState("");
  const [description, setDescription] = useState("");

  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleTopicTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTopicType(event.target.value);
  };
  const handleStaticTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStaticTopic(event.target.value);
  };
  const handleDynamicTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDynamicTopic(event.target.value);
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
          <Modal.Title className="text-primary">Event Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Properties</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="TopicType">Topic Type</Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedTopicType}
                  onChange={handleTopicTypeSelectChange}
                >
                  <option value="static">static</option>
                  <option value="dynamic">dynamic</option>
                </Form.Select>
                {selectedTopicType === "static" && (
                  <>
                    <Form.Label className="StaticTopic">
                      Static Topic
                    </Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      placeholder="eg: static"
                      value={staticTopic}
                      onChange={handleStaticTopic}
                    />
                  </>
                )}
                {selectedTopicType === "dynamic" && (
                  <>
                    <Form.Label className="DynamicTopic">
                      Dynamic Topic
                    </Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      placeholder="eg: dynamic"
                      value={dynamicTopic}
                      onChange={handleDynamicTopic}
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
