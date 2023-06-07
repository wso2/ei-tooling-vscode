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
} from "../../../DiagramGenerator/generatorUtil";
import { Context as DiagramContext } from "../../../Contexts";

type Props = {
  // langClient: DiagramEditorLangClientInterface;
  textDocumentUrl: string;
  textDocumentFsPath: string;
  previousComponentStartPosition: number;
  textEdit?: TextEdit;
};
type State = {
  selectedCheckboxMethod: string;
  selectedEndpointType: string;
  selectedSourceType: string;
  selectedTargetType: string;
  endpointRegistryKey: string;
  endpointXPATH: string;
  sourceProperty: string;
  sourcePropertyContentType: string;
  sourcePayload: string;
  sourcePayloadContentType: string;
  sourceXPath: string;
  sourceXPathContentType: string;
  targetProperty: string;
  targetPropertyContentType: string;
  description: string;
};
export function CallMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [selectedCheckboxMethod, setSelectedCheckboxMethod] = useState<string>(
    "EnableBlockingCalls"
  );
  const [selectedEndpointType, setSelectedEndpointType] =
    useState<string>("NONE");
  const [endpointRegistryKey, setEndpointRegistryKey] = useState<string>("");
  const [endpointXPATH, setEndpointXPATH] = useState<string>("");
  const [selectedSourceType, setSelectedSourceType] = useState<string>("none");
  const [sourceProperty, setSourceProperty] = useState<string>("");
  const [sourcePropertyContentType, setSourcePropertyContentType] =
    useState<string>("");
  const [sourcePayload, setSourcePayload] = useState<string>("");
  const [sourcePayloadContentType, setSourcePayloadContentType] =
    useState<string>("");
  const [sourceXPath, setSourceXPath] = useState<string>("");
  const [sourceXPathContentType, setSourceXPathContentType] =
    useState<string>("");
  const [selectedTargetType, setSelectedTargetType] = useState<string>("none");
  const [targetProperty, setTargetProperty] = useState<string>("");
  const [targetPropertyContentType, setTargetPropertyContentType] =
    useState<string>("");
  const [description, setDescription] = useState<string>("");
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
  const handleSubmit = async () => {
    if (!getDiagramEditorLangClient || !textEdit) {
      return [];
    }
    const langClient = await getDiagramEditorLangClient();
    let snippetCompletionResponse: SnippetCompletionResponse =
      await getSnippetCompletion(
        selectedCheckboxMethod,
        selectedEndpointType,
        selectedSourceType,
        selectedTargetType,
        endpointRegistryKey,
        // endpointXPATH,
        // sourceProperty,
        // sourcePropertyContentType,
        // sourcePayload,
        // sourcePayloadContentType,
        // sourceXPath,
        // sourceXPathContentType,
        // targetProperty,
        // targetPropertyContentType,
        // description,
        langClient
      );
    textEdit.newText = snippetCompletionResponse.snippet;
    await modifyTextOnComponentSelection(
      textDocumentUrl,
      textDocumentFsPath,
      textEdit,
      previousComponentStartPosition,
      langClient
    );
  };
  const handleCancelClick = async () => {
    setSelectedCheckboxMethod("EnableBlockingCalls");
    setSelectedEndpointType("NONE");
    setEndpointRegistryKey("");
    setEndpointXPATH("");
    setSelectedSourceType("none");
    setSourceProperty("");
    setSourcePropertyContentType("");
    setSourcePayload("");
    setSourcePayloadContentType("");
    setSourceXPath("");
    setSourceXPathContentType("");
    setSelectedTargetType("none");
    setTargetProperty("");
    setTargetPropertyContentType("");
    setDescription("");
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          Call Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Properties</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Check
                type="checkbox"
                className="EnableBlockingCalls"
                style={{ display: "flex", alignItems: "center" }}
                label={
                  <>
                    <span style={{ marginLeft: "10px" }}>
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
                      <span style={{ marginLeft: "10px", cursor: "pointer" }}>
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
        <br />
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
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Select
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
                        The endpoint to which the message should be sent will be
                        derived via an XPath expression
                      </Tooltip>
                    }
                  >
                    <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                      <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                    </span>
                  </OverlayTrigger>
                  {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                  <Form.Control
                    type="text"
                    value={endpointXPATH}
                    onChange={handleEndpointXPATH}
                    readOnly
                  />
                </>
              )}
              <Form.Label className="SourceType">Source Type</Form.Label>
              <Form.Select
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
                    type="text"
                    value={sourceProperty}
                    onChange={handleSourceProperty}
                    placeholder="eg: SourceProperty"
                  />
                  <Form.Label className="EContentType">Content Type</Form.Label>
                  <Form.Control
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
                    SourcePayload
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    style={{ minHeight: "200px" }}
                    value={sourcePayload}
                    onChange={handleSourcePayload}
                  >
                    &lt;inline/&gt;
                  </Form.Control>
                  <Form.Label className="ContentType">Content Type</Form.Label>
                  <Form.Control
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
                    type="text"
                    value={sourceXPath}
                    onChange={handleSourceXPath}
                    readOnly
                  />
                  <Form.Label className="ContentType">Content Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={sourceXPathContentType}
                    onChange={handleSourceXPathContentType}
                    placeholder="eg: Content Type"
                  />
                </>
              )}
              <Form.Label className="TargetType">Target Type</Form.Label>
              <Form.Select
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
                    type="text"
                    value={targetProperty}
                    onChange={handleTargetProperty}
                    placeholder="eg: Target Property"
                  />
                  <Form.Label className="ContentType">Content Type</Form.Label>
                  <Form.Control
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
