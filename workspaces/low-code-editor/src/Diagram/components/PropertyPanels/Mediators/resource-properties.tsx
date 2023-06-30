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

export function ResourceProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };

  const [selectedURLStyleType, setSelectedURLStyleType] = useState("None");
  const [urlTemplate, setUrlTemplate] = useState("");
  const [urlMapping, setUrlMapping] = useState("");
  const [selectedProtocolType, setSelectedProtocolType] =
    useState("http-https");
  const [selectedGETMethod, setSelectedGETMethod] = useState("GET");
  const [selectedPOSTMethod, setSelectedPOSTMethod] = useState("POST");
  const [selectedPutMethod, setSelectedPutMethod] = useState("Put");
  const [selectedDeleteMethod, setSelectedDeleteMethod] = useState("Delete");
  const [selectedOptionsMethod, setSelectedOptionsMethod] = useState("Options");
  const [selectedHeadMethod, setSelectedHeadMethod] = useState("Head");
  const [selectedPatchMethod, setSelectedPatchMethod] = useState("Patch");
  const [selectedInSequenceType, setSelectedInSequenceType] =
    useState("Anonymous");
  const [inSequenceKey, setInSequenceKey] = useState("");
  const [inSequenceName, setInSequenceName] = useState("");
  const [selectedOutSequenceType, setSelectedOutSequenceType] =
    useState("Anonymous");
  const [outSequenceKey, setOutSequenceKey] = useState("");
  const [outSequenceName, setOutSequenceName] = useState("");
  const [selectedFaultSequenceType, setSelectedFaultSequenceType] =
    useState("Anonymous");
  const [faultSequenceKey, setFaultSequenceKey] = useState("");
  const [faultSequenceName, setFaultSequenceName] = useState("");

  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);

  const handleURLStyleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedURLStyleType(event.target.value);
  };
  const handleUrlTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlTemplate(event.target.value);
  };
  const handleUrlMapping = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlMapping(event.target.value);
  };
  const handleProtocolSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProtocolType(event.target.value);
  };
  const handleGETMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedGETMethod(event.target.value);
  };
  const handlePOSTMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPOSTMethod(event.target.value);
  };
  const handlePutMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPutMethod(event.target.value);
  };
  const handleDeleteMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedDeleteMethod(event.target.value);
  };
  const handleOptionsMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedOptionsMethod(event.target.value);
  };
  const handleHeadMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedHeadMethod(event.target.value);
  };
  const handlePatchMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPatchMethod(event.target.value);
  };
  const handleInSequenceSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedInSequenceType(event.target.value);
  };
  const handleInSequenceKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInSequenceKey(event.target.value);
  };
  const handleInSequenceName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInSequenceName(event.target.value);
  };
  const handleOutSequenceSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOutSequenceType(event.target.value);
  };
  const handleOutSequenceKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOutSequenceKey(event.target.value);
  };
  const handleOutSequenceName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOutSequenceName(event.target.value);
  };
  const handleFaultSequenceSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedFaultSequenceType(event.target.value);
  };
  const handleFaultSequenceKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFaultSequenceKey(event.target.value);
  };
  const handleFaultSequenceName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFaultSequenceName(event.target.value);
  };

  return (
    <>
      <Modal
        show={props.modalOpen}
        onHide={handleCancelClick}
        dialogClassName="custom-modal-dialog"
      >
        <Modal.Header>
          <Modal.Title className="text-primary">API Resource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Basic</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="UrlStyle">Url Style</Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedURLStyleType}
                  onChange={handleURLStyleSelectChange}
                >
                  <option value="None">None</option>
                  <option value="URLTEMPLATE">URL_TEMPLATE</option>
                  <option value="URLMAPPING">URL_MAPPING</option>
                </Form.Select>
                {selectedURLStyleType === "URLTEMPLATE" && (
                  <>
                    <Form.Label className="URL-TEMPLATE">
                      URL-TEMPLATE
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value="urlTemplate"
                      onChange={handleUrlTemplate}
                      placeholder="eg: None"
                    />
                  </>
                )}
                {selectedURLStyleType === "URLMAPPING" && (
                  <>
                    <Form.Label className="URL-MAPPING">URL-MAPPING</Form.Label>
                    <Form.Control
                      type="text"
                      value="urlMapping"
                      onChange={handleUrlMapping}
                      placeholder="eg: None"
                    />
                  </>
                )}
                <Form.Label>Protocol</Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedProtocolType}
                  onChange={handleProtocolSelectChange}
                >
                  <option value="http-https">http,https</option>
                  <option value="URLTEMPLATE">https</option>
                  <option value="URLMAPPING">http</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Row>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Methods</Modal.Title>
            <Form>
              <Form.Group>
                <Row>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      className="GET"
                      style={{ display: "flex", alignItems: "center" }}
                      label={<span style={{ marginLeft: "10px" }}>GET</span>}
                      checked={selectedGETMethod === "GET"}
                      value="GET"
                      onChange={handleGETMethodChange}
                    />
                    <Form.Check
                      type="checkbox"
                      className="POST"
                      style={{ display: "flex", alignItems: "center" }}
                      label={<span style={{ marginLeft: "10px" }}>POST</span>}
                      checked={selectedPOSTMethod === "POST"}
                      value="POST"
                      onChange={handlePOSTMethodChange}
                    />
                  </Col>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      className="Put"
                      style={{ display: "flex", alignItems: "center" }}
                      label={<span style={{ marginLeft: "10px" }}>Put</span>}
                      checked={selectedPutMethod === "Put"}
                      value="Put"
                      onChange={handlePutMethodChange}
                    />
                    <Form.Check
                      type="checkbox"
                      className="Delete"
                      style={{ display: "flex", alignItems: "center" }}
                      label={<span style={{ marginLeft: "10px" }}>Delete</span>}
                      checked={selectedDeleteMethod === "Delete"}
                      value="Delete"
                      onChange={handleDeleteMethodChange}
                    />
                  </Col>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      className="Options"
                      style={{ display: "flex", alignItems: "center" }}
                      label={
                        <span style={{ marginLeft: "10px" }}>Options</span>
                      }
                      checked={selectedOptionsMethod === "Options"}
                      value="Options"
                      onChange={handleOptionsMethodChange}
                    />
                    <Form.Check
                      type="checkbox"
                      className="Head"
                      style={{ display: "flex", alignItems: "center" }}
                      label={<span style={{ marginLeft: "10px" }}>Head</span>}
                      checked={selectedHeadMethod === "Head"}
                      value="Head"
                      onChange={handleHeadMethodChange}
                    />
                  </Col>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      className="Patch"
                      style={{ display: "flex", alignItems: "center" }}
                      label={<span style={{ marginLeft: "10px" }}>Patch</span>}
                      checked={selectedPatchMethod === "Patch"}
                      value="Patch"
                      onChange={handlePatchMethodChange}
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </Row>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">InSequence</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="InSequenceType">
                  In Sequence Type
                </Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedInSequenceType}
                  onChange={handleInSequenceSelectChange}
                >
                  <option value="Anonymous">Anonymous</option>
                  <option value="RegistryReference">Registry Reference</option>
                  <option value="NameReference">Name Reference</option>
                </Form.Select>
                {selectedInSequenceType === "RegistryReference" && (
                  <>
                    <Form.Label className="InSequenceKey">
                      In Sequence Key
                    </Form.Label>
                    {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                    <Form.Control
                      type="text"
                      value={inSequenceKey}
                      onChange={handleInSequenceKey}
                      readOnly
                    />
                  </>
                )}
                {selectedInSequenceType === "NameReference" && (
                  <>
                    <Form.Label className="InSequenceName">
                      In Sequence Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={inSequenceName}
                      onChange={handleInSequenceName}
                      placeholder="eg: In Sequence Name"
                    />
                  </>
                )}
              </Form.Group>
            </Form>
          </Row>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">OutSequence</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label>Out Sequence Type</Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedOutSequenceType}
                  onChange={handleOutSequenceSelectChange}
                >
                  <option value="Anonymous">Anonymous</option>
                  <option value="RegistryReference">Registry Reference</option>
                  <option value="NameReference">Name Reference</option>
                </Form.Select>
                {selectedOutSequenceType === "RegistryReference" && (
                  <>
                    <Form.Label className="OutSequenceKey">
                      Out Sequence Key
                    </Form.Label>
                    {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                    <Form.Control
                      type="text"
                      value={outSequenceKey}
                      onChange={handleOutSequenceKey}
                      readOnly
                    />
                  </>
                )}
                {selectedOutSequenceType === "NameReference" && (
                  <>
                    <Form.Label className="OutSequenceName">
                      Out Sequence Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={outSequenceName}
                      onChange={handleOutSequenceName}
                      placeholder="eg: Out Sequence Name"
                    />
                  </>
                )}
              </Form.Group>
            </Form>
          </Row>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">FaultSequence</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label>Fault Sequence Type</Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedFaultSequenceType}
                  onChange={handleFaultSequenceSelectChange}
                >
                  <option value="Anonymous">Anonymous</option>
                  <option value="RegistryReference">Registry Reference</option>
                  <option value="NameReference">Name Reference</option>
                </Form.Select>
                {selectedFaultSequenceType === "RegistryReference" && (
                  <>
                    <Form.Label className="FaultSequenceKey">
                      Fault Sequence Key
                    </Form.Label>
                    {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                    <Form.Control
                      type="text"
                      value={faultSequenceKey}
                      onChange={handleFaultSequenceKey}
                      readOnly
                    />
                  </>
                )}
                {selectedFaultSequenceType === "NameReference" && (
                  <>
                    <Form.Label className="FaultSequenceName">
                      Fault Sequence Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={faultSequenceName}
                      onChange={handleFaultSequenceName}
                      placeholder="eg: Fault Sequence Name"
                    />
                  </>
                )}
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
