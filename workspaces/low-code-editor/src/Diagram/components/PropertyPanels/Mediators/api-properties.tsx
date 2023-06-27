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

export function ApiProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };
  const [selectedVersionType, setSelectedVersionType] = useState("none");
  const [apiName, setAPIName] = useState("");
  const [apiContext, setAPIContext] = useState("");
  const [publishSwagger, setPublishSwagger] = useState("");
  const [hostName, setHostName] = useState("");
  const [port, setPort] = useState("");
  const [description, setDescription] = useState("");
  const [apiHandlers, setAPIHandlers] = useState("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleVersionTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedVersionType(event.target.value);
  };
  const handleAPINameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAPIName(event.target.value);
  };
  const handleAPiContextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAPIContext(event.target.value);
  };
  const handlePublishSwaggerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPublishSwagger(event.target.value);
  };
  const handleHostNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHostName(event.target.value);
  };
  const handlePortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPort(event.target.value);
  };
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };
  const handleAPIHandlersChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAPIHandlers(event.target.value);
  };

  return (
    <>
      <Modal
        show={props.modalOpen}
        onHide={handleCancelClick}
        dialogClassName="custom-modal-dialog"
      ></Modal>
      <Modal.Header>
        <Modal.Title className="text-primary">Synapse API</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Properties</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="Name">
                <b>Name</b>
              </Form.Label>
              <Form.Control
                className="custom-form-control"
                type="text"
                value={apiName}
                onChange={handleAPINameChange}
                placeholder="eg: Name"
              />
              <Form.Label className="Context">
                <b>Context</b>
              </Form.Label>
              <Form.Control
                className="custom-form-control"
                type="text"
                value={apiContext}
                onChange={handleAPiContextChange}
                placeholder="eg: /Name"
              />
              <Form.Label className="PublishSwagger">PublishSwagger</Form.Label>
              {/* When a user clicks this textbox, the Resource Key Model appears.*/}
              <Form.Control
                className="custom-form-control"
                type="text"
                value={publishSwagger}
                onChange={handlePublishSwaggerChange}
                readOnly
              />
              <Form.Label className="HostName">Host Name</Form.Label>
              <Form.Control
                className="custom-form-control"
                type="text"
                value={hostName}
                onChange={handleHostNameChange}
                placeholder="eg: Host Name"
              />
              <Form.Label className="Port">Port</Form.Label>
              <Form.Control
                className="custom-form-control"
                type="text"
                value={port}
                onChange={handlePortChange}
                placeholder="eg: 0"
              />
              <Form.Label className="VersionType">Version Type</Form.Label>
              <Form.Select
                className="custom-form-control"
                value={selectedVersionType}
                onChange={handleVersionTypeSelectChange}
              >
                <option value="none">none</option>
                <option value="context">context</option>
                <option value="url">url</option>
              </Form.Select>
              {selectedVersionType !== "none" && (
                <div>
                  <Form.Label className="Version">Version</Form.Label>
                  <Form.Control
                    className="custom-form-control"
                    type="text"
                    placeholder="eg: Version"
                  />
                </div>
              )}
              <br />
              <Form.Check
                type="checkbox"
                className="checkbox"
                label={<span className="checkbox-font">Trace Enabled</span>}
              />
              <Form.Check
                type="checkbox"
                className="checkbox"
                label={
                  <span className="checkbox-font">Statistics Enabled</span>
                }
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
                onChange={handleDescriptionChange}
                placeholder="eg: None"
              />
            </Form.Group>
          </Form>
        </Row>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Handler</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="APIHandlers">API Handlers</Form.Label>
              {/* When a user clicks this textbox, the Handler Model appears.*/}
              <Form.Control
                className="custom-form-control"
                as="textarea"
                value={apiHandlers}
                onChange={handleAPIHandlersChange}
                readOnly
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
