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
  selectedCloneSource: string;
  selectedSourceType: string;
  sourceXpath: string;
  sourceProperty: string;
  sourcePropertyContentType: string;
  sourcePayload: string;
  sourcePayloadContentType: string;
  sourceXPath: string;
  sourceXPathContentType: string;
  selectedInlineType: string;
  sourceXML: string;
  inlineRegistryKey: string;
  selectedTargetAction: string;
  selectedTargetType: string;
  targetProperty: string;
  targetPropertyContentType: string;
  targetXorJPath: string;
  description: string;
};
export function EnrichMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [selectedCloneSource, setSelectedCloneSource] =
    useState<string>("CloneSource");
  const [selectedSourceType, setSelectedSourceType] =
    useState<string>("property");
  const [sourceXpath, setSourceXpath] = useState<string>("");
  const [sourceProperty, setSourceProperty] = useState<string>("");
  const [sourcePropertyContentType, setSourcePropertyContentType] =
    useState<string>("");
  const [sourcePayload, setSourcePayload] = useState<string>("");
  const [sourcePayloadContentType, setSourcePayloadContentType] =
    useState<string>("");
  const [sourceXPath, setSourceXPath] = useState<string>("");
  const [sourceXPathContentType, setSourceXPathContentType] =
    useState<string>("");
  const [selectedInlineType, setSelectedInlineType] =
    useState<string>("InlineXMLJSON");
  const [sourceXML, setSourceXML] = useState<string>("");
  const [inlineRegistryKey, setInlineRegistryKey] = useState<string>("");
  const [selectedTargetAction, setSelectedTargetAction] =
    useState<string>("replace");
  const [selectedTargetType, setSelectedTargetType] =
    useState<string>("custom");
  const [targetProperty, setTargetProperty] = useState<string>("");
  const [targetPropertyContentType, setTargetPropertyContentType] =
    useState<string>("");
  const [targetXorJPath, setTargetXorJPath] = useState<string>("");
  const [description, setDescription] = useState<string>("");
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

  const handleSubmit = async () => {
    if (!getDiagramEditorLangClient || !textEdit) {
      return [];
    }
  };
  const handleCancelClick = async () => {
    setSelectedCloneSource("CloneSource");
    setSelectedSourceType("property");
    setSourceXpath("");
    setSourceProperty("");
    setSourcePropertyContentType("");
    setSourcePayload("");
    setSourcePayloadContentType("");
    setSourceXPath("");
    setSourceXPathContentType("");
    setSelectedInlineType("InlineXMLJSON");
    setSourceXML("");
    setInlineRegistryKey("");
    setSelectedTargetAction("replace");
    setSelectedTargetType("custom");
    setTargetProperty("");
    setTargetPropertyContentType("");
    setTargetXorJPath("");
    setDescription("");
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          Enrich Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Source</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Group style={{ textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Check
                    type="checkbox"
                    className="CloneSource"
                    label={
                      <span style={{ marginLeft: "10px" }}>Clone Source</span>
                    }
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
                    <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                      <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                    </span>
                  </OverlayTrigger>
                </div>
                <br />
              </Form.Group>
              <Form.Label className="SourceType">Source Type</Form.Label>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="help-tooltip">
                    The type that the mediator uses from the original message to
                    enrich the modified message that passes through the mediator
                  </Tooltip>
                }
              >
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Select
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
                  <Form.Label className="SourceXpath">Source XPath</Form.Label>
                  {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                  <Form.Control
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
                    value={selectedInlineType}
                    onChange={handleInlineTypeSelectChange}
                  >
                    <option value="InlineXMLJSON">Inline XML/JSON</option>
                    <option value="RegistryKey">RegistryKey</option>
                  </Form.Select>
                  {selectedInlineType === "InlineXMLJSON" && (
                    <>
                      <Form.Label className="SourceXML">Source XML</Form.Label>
                      <Form.Control
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
        <br />
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
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Select
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
        <br />
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
