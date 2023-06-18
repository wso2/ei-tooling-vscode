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
  streamName: string;
  streamVersion: string;
  eventSink: string;
  selectedAsyncMethod: string;
  asyncTimeout: string;
  metaAttributes: string;
  correlationAttributes: string;
  payloadAttributes: string;
  arbitraryAttributes: string;
  description: string;
};
export function PublishEventMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [streamName, setStreamName] = useState<string>("");
  const [streamVersion, setStreamVersion] = useState<string>("");
  const [eventSink, setEventSink] = useState<string>("");
  const [selectedAsyncMethod, setSelectedAsyncMethod] =
    useState<string>("Async");
  const [asyncTimeout, setAsyncTimeout] = useState<string>("");
  const [metaAttributes, setMetaAttributes] = useState<string>("");
  const [correlationAttributes, setCorrelationAttributes] =
    useState<string>("");
  const [payloadAttributes, setPayloadAttributes] = useState<string>("");
  const [arbitraryAttributes, setArbitraryAttributes] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleStreamName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStreamName(event.target.value);
  };
  const handleStreamVersion = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStreamVersion(event.target.value);
  };
  const handleEventSink = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventSink(event.target.value);
  };
  const handleAsyncMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedAsyncMethod(event.target.value);
  };
  const handleAsyncTimeout = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAsyncTimeout(event.target.value);
  };
  const handleMetaAttributes = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMetaAttributes(event.target.value);
  };
  const handleCorrelationAttributes = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCorrelationAttributes(event.target.value);
  };
  const handlePayloadAttributes = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPayloadAttributes(event.target.value);
  };
  const handleArbitraryAttributes = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setArbitraryAttributes(event.target.value);
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
    setStreamName("");
    setStreamVersion("");
    setEventSink("");
    setSelectedAsyncMethod("Async");
    setAsyncTimeout("");
    setMetaAttributes("");
    setCorrelationAttributes("");
    setPayloadAttributes("");
    setArbitraryAttributes("");
    setDescription("");
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          Publish Event Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Properties</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="StreamName">Stream Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg: Stream Name"
                value={streamName}
                onChange={handleStreamName}
              />
              <Form.Label className="StreamVersion">Stream Version</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg: Stream Version"
                value={streamVersion}
                onChange={handleStreamVersion}
              />
              <Form.Label className="EventSink">Event Sink</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg: Event Sink"
                value={eventSink}
                onChange={handleEventSink}
              />
              <br />
              <Form.Check
                type="checkbox"
                className="Async"
                style={{ display: "flex", alignItems: "center" }}
                label={<span style={{ marginLeft: "10px" }}>Async</span>}
                checked={selectedAsyncMethod === "Async"}
                value="Async"
                onChange={handleAsyncMethodChange}
                defaultChecked
              />
              <Form.Label className="AsyncTimeout">Async Timeout</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg: Async Timeout"
                value={asyncTimeout}
                onChange={handleAsyncTimeout}
              />
              <br />
              <Row className="mb-4">
                <Modal.Title className="text-secondary">
                  Meta Attributes
                </Modal.Title>
                <Form>
                  <Form.Group>
                    <Form.Label className="MetaAttributes">
                      Meta Attributes
                    </Form.Label>
                    {/* When a user clicks this EX textbox, the PublishEventMediatorAttribute Model appears*/}
                    <Form.Control
                      as="textarea"
                      style={{ minHeight: "200px" }}
                      readOnly
                      value={metaAttributes}
                      onChange={handleMetaAttributes}
                    />
                  </Form.Group>
                </Form>
              </Row>
              <br />
              <Row className="mb-4">
                <Modal.Title className="text-secondary">
                  Correlation Attributes
                </Modal.Title>
                <Form>
                  <Form.Group>
                    <Form.Label className="CorrelationAttributes">
                      Correlation Attributes
                    </Form.Label>
                    {/* When a user clicks this EX textbox, the PublishEventMediatorAttribute Model appears*/}
                    <Form.Control
                      as="textarea"
                      style={{ minHeight: "200px" }}
                      readOnly
                      value={correlationAttributes}
                      onChange={handleCorrelationAttributes}
                    />
                  </Form.Group>
                </Form>
              </Row>
              <br />
              <Row className="mb-4">
                <Modal.Title className="text-secondary">
                  Payload Attributes
                </Modal.Title>
                <Form>
                  <Form.Group>
                    <Form.Label className="PayloadAttributes">
                      Payload Attributes
                    </Form.Label>
                    {/* When a user clicks this EX textbox, the PublishEventMediatorAttribute Model appears*/}
                    <Form.Control
                      as="textarea"
                      style={{ minHeight: "200px" }}
                      readOnly
                      value={payloadAttributes}
                      onChange={handlePayloadAttributes}
                    />
                  </Form.Group>
                </Form>
              </Row>
              <br />
              <Row className="mb-4">
                <Modal.Title className="text-secondary">
                  Arbitrary Attributes
                </Modal.Title>
                <Form>
                  <Form.Group>
                    <Form.Label className="ArbitraryAttributes">
                      Arbitrary Attributes
                    </Form.Label>
                    {/* When a user clicks this EX textbox, the PublishEventMediatorAttribute Model appears*/}
                    <Form.Control
                      as="textarea"
                      style={{ minHeight: "200px" }}
                      readOnly
                      value={arbitraryAttributes}
                      onChange={handleArbitraryAttributes}
                    />
                  </Form.Group>
                </Form>
              </Row>
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
