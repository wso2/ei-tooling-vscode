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
  selectedAvaDataServices: string;
  serviceName: string;
  selectedSourceType: string;
  selectedOperationType: string;
  inlineSource: string;
  selectedTargetType: string;
  targetProperty: string;
  description: string;
};
export function DataServiceCallMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [selectedAvaDataServices, setSelectedAvaDataServices] =
    useState<string>("SelectAvaDataServices");
  const [serviceName, setServiceName] = useState<string>("");
  const [selectedSourceType, setSelectedSourceType] =
    useState<string>("INLINE");
  const [selectedOperationType, setSelectedOperationType] =
    useState<string>("SINGLE");
  const [inlineSource, setInlineSource] = useState<string>("");
  const [selectedTargetType, setSelectedTargetType] = useState<string>("");
  const [targetProperty, setTargetProperty] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleAvaDataServicesSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedAvaDataServices(event.target.value);
  };
  const handleServiceName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setServiceName(event.target.value);
  };
  const handleSourceTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSourceType(event.target.value);
  };
  const handleOperationTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOperationType(event.target.value);
  };
  const handleInlineSource = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInlineSource(event.target.value);
  };
  const handleTargetTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTargetType(event.target.value);
  };
  const handleTargetProperty = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetProperty(event.target.value);
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
    setSelectedAvaDataServices("SelectAvaDataServices");
    setServiceName("");
    setSelectedSourceType("INLINE");
    setSelectedOperationType("SINGLE");
    setInlineSource("");
    setSelectedTargetType("");
    setTargetProperty("");
    setDescription("");
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          DSS Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Properties</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="AvaDataServices">
                Available Data Services
              </Form.Label>
              <Form.Select
                value={selectedAvaDataServices}
                onChange={handleAvaDataServicesSelectChange}
              >
                <option value="SelectAvaDataServices">
                  Select from available Data Services
                </option>
              </Form.Select>
              <Form.Label className="ServiceName">Service Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg: Service Name"
                value={serviceName}
                onChange={handleServiceName}
              />
              <Form.Label className="SourceType">Source Type</Form.Label>
              <Form.Select
                value={selectedSourceType}
                onChange={handleSourceTypeSelectChange}
              >
                <option value="INLINE">INLINE</option>
                <option value="BODY">BODY</option>
              </Form.Select>
              <Form.Label className="OperationType">Operation Type</Form.Label>
              <Form.Select
                value={selectedOperationType}
                onChange={handleOperationTypeSelectChange}
              >
                <option value="SINGLE">SINGLE</option>
                <option value="BATCH">BATCH</option>
                <option value="REQUESTBOX">REQUESTBOX</option>
              </Form.Select>
              {selectedSourceType === "INLINE" && (
                <>
                  <Form.Label className="InlineSource">Operations</Form.Label>
                  {/* When a user clicks this textbox, the AbstractDSSOperation Model appears.*/}
                  <Form.Control
                    as="textarea"
                    style={{ minHeight: "200px" }}
                    readOnly
                    value={inlineSource}
                    onChange={handleInlineSource}
                  />
                </>
              )}
              <Form.Label className="TargetType">Target Type</Form.Label>
              <Form.Select
                value={selectedTargetType}
                onChange={handleTargetTypeSelectChange}
              >
                <option value="BODY">BODY</option>
                <option value="PROPERTY">PROPERTY</option>
              </Form.Select>
              {selectedTargetType === "PROPERTY" && (
                <>
                  <Form.Label className="TargetProperty">
                    Target Property
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="eg: Target Property"
                    value={targetProperty}
                    onChange={handleTargetProperty}
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
