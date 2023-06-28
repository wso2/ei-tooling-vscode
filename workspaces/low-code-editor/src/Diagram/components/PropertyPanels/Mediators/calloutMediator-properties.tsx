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
export function CalloutMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };
  const [selectedEndpointType, setSelectedEndpointType] = useState("URL");
  const [soapAction, setSoapAction] = useState("");
  const [pathToAxis2Repository, setPathToAxis2Repository] = useState("");
  const [pathToAxis2XML, setPathToAxis2XML] = useState("");
  const [
    selectedAxis2ClientOptionsMethod,
    setSelectedAxis2ClientOptionsMethod,
  ] = useState("Axis2ClientOptions");
  const [serviceURL, setServiceURL] = useState("");
  const [addressEndpointType, setAddressEndpointType] = useState("");
  const [selectedPayloadType, setSelectedPayloadType] = useState("XPATH");
  const [payloadMessageXPath, setPayloadMessageXPath] = useState("");
  const [payloadProperty, setPayloadProperty] = useState("");
  const [selectedResultType, setSelectedResultType] = useState("XPATH");
  const [resultMessageXPath, setResultMessageXPath] = useState("");
  const [resultContextProperty, setResultContextProperty] = useState("");
  const [selectedSecurityType, setSelectedSecurityType] = useState("FALSE");
  const [selectedPolicies, setSelectedPolicies] = useState("FALSE");
  const [policyKey, setPolicyKey] = useState("");
  const [outboundPolicyKey, setOutboundPolicyKey] = useState("");
  const [inboundPolicyKey, setInboundPolicyKey] = useState("");
  const [description, setDescription] = useState("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleEndpointTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedEndpointType(event.target.value);
  };
  const handleSoapActionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSoapAction(event.target.value);
  };
  const handlePathToAxis2RepositoryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPathToAxis2Repository(event.target.value);
  };
  const handlePathToAxis2XMLChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPathToAxis2XML(event.target.value);
  };
  const handleAxis2ClientOptionsMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedAxis2ClientOptionsMethod(event.target.value);
  };
  const handleServiceURLChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setServiceURL(event.target.value);
  };
  const handleAddressEndpointTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAddressEndpointType(event.target.value);
  };
  const handlePayloadTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPayloadType(event.target.value);
  };
  const handlePayloadMessageXPathChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPayloadMessageXPath(event.target.value);
  };
  const handlePayloadPropertyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPayloadProperty(event.target.value);
  };
  const handleResultTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedResultType(event.target.value);
  };
  const handleResultMessageXPathChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setResultMessageXPath(event.target.value);
  };
  const handleResultContextPropertyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setResultContextProperty(event.target.value);
  };
  const handleSecurityTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSecurityType(event.target.value);
  };
  const handlePoliciesSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPolicies(event.target.value);
  };
  const handlePolicyKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPolicyKey(event.target.value);
  };
  const handleOutboundPolicyKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOutboundPolicyKey(event.target.value);
  };
  const handleInboundPolicyKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInboundPolicyKey(event.target.value);
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
          <Modal.Title className="text-primary">Callout Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Service</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="EndpointType">Endpoint Type</Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedEndpointType}
                  onChange={handleEndpointTypeSelectChange}
                >
                  <option value="URL">URL</option>
                  <option value="AddressEndpoint">Address Endpoint</option>
                </Form.Select>
                <Form.Label className="SOAPAction">SOAP Action</Form.Label>
                <Form.Control
                  className="custom-form-control"
                  type="text"
                  placeholder="eg: SOAP Action"
                  value={soapAction}
                  onChange={handleSoapActionChange}
                />
                <Form.Label className="PathAxis2Repository">
                  Path to Axis2 Repository
                </Form.Label>
                <Form.Control
                  className="custom-form-control"
                  type="text"
                  placeholder="eg: Path to Axis2 Repository"
                  value={pathToAxis2Repository}
                  onChange={handlePathToAxis2RepositoryChange}
                />
                <Form.Label className="PathAxis2XML">
                  Path to Axis2 XML
                </Form.Label>
                <Form.Control
                  className="custom-form-control"
                  type="text"
                  placeholder="eg: Path to Axis2 XML"
                  value={pathToAxis2XML}
                  onChange={handlePathToAxis2XMLChange}
                />
                <br />
                <Form.Check
                  type="checkbox"
                  className="checkbox"
                  label={
                    <span className="checkbox-font">
                      Init Axis2 Client Options
                    </span>
                  }
                  checked={
                    selectedAxis2ClientOptionsMethod === "Axis2ClientOptions"
                  }
                  value="Axis2ClientOptions"
                  onChange={handleAxis2ClientOptionsMethodChange}
                />
                {selectedEndpointType === "URL" && (
                  <>
                    <Form.Label className="ServiceURL">Service URL</Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      placeholder="eg: Service URL"
                      value={serviceURL}
                      onChange={handleServiceURLChange}
                    />
                  </>
                )}
                {selectedEndpointType === "AddressEndpoint" && (
                  <>
                    <Form.Label className="AddressEndpointType">
                      Address Endpoint
                    </Form.Label>
                    {/* When a user clicks this textbox, the Resource KeyModel appears.*/}
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      readOnly
                      value={addressEndpointType}
                      onChange={handleAddressEndpointTypeChange}
                    />
                  </>
                )}
              </Form.Group>
            </Form>
          </Row>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Source</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="PayloadType">Payload Type</Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedPayloadType}
                  onChange={handlePayloadTypeSelectChange}
                >
                  <option value="XPATH">XPATH</option>
                  <option value="Property">Property</option>
                  <option value="ENVELOP">ENVELOP</option>
                </Form.Select>
                {selectedPayloadType === "XPATH" && (
                  <>
                    <Form.Label className="PayloadMessageXPath">
                      Payload Message Xpath
                    </Form.Label>
                    {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      readOnly
                      value={payloadMessageXPath}
                      onChange={handlePayloadMessageXPathChange}
                    />
                  </>
                )}
                {selectedPayloadType === "Property" && (
                  <>
                    <Form.Label className="PayloadProperty">
                      Payload Property
                    </Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      placeholder="eg: Payload Property"
                      value={payloadProperty}
                      onChange={handlePayloadPropertyChange}
                    />
                  </>
                )}
              </Form.Group>
            </Form>
          </Row>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">Target</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="ResultType">Result Type</Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedResultType}
                  onChange={handleResultTypeSelectChange}
                >
                  <option value="XPATH">XPATH</option>
                  <option value="Property">Property</option>
                </Form.Select>
                {selectedResultType === "XPATH" && (
                  <>
                    <Form.Label className="ResultMessageXPath">
                      Result Message Xpath
                    </Form.Label>
                    {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                    <Form.Control
                      type="text"
                      readOnly
                      value={resultMessageXPath}
                      onChange={handleResultMessageXPathChange}
                    />
                  </>
                )}
                {selectedResultType === "Property" && (
                  <>
                    <Form.Label className="ResultContextProperty">
                      Result Context Property
                    </Form.Label>
                    <Form.Control
                      className="custom-form-control"
                      type="text"
                      placeholder="eg: context_property_name"
                      value={resultContextProperty}
                      onChange={handleResultContextPropertyChange}
                    />
                  </>
                )}
              </Form.Group>
            </Form>
          </Row>
          <Row className="mb-4">
            <Modal.Title className="text-secondary">WS</Modal.Title>
            <Form>
              <Form.Group>
                <Form.Label className="SecurityType">Security Type</Form.Label>
                <Form.Select
                  className="custom-form-control"
                  value={selectedSecurityType}
                  onChange={handleSecurityTypeSelectChange}
                >
                  <option value="FALSE">FALSE</option>
                  <option value="TRUE">TRUE</option>
                </Form.Select>
                {selectedSecurityType === "TRUE" && (
                  <>
                    <Form.Label className="Policies">Policies</Form.Label>
                    <Form.Select
                      className="custom-form-control"
                      value={selectedPolicies}
                      onChange={handlePoliciesSelectChange}
                    >
                      <option value="FALSE">FALSE</option>
                      <option value="TRUE">TRUE</option>
                    </Form.Select>
                    {selectedPolicies === "FALSE" && (
                      <>
                        <Form.Label className="PolicyKey">
                          Policy Key
                        </Form.Label>
                        {/* When a user clicks this textbox, the Resource KeyModel appears.*/}
                        <Form.Control
                          type="text"
                          readOnly
                          value={policyKey}
                          onChange={handlePolicyKeyChange}
                        />
                      </>
                    )}
                    {selectedPolicies === "TRUE" && (
                      <>
                        <Form.Label className="OutboundPolicyKey">
                          Outbound Policy Key
                        </Form.Label>
                        {/* When a user clicks this textbox, the Resource KeyModel appears.*/}
                        <Form.Control
                          className="custom-form-control"
                          type="text"
                          readOnly
                          value={outboundPolicyKey}
                          onChange={handleOutboundPolicyKeyChange}
                        />
                        <Form.Label className="InboundPolicyKey">
                          Inbound Policy Key
                        </Form.Label>
                        {/* When a user clicks this textbox, the Resource KeyModel appears.*/}
                        <Form.Control
                          className="custom-form-control"
                          type="text"
                          readOnly
                          value={inboundPolicyKey}
                          onChange={handleInboundPolicyKeyChange}
                        />
                      </>
                    )}
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
