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

export function CallMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };
  const [selectedCheckboxMethod, setSelectedCheckboxMethod] = useState(
    "EnableBlockingCalls"
  );
  const [selectedEndpointType, setSelectedEndpointType] = useState("NONE");
  const [endpointRegistryKey, setEndpointRegistryKey] = useState("");
  const [endpointXPATH, setEndpointXPATH] = useState("");
  const [selectedSourceType, setSelectedSourceType] = useState("none");
  const [sourceProperty, setSourceProperty] = useState("");
  const [sourcePropertyContentType, setSourcePropertyContentType] =
    useState("");
  const [sourcePayload, setSourcePayload] = useState("");
  const [sourcePayloadContentType, setSourcePayloadContentType] = useState("");
  const [sourceXPath, setSourceXPath] = useState("");
  const [sourceXPathContentType, setSourceXPathContentType] = useState("");
  const [selectedTargetType, setSelectedTargetType] = useState("none");
  const [targetProperty, setTargetProperty] = useState("");
  const [targetPropertyContentType, setTargetPropertyContentType] =
    useState("");
  const [description, setDescription] = useState("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleEnableBlockingCallsMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedCheckboxMethod(event.target.value);
  };
  const handleEndpointSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedEndpointType(event.target.value);
  };
  const handleEndpointRegistryKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEndpointRegistryKey(event.target.value);
  };
  const handleEndpointXPATH = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndpointXPATH(event.target.value);
  };
  const handleSourceProperty = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourceProperty(event.target.value);
  };
  const handleSourceSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSourceType(event.target.value);
  };
  const handleTargetSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTargetType(event.target.value);
  };
  const handleSourcePayload = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSourcePayload(event.target.value);
  };
  const handleSourceXPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourceXPath(event.target.value);
  };
  const handleSourcePropertyContentType = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSourcePropertyContentType(event.target.value);
  };
  const handleSourcePayloadContentType = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSourcePayloadContentType(event.target.value);
  };
  const handleSourceXPathContentType = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSourceXPathContentType(event.target.value);
  };
  const handleTargetProperty = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetProperty(event.target.value);
  };
  const handleTargetPropertyContentType = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTargetPropertyContentType(event.target.value);
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
          <Modal.Title className="text-primary">Call Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Properties</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  className="checkbox"
                  label={
                    <>
                      <span className="checkbox-font">
                        Enable Blocking Calls
                      </span>
                      <OverlayTrigger
                        placement="right"
                        overlay={
                          <Tooltip id="help-tooltip">
                            Help message goes here
                          </Tooltip>
                        }
                      >
                        <span className="custom-question-icon">
                          <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                        </span>
                      </OverlayTrigger>
                    </>
                  }
                  checked={selectedCheckboxMethod === "EnableBlockingCalls"}
                  value="EnableBlockingCalls"
                  onChange={handleEnableBlockingCallsMethodChange}
                />
              </Form.Group>
            </Form>
          </Row>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Endpoint Type</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="EndpointType">Endpoint Type</Form.Label>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">
                      Select the message will be delivered depending on the
                      selected type
                    </Tooltip>
                  }
                >
                  <span className="custom-question-icon">
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                <Form.Select
                  className="custom-form-control"
                  value={selectedEndpointType}
                  onChange={handleEndpointSelectChange}
                >
                  <option value="INLINE">INLINE</option>
                  <option value="NONE">NONE</option>
                  <option value="REGISRTYKEY">REGISRTYKEY</option>
                  <option value="XPATH">XPATH</option>
                </Form.Select>
                {selectedEndpointType === "REGISRTYKEY" && (
                  <>
                    <Form.Label className="EndpointRegistryKey">
                      Endpoint Registry Key
                    </Form.Label>
                    {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      value={endpointRegistryKey}
                      onChange={handleEndpointRegistryKey}
                      readOnly
                    />
                  </>
                )}
                {selectedEndpointType === "XPATH" && (
                  <>
                    <Form.Label className="EndpointXPATH">
                      Endpoint XPATH
                    </Form.Label>
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id="help-tooltip">
                          The endpoint to which the message should be sent will
                          be derived via an XPath expression
                        </Tooltip>
                      }
                    >
                      <span className="custom-question-icon">
                        <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                      </span>
                    </OverlayTrigger>
                    {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      value={endpointXPATH}
                      onChange={handleEndpointXPATH}
                      readOnly
                    />
                  </>
                )}
                <Form.Label className="SourceType">Source Type</Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedSourceType}
                  onChange={handleSourceSelectChange}
                >
                  <option value="none">none</option>
                  <option value="body">body</option>
                  <option value="property">property</option>
                  <option value="inline">inline</option>
                  <option value="custom">custom</option>
                </Form.Select>
                {selectedSourceType === "property" && (
                  <>
                    <Form.Label className="SourceProperty">
                      SourceProperty
                    </Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      value={sourceProperty}
                      onChange={handleSourceProperty}
                      placeholder="eg: SourceProperty"
                    />
                    <Form.Label className="EContentType">
                      Content Type
                    </Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      value={sourcePropertyContentType}
                      onChange={handleSourcePropertyContentType}
                      placeholder="eg: Content Type"
                    />
                  </>
                )}
                {selectedSourceType === "inline" && (
                  <>
                    <Form.Label className="SourcePayload">
                      Source Payload
                    </Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      as="textarea"
                      value={sourcePayload}
                      onChange={handleSourcePayload}
                      placeholder="<inline>"
                      rows={5}
                    />
                    <Form.Label className="ContentType">
                      Content Type
                    </Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      value={sourcePayloadContentType}
                      onChange={handleSourcePayloadContentType}
                      placeholder="eg: Content Type"
                    />
                  </>
                )}
                {selectedSourceType === "custom" && (
                  <>
                    <Form.Label className="SourceXPath">SourceXPath</Form.Label>
                    {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      value={sourceXPath}
                      onChange={handleSourceXPath}
                      readOnly
                    />
                    <Form.Label className="ContentType">
                      Content Type
                    </Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      value={sourceXPathContentType}
                      onChange={handleSourceXPathContentType}
                      placeholder="eg: Content Type"
                    />
                  </>
                )}
                <Form.Label className="TargetType">Target Type</Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedTargetType}
                  onChange={handleTargetSelectChange}
                >
                  <option value="none">none</option>
                  <option value="body">body</option>
                  <option value="property">property</option>
                </Form.Select>
                {selectedTargetType === "property" && (
                  <>
                    <Form.Label className="TargetProperty">
                      Target Property
                    </Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      value={targetProperty}
                      onChange={handleTargetProperty}
                      placeholder="eg: Target Property"
                    />
                    <Form.Label className="ContentType">
                      Content Type
                    </Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      value={targetPropertyContentType}
                      onChange={handleTargetPropertyContentType}
                      placeholder="eg: Content Type"
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
