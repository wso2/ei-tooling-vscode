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

export function XSLTMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };

  const [sourceXPath, setSourceXPath] = useState("");
  const [selectedXSLTSchemaType, setSelectedXSLTSchemaType] =
    useState("Static");
  const [xsltStaticSchemaKey, setXSLTStaticSchemaKey] = useState("");
  const [xsltDynamicSchemaKey, setXSLTDynamicSchemaKey] = useState("");
  const [properties, setProperties] = useState("");
  const [resources, setResources] = useState("");
  const [features, setFeatures] = useState("");
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
  const handleXSLTSchemaTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedXSLTSchemaType(event.target.value);
  };
  const handleXSLTStaticSchemaKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setXSLTStaticSchemaKey(event.target.value);
  };
  const handleXSLTDynamicSchemaKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setXSLTDynamicSchemaKey(event.target.value);
  };
  const handlePropertiesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setProperties(event.target.value);
  };
  const handleResourcesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setResources(event.target.value);
  };
  const handleFeaturesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFeatures(event.target.value);
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
          <Modal.Title className="text-primary">XSLT Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Properties</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="SourceXPath">Source XPath</Form.Label>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">
                      This determines the element to which the given XSLT
                      transformation should be applied via an XPath expression.
                      If the source element is not specified, the XSLT
                      transformation is applied to the first child of the SOAP
                      body
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
                  readOnly
                  value={sourceXPath}
                  onChange={handleSourceXPathChange}
                />
                <br />
                <Row className="mb-4">
                  <Modal.Title className="text-secondary">
                    XSLT Schema Key
                  </Modal.Title>
                  <Form>
                    <Form.Group>
                      <Form.Label className="XSLTSchemaType">
                        XSLT Schema Key Type
                      </Form.Label>
                      <Form.Select
                        className="custom-form-control"
                        value={selectedXSLTSchemaType}
                        onChange={handleXSLTSchemaTypeSelectChange}
                      >
                        <option value="Static">Static</option>
                        <option value="Dynamic">Dynamic</option>
                      </Form.Select>
                      {selectedXSLTSchemaType === "Static" && (
                        <>
                          <Form.Label className="StXSLTSchemaKey">
                            XSLT Static Schema Key
                          </Form.Label>
                          {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                          <Form.Control
                            className="custom-form-control"
                            type="text"
                            readOnly
                            value={xsltStaticSchemaKey}
                            onChange={handleXSLTStaticSchemaKeyChange}
                          />
                        </>
                      )}
                      {selectedXSLTSchemaType === "Dynamic" && (
                        <>
                          <Form.Label className="DyXSLTSchemaKey">
                            XSLT Dynamic Schema Key
                          </Form.Label>
                          {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                          <Form.Control
                            className="custom-form-control"
                            type="text"
                            readOnly
                            value={xsltDynamicSchemaKey}
                            onChange={handleXSLTDynamicSchemaKeyChange}
                          />
                        </>
                      )}
                    </Form.Group>
                  </Form>
                </Row>
                <Form.Label className="Properties">Properties</Form.Label>
                {/* When a user clicks this textbox, the XSLTProperty Model appears.*/}
                <Form.Control
                  className="custom-form-control"
                  as="textarea"
                  readOnly
                  value={properties}
                  onChange={handlePropertiesChange}
                />
                <Form.Label className="Resources">Resources</Form.Label>
                {/* When a user clicks this textbox, the XSLTResource Model appears.*/}
                <Form.Control
                  className="custom-form-control"
                  as="textarea"
                  readOnly
                  value={resources}
                  onChange={handleResourcesChange}
                />
                <Form.Label className="Features">Features</Form.Label>
                {/* When a user clicks this textbox, the XSLTFeature Model appears.*/}
                <Form.Control
                  className="custom-form-control"
                  as="textarea"
                  readOnly
                  value={features}
                  onChange={handleFeaturesChange}
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
