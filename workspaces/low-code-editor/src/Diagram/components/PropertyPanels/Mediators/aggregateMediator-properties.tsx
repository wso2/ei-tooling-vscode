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

export function AggregateMediatorProperty(props: Props) {
  const handleCancelClick = () => {
    props.modalClose(false);
  };

  const [aggregateID, setAggregateID] = useState("");
  const [enclosingElementProperty, setEnclosingElementProperty] = useState("");
  const [correlationExpression, setCorrelationExpression] = useState("");
  const [selectedAggElementType, setSelectedAggElementType] = useState("ROOT");
  const [description, setDescription] = useState("");
  const [completionTimeout, setCompletionTimeout] = useState("");
  const [selectedCompletionMinMsgType, setSelectedCompletionMinMsgType] =
    useState("VALUE");
  const [completionMinMsgValues, setCompletionMinMsgValues] = useState("");
  const [selectedCompletionMaxMsgType, setSelectedCompletionMaxMsgType] =
    useState("VALUE");
  const [completionMaxMsgValues, setCompletionMaxMsgValues] = useState("");
  const [aggregationExpression, setAggregationExpression] = useState("");
  const [selectedSequenceType, setSelectedSequenceType] = useState("ANONYMOUS");
  const [sequenceKey, setSequenceKey] = useState("");
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

  return (
    <>
      <Modal
        show={props.modalOpen}
        onHide={handleCancelClick}
        dialogClassName="custom-modal-dialog"
      >
        <Modal.Header>
          <Modal.Title className="text-primary">Aggregate Mediator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                      responses for split messages that are created by a
                      specific done/iterate mediator. Aggregate ID should be the
                      same as the ID of the corresponding done/iterate mediator
                      that creates split messages
                    </Tooltip>
                  }
                >
                  <span className="custom-question-icon">
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                <Form.Control
                  type="text"
                  placeholder="eg: Aggregate ID"
                  value={aggregateID}
                  onChange={handleAggregateID}
                  className="custom-form-control"
                />
                <Form.Label className="EnclosingElementProperty">
                  Enclosing Element Property
                </Form.Label>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">
                      This parameter is used to accumulate the aggregated
                      messages inside a single property. The name of the
                      relevant property is entered in this field
                    </Tooltip>
                  }
                >
                  <span className="custom-question-icon">
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                <Form.Control
                  type="text"
                  placeholder="eg: Enclosing Element Property"
                  value={enclosingElementProperty}
                  onChange={handleEnclosingElementProperty}
                  className="custom-form-control"
                />
                <Form.Label className="CorrelationExpression">
                  Correlation Expression
                </Form.Label>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="help-tooltip">
                      This is an XPath expression which provides the basis on
                      which response messages should be selected for
                      aggregation. This is done by specifying a set of element
                      for which the messages selected should have matching
                      values. A specific aggregation condition is set Via the
                      Aggregation Expression field
                    </Tooltip>
                  }
                >
                  <span className="custom-question-icon">
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                <Form.Control
                  type="text"
                  placeholder="eg: Correlation Expression"
                  value={correlationExpression}
                  onChange={handleCorrelationExpression}
                  className="custom-form-control"
                />
                <Form.Label className="AggElementType">
                  AggregateElementType
                </Form.Label>
                <Form.Select
                  className="custom-form-control"
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
                  <span className="custom-question-icon">
                    <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                  </span>
                </OverlayTrigger>
                <Form.Control
                  as="textarea"
                  value={description}
                  onChange={handleDescription}
                  placeholder="eg: None"
                  className="custom-form-control"
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
                            The number of seconds taken by the Aggregate
                            mediator to wait for messages. When this time
                            duration elapses, the aggregation will be completed
                          </Tooltip>
                        }
                      >
                        <span className="custom-question-icon">
                          <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                        </span>
                      </OverlayTrigger>
                      <Form.Control
                        type="text"
                        placeholder="0"
                        value={completionTimeout}
                        onChange={handleCompletionTimeout}
                        className="custom-form-control"
                      />
                      <Form.Label className="CompletionMinMsgType">
                        Completion Min Messages Type
                      </Form.Label>
                      <Form.Select
                        className="custom-form-control"
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
                                elapsed, the aggregation will be completed even
                                if the number of minimum response message
                                specified has not been received
                              </Tooltip>
                            }
                          >
                            <span className="custom-question-icon">
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
                            className="custom-form-control"
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
                            className="custom-form-control"
                          />
                        </>
                      )}
                      <Form.Label className="CompletionMaxMsgType">
                        Completion Max Messages Type
                      </Form.Label>
                      <Form.Select
                        className="custom-form-control"
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
                                aggregation. When the number of response
                                messages received reaches this number, the
                                aggregation will be completed
                              </Tooltip>
                            }
                          >
                            <span className="custom-question-icon">
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
                            className="custom-form-control"
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
                            className="custom-form-control"
                          />
                        </>
                      )}
                    </Form.Group>
                  </Form>
                </Row>
                <Row className="mb-4">
                  <Modal.Title className="text-secondary">
                    OnComplete
                  </Modal.Title>
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
                        <span className="custom-question-icon">
                          <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                        </span>
                      </OverlayTrigger>
                      <Form.Control
                        type="text"
                        placeholder="eg: Aggregate ID"
                        value={aggregationExpression}
                        onChange={handleAggregationExpression}
                        className="custom-form-control"
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
                        <span className="custom-question-icon">
                          <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                        </span>
                      </OverlayTrigger>
                      <Form.Select
                        className="custom-form-control"
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
                            className="custom-form-control"
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
