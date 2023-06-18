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
  aggregateID: string;
  enclosingElementProperty: string;
  correlationExpression: string;
  selectedAggElementType: string;
  description: string;
  completionTimeout: string;
  selectedCompletionMinMsgType: string;
  completionMinMsgValues: string;
  selectedCompletionMaxMsgType: string;
  completionMaxMsgValues: string;
  aggregationExpression: string;
  selectedSequenceType: string;
  sequenceKey: string;
};
export function AggregateMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [aggregateID, setAggregateID] = useState<string>("");
  const [enclosingElementProperty, setEnclosingElementProperty] =
    useState<string>("");
  const [correlationExpression, setCorrelationExpression] =
    useState<string>("");
  const [selectedAggElementType, setSelectedAggElementType] =
    useState<string>("ROOT");
  const [description, setDescription] = useState<string>("");
  const [completionTimeout, setCompletionTimeout] = useState<string>("");
  const [selectedCompletionMinMsgType, setSelectedCompletionMinMsgType] =
    useState<string>("VALUE");
  const [completionMinMsgValues, setCompletionMinMsgValues] =
    useState<string>("");
  const [selectedCompletionMaxMsgType, setSelectedCompletionMaxMsgType] =
    useState<string>("VALUE");
  const [completionMaxMsgValues, setCompletionMaxMsgValues] =
    useState<string>("");
  const [aggregationExpression, setAggregationExpression] =
    useState<string>("");
  const [selectedSequenceType, setSelectedSequenceType] =
    useState<string>("ANONYMOUS");
  const [sequenceKey, setSequenceKey] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleAggregateID = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAggregateID(event.target.value);
  };
  const handleEnclosingElementProperty = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEnclosingElementProperty(event.target.value);
  };
  const handleCorrelationExpression = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCorrelationExpression(event.target.value);
  };
  const handleAggElementTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedAggElementType(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };
  const handleCompletionTimeout = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCompletionTimeout(event.target.value);
  };
  const handleCompletionMinMsgTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCompletionMinMsgType(event.target.value);
  };
  const handleCompletionMinMsgValues = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCompletionMinMsgValues(event.target.value);
  };
  const handleCompletionMaxMsgTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCompletionMaxMsgType(event.target.value);
  };
  const handleCompletionMaxMsgValues = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCompletionMaxMsgValues(event.target.value);
  };
  const handleAggregationExpression = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAggregationExpression(event.target.value);
  };
  const handleSequenceTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSequenceType(event.target.value);
  };
  const handleSequenceKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSequenceKey(event.target.value);
  };
  const handleSubmit = async () => {
    if (!getDiagramEditorLangClient || !textEdit) {
      return [];
    }
  };
  const handleCancelClick = async () => {
    setAggregateID("");
    setEnclosingElementProperty("");
    setCorrelationExpression("");
    setSelectedAggElementType("ROOT");
    setDescription("");
    setCompletionTimeout("");
    setSelectedCompletionMinMsgType("VALUE");
    setCompletionMinMsgValues("");
    setSelectedCompletionMaxMsgType("VALUE");
    setCompletionMaxMsgValues("");
    setAggregationExpression("");
    setSelectedSequenceType("ANONYMOUS");
    setSequenceKey("");
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          Aggregate Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Properties</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="AggregateID">Aggregate ID</Form.Label>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="help-tooltip">
                    This optional attribute can be used to aggregate only
                    responses for split messages that are created by a specific
                    done/iterate mediator. Aggregate ID should be the same as
                    the ID of the corresponding done/iterate mediator that
                    creates split messages
                  </Tooltip>
                }
              >
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Control
                type="text"
                placeholder="eg: Aggregate ID"
                value={aggregateID}
                onChange={handleAggregateID}
              />
              <Form.Label className="EnclosingElementProperty">
                Enclosing Element Property
              </Form.Label>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="help-tooltip">
                    This parameter is used to accumulate the aggregated messages
                    inside a single property. The name of the relevant property
                    is entered in this field
                  </Tooltip>
                }
              >
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Control
                type="text"
                placeholder="eg: Enclosing Element Property"
                value={enclosingElementProperty}
                onChange={handleEnclosingElementProperty}
              />
              <Form.Label className="CorrelationExpression">
                Correlation Expression
              </Form.Label>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="help-tooltip">
                    This is an XPath expression which provides the basis on
                    which response messages should be selected for aggregation.
                    This is done by specifying a set of element for which the
                    messages selected should have matching values. A specific
                    aggregation condition is set Via the Aggregation Expression
                    field
                  </Tooltip>
                }
              >
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>
              <Form.Control
                type="text"
                placeholder="eg: Correlation Expression"
                value={correlationExpression}
                onChange={handleCorrelationExpression}
              />
              <Form.Label className="AggElementType">
                AggregateElementType
              </Form.Label>
              <Form.Select
                value={selectedAggElementType}
                onChange={handleAggElementTypeSelectChange}
              >
                <option value="ROOT">ROOT</option>
                <option value="CHILD">CHILD</option>
              </Form.Select>
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
              <br />
              <Row className="mb-4">
                <Modal.Title className="text-secondary">
                  Completion Condition
                </Modal.Title>
                <Form>
                  <Form.Group>
                    <Form.Label className="CompletionTimeout">
                      Completion Timeout
                    </Form.Label>
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id="help-tooltip">
                          The number of seconds taken by the Aggregate mediator
                          to wait for messages. When this time duration elapses,
                          the aggregation will be completed
                        </Tooltip>
                      }
                    >
                      <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                        <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                      </span>
                    </OverlayTrigger>
                    <Form.Control
                      type="text"
                      placeholder="0"
                      value={completionTimeout}
                      onChange={handleCompletionTimeout}
                    />
                    <Form.Label className="CompletionMinMsgType">
                      Completion Min Messages Type
                    </Form.Label>
                    <Form.Select
                      value={selectedCompletionMinMsgType}
                      onChange={handleCompletionMinMsgTypeSelectChange}
                    >
                      <option value="VALUE">VALUE</option>
                      <option value="EXPRESSION">EXPRESSION</option>
                    </Form.Select>
                    {selectedCompletionMinMsgType === "VALUE" && (
                      <>
                        <Form.Label className="CompletionMinMsgValues">
                          Completion Min Messages Values
                        </Form.Label>
                        <OverlayTrigger
                          placement="right"
                          overlay={
                            <Tooltip id="help-tooltip">
                              Minimum number of messages required for the
                              aggregation to complete. When the time duration
                              entered in the Completion Timeout field is
                              elapsed, the aggregation will be completed even if
                              the number of minimum response message specified
                              has not been received
                            </Tooltip>
                          }
                        >
                          <span
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          >
                            <FontAwesomeIcon
                              icon={faQuestionCircle}
                              size="sm"
                            />
                          </span>
                        </OverlayTrigger>
                        <Form.Control
                          type="text"
                          placeholder="-1"
                          value={completionMinMsgValues}
                          onChange={handleCompletionMinMsgValues}
                        />
                      </>
                    )}
                    {selectedCompletionMinMsgType === "EXPRESSION" && (
                      <>
                        <Form.Label className="CompletionMinMsgValues">
                          Completion Min Messages
                        </Form.Label>
                        {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                        <Form.Control
                          type="text"
                          readOnly
                          value={completionMinMsgValues}
                          onChange={handleCompletionMinMsgValues}
                        />
                      </>
                    )}
                    <Form.Label className="CompletionMaxMsgType">
                      Completion Max Messages Type
                    </Form.Label>
                    <Form.Select
                      value={selectedCompletionMaxMsgType}
                      onChange={handleCompletionMaxMsgTypeSelectChange}
                    >
                      <option value="VALUE">VALUE</option>
                      <option value="EXPRESSION">EXPRESSION</option>
                    </Form.Select>
                    {selectedCompletionMaxMsgType === "VALUE" && (
                      <>
                        <Form.Label className="CompletionMaxMsgValues">
                          Completion Max Messages Values
                        </Form.Label>
                        <OverlayTrigger
                          placement="right"
                          overlay={
                            <Tooltip id="help-tooltip">
                              Maximum number of messages that can exist
                              aggregation. When the number of response messages
                              received reaches this number, the aggregation will
                              be completed
                            </Tooltip>
                          }
                        >
                          <span
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          >
                            <FontAwesomeIcon
                              icon={faQuestionCircle}
                              size="sm"
                            />
                          </span>
                        </OverlayTrigger>
                        <Form.Control
                          type="text"
                          placeholder="-1"
                          value={completionMaxMsgValues}
                          onChange={handleCompletionMaxMsgValues}
                        />
                      </>
                    )}
                    {selectedCompletionMaxMsgType === "EXPRESSION" && (
                      <>
                        <Form.Label className="CompletionMaxMsgValues">
                          Completion Max Messages
                        </Form.Label>
                        {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
                        <Form.Control
                          type="text"
                          readOnly
                          value={completionMaxMsgValues}
                          onChange={handleCompletionMaxMsgValues}
                        />
                      </>
                    )}
                  </Form.Group>
                </Form>
              </Row>
              <br />
              <Row className="mb-4">
                <Modal.Title className="text-secondary">OnComplete</Modal.Title>
                <Form>
                  <Form.Group>
                    <Form.Label className="AggregationExpression">
                      Aggregation Expression
                    </Form.Label>
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id="help-tooltip">
                          XPath expression specifying which elements should be
                          aggregated. A set of messages that are selected for
                          aggregation is determined by the value specified in
                          the Correlation Expression field
                        </Tooltip>
                      }
                    >
                      <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                        <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                      </span>
                    </OverlayTrigger>
                    <Form.Control
                      type="text"
                      placeholder="eg: Aggregate ID"
                      value={aggregationExpression}
                      onChange={handleAggregationExpression}
                    />
                    <Form.Label className="SequenceType">
                      Sequence Type
                    </Form.Label>
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id="help-tooltip">
                          Select the sequence type to run when the aggregation
                          is complete
                        </Tooltip>
                      }
                    >
                      <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                        <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                      </span>
                    </OverlayTrigger>
                    <Form.Select
                      value={selectedSequenceType}
                      onChange={handleSequenceTypeSelectChange}
                    >
                      <option value="ANONYMOUS">ANONYMOUS</option>
                      <option value="REGISTRY_REFERENCE">
                        REGISTRY_REFERENCE
                      </option>
                    </Form.Select>
                    {selectedSequenceType === "REGISTRY_REFERENCE" && (
                      <>
                        <Form.Label className="SequenceKey">
                          Sequence Key
                        </Form.Label>
                        {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                        <Form.Control
                          type="text"
                          placeholder="eg: Sequence Key"
                          value={sequenceKey}
                          onChange={handleSequenceKey}
                        />
                      </>
                    )}
                  </Form.Group>
                </Form>
              </Row>
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
