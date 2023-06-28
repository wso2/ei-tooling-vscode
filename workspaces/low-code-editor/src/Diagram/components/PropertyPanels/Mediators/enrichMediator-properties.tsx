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

export function EnrichMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };

  const [selectedCloneSource, setSelectedCloneSource] = useState("CloneSource");
  const [selectedSourceType, setSelectedSourceType] = useState("property");
  const [sourceXpath, setSourceXpath] = useState("");
  const [sourceProperty, setSourceProperty] = useState("");
  const [sourcePropertyContentType, setSourcePropertyContentType] =
    useState("");
  const [sourcePayload, setSourcePayload] = useState("");
  const [sourcePayloadContentType, setSourcePayloadContentType] = useState("");
  const [sourceXPath, setSourceXPath] = useState("");
  const [sourceXPathContentType, setSourceXPathContentType] = useState("");
  const [selectedInlineType, setSelectedInlineType] = useState("InlineXMLJSON");
  const [sourceXML, setSourceXML] = useState("");
  const [inlineRegistryKey, setInlineRegistryKey] = useState("");
  const [selectedTargetAction, setSelectedTargetAction] = useState("replace");
  const [selectedTargetType, setSelectedTargetType] = useState("custom");
  const [targetProperty, setTargetProperty] = useState("");
  const [targetPropertyContentType, setTargetPropertyContentType] =
    useState("");
  const [targetXorJPath, setTargetXorJPath] = useState("");
  const [description, setDescription] = useState("");

  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleCloneSourceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedCloneSource(event.target.value);
  };
  const handleSourceTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSourceType(event.target.value);
  };
  const handleSourceXpath = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourceXpath(event.target.value);
  };
  const handleSourceProperty = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourceProperty(event.target.value);
  };
  const handleSourcePropertyContentType = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSourcePropertyContentType(event.target.value);
  };
  const handleSourcePayload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourcePayload(event.target.value);
  };
  const handleSourcePayloadContentType = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSourcePayloadContentType(event.target.value);
  };
  const handleSourceXPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourceXPath(event.target.value);
  };
  const handleSourceXPathContentType = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSourceXPathContentType(event.target.value);
  };
  const handleInlineTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedInlineType(event.target.value);
  };
  const handleSourceXML = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourceXML(event.target.value);
  };
  const handleInlineRegistryKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInlineRegistryKey(event.target.value);
  };
  const handleTargetActionSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTargetAction(event.target.value);
  };
  const handleTargetTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTargetType(event.target.value);
  };
  const handleTargetProperty = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetProperty(event.target.value);
  };
  const handleTargetPropertyContentType = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTargetPropertyContentType(event.target.value);
  };
  const handleTargetXorJPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetXorJPath(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
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
          <Modal.Title className="text-primary">Enrich Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Source</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Group className="custom-form-group">
                <div className="checkbox-wrapper">
                  <Form.Check
                    type="checkbox"
                    className="checkbox"
                    label={<span className="checkbox-font">Clone Source</span>}
                    checked={selectedCloneSource === "CloneSource"}
                    value="CloneSource"
                    onChange={handleCloneSourceChange}
                    defaultChecked
                  />
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id="help-tooltip">
                        If checked, the message can be cloned or used as a
                        reference during enriching
                      </Tooltip>
                    }
                  >
                    <span className="custom-question-icon">
                      <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                    </span>
                  </OverlayTrigger>
                  <br />
                  </div>
                </Form.Group>
                <Form.Label className="SourceType">Source Type</Form.Label>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">
                      The type that the mediator uses from the original message
                      to enrich the modified message that passes through the
                      mediator
                    </Tooltip>
                  }
                >
                  <span className="custom-question-icon">
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                <Form.Select
                  className="custom-form-control"
                  value={selectedSourceType}
                  onChange={handleSourceTypeSelectChange}
                >
                  <option value="custom">custom</option>
                  <option value="body">body</option>
                  <option value="envelope">envelope</option>
                  <option value="property">property</option>
                  <option value="inline">inline</option>
                </Form.Select>
                {selectedSourceType === "custom" && (
                  <>
                    <Form.Label className="SourceXpath">
                      Source XPath
                    </Form.Label>
                    {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      readOnly
                      value={sourceXpath}
                      onChange={handleSourceXpath}
                    />
                  </>
                )}
                {selectedSourceType === "property" && (
                  <>
                    <Form.Label className="SourceProperty">
                      Source Property
                    </Form.Label>
                    {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      placeholder="eg: Source Property"
                      value={sourceProperty}
                      onChange={handleSourceProperty}
                    />
                  </>
                )}
                {selectedSourceType === "inline" && (
                  <>
                    <Form.Label className="InlineType">Inline Type</Form.Label>
                    <Form.Select
                      className="custom-form-control"
                      value={selectedInlineType}
                      onChange={handleInlineTypeSelectChange}
                    >
                      <option value="InlineXMLJSON">Inline XML/JSON</option>
                      <option value="RegistryKey">RegistryKey</option>
                    </Form.Select>
                    {selectedInlineType === "InlineXMLJSON" && (
                      <>
                        <Form.Label className="SourceXML">
                          Source XML
                        </Form.Label>
                        <Form.Control
                          className="custom-form-control"
                          as="textarea"
                          style={{ minHeight: "200px" }}
                          value={sourceXML}
                          onChange={handleSourceXML}
                        >
                          &lt;inline/&gt;
                        </Form.Control>
                      </>
                    )}
                    {selectedInlineType === "RegistryKey" && (
                      <>
                        <Form.Label className="InRegistryKey">
                          Inline Registry Key
                        </Form.Label>
                        {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                        <Form.Control
                          className="custom-form-control"
                          type="text"
                          readOnly
                          value={inlineRegistryKey}
                          onChange={handleInlineRegistryKey}
                        />
                      </>
                    )}
                  </>
                )}
              </Form.Group>
            </Form>
          </Row>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Target</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="TargetAction">Target Action</Form.Label>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">
                      By specifying the action type, the relevant action can be
                      applied to outgoing messages.
                      <br />
                      <br />
                      Replace:
                      <br />
                      Will be used if a specific value for Action is not given.
                      This replaces the XML message based on the target type
                      specified on the target configuration
                      <br />
                      <br />
                      Child:
                      <br />
                      Adding as a child of the specified target type
                      <br />
                      <br />
                      Sibling:
                      <br />
                      Adding as a sibling of the specified target type
                    </Tooltip>
                  }
                >
                  <span className="custom-question-icon">
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                <Form.Select
                  className="custom-form-control"
                  value={selectedTargetAction}
                  onChange={handleTargetActionSelectChange}
                >
                  <option value="replace">replace</option>
                  <option value="child">child</option>
                  <option value="sibling">sibling</option>
                  <option value="remove">remove</option>
                </Form.Select>
                <Form.Label className="TargetType">Target Type</Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedTargetType}
                  onChange={handleTargetTypeSelectChange}
                >
                  <option value="custom">custom</option>
                  <option value="body">body</option>
                  <option value="property">property</option>
                  <option value="envelope">envelope</option>
                  <option value="key">key</option>
                </Form.Select>
                {(selectedTargetType === "custom" ||
                  selectedTargetType === "key") && (
                  <>
                    <Form.Label className="TargetXorJPath">
                      Target XPath / JSONPath
                    </Form.Label>
                    {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      readOnly
                      value={targetXorJPath}
                      onChange={handleTargetXorJPath}
                    />
                  </>
                )}
                {selectedTargetType === "property" && (
                  <>
                    <Form.Label className="TargetProperty">
                      Target Property
                    </Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      placeholder="target_property"
                      value={targetProperty}
                      onChange={handleTargetProperty}
                    />
                  </>
                )}
              </Form.Group>
            </Form>
          </Row>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Misc</Modal.Title>
            <Form>
              <Form.Group>
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
