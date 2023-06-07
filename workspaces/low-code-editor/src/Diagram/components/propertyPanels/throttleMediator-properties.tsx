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
  groupId: string;
  selectedOnAcceptBSeqType: string;
  onAcceptBSeqKey: string;
  selectedOnRejectBSeqType: string;
  onRejectBSeqKey: string;
  selectedPolicyType: string;
  policyEntries: string;
  policyKey: string;
  description: string;
};
export function ThrottleMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [groupId, setGroupId] = useState<string>("");
  const [selectedOnAcceptBSeqType, setSelectedOnAcceptBSeqType] =
    useState<string>("ANONYMOUS");
  const [onAcceptBSeqKey, setOnAcceptBSeqKey] = useState<string>("");
  const [selectedOnRejectBSeqType, setSelectedOnRejectBSeqType] =
    useState<string>("ANONYMOUS");
  const [onRejectBSeqKey, setOnRejectBSeqKey] = useState<string>("");
  const [selectedPolicyType, setSelectedPolicyType] =
    useState<string>("INLINE");
  const [policyEntries, setPolicyEntries] = useState<string>("");
  const [policyKey, setPolicyKey] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleGroupIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupId(event.target.value);
  };
  const handleOnAcceptBSeqTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOnAcceptBSeqType(event.target.value);
  };
  const handleOnAcceptBSeqKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOnAcceptBSeqKey(event.target.value);
  };
  const handleOnRejectBSeqTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOnRejectBSeqType(event.target.value);
  };
  const handleOnRejectBSeqKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOnRejectBSeqKey(event.target.value);
  };
  const handlePolicyTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPolicyType(event.target.value);
  };
  const handlePolicyEntriesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPolicyEntries(event.target.value);
  };
  const handlePolicyKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPolicyKey(event.target.value);
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
        groupId,
        selectedOnAcceptBSeqType,
        onAcceptBSeqKey,
        selectedOnRejectBSeqType,
        // onRejectBSeqKey,
        // selectedPolicyType,
        // policyEntries,
        // policyKey,
        description,
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
    setDescription("");
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          Throttle Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">General</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="Group Id">Group Id</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg: Group Id"
                value={groupId}
                onChange={handleGroupIdChange}
              />
            </Form.Group>
          </Form>
        </Row>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">OnAccept</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="OnAcceptBSeqType">
                On Accept Branch Sequence Type
              </Form.Label>
              <Form.Select
                value={selectedOnAcceptBSeqType}
                onChange={handleOnAcceptBSeqTypeSelectChange}
              >
                <option value="ANONYMOUS">ANONYMOUS</option>
                <option value="REGISTRY_REFERENCE">REGISTRY_REFERENCE</option>
              </Form.Select>
              {selectedOnAcceptBSeqType === "REGISTRY_REFERENCE" && (
                <>
                  <Form.Label className="OnAcceptBSeqKey">
                    On Accept Branch Sequence Key
                  </Form.Label>
                  {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                  <Form.Control
                    type="text"
                    readOnly
                    value={onAcceptBSeqKey}
                    onChange={handleOnAcceptBSeqKeyChange}
                  />
                </>
              )}
            </Form.Group>
          </Form>
        </Row>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">OnReject</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="OnRejectBSeqType">
                On Reject Branch Sequence Type
              </Form.Label>
              <Form.Select
                value={selectedOnRejectBSeqType}
                onChange={handleOnRejectBSeqTypeSelectChange}
              >
                <option value="ANONYMOUS">ANONYMOUS</option>
                <option value="REGISTRY_REFERENCE">REGISTRY_REFERENCE</option>
              </Form.Select>
              {selectedOnRejectBSeqType === "REGISTRY_REFERENCE" && (
                <>
                  <Form.Label className="OnRejectBSeqKey">
                    On Reject Branch Sequence Key
                  </Form.Label>
                  {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                  <Form.Control
                    type="text"
                    readOnly
                    value={onRejectBSeqKey}
                    onChange={handleOnRejectBSeqKeyChange}
                  />
                </>
              )}
            </Form.Group>
          </Form>
        </Row>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Throttle Policy</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="PolicyType">Policy Type</Form.Label>
              <Form.Select
                value={selectedPolicyType}
                onChange={handlePolicyTypeSelectChange}
              >
                <option value="INLINE">INLINE</option>
                <option value="REGISTRY_REFERENCE">REGISTRY_REFERENCE</option>
              </Form.Select>
              {selectedPolicyType === "INLINE" && (
                <>
                  <Form.Label className="PolicyEntries">
                    Policy Entries
                  </Form.Label>
                  {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                  <Form.Control
                    as="textarea"
                    style={{ minHeight: "200px" }}
                    readOnly
                    value={policyEntries}
                    onChange={handlePolicyEntriesChange}
                  />
                </>
              )}
              {selectedPolicyType === "REGISTRY_REFERENCE" && (
                <>
                  <Form.Label className="PolicyKey">Policy Key</Form.Label>
                  {/* When a user clicks this textbox, the Resource Key Model appears.*/}
                  <Form.Control
                    type="text"
                    readOnly
                    value={policyKey}
                    onChange={handlePolicyKeyChange}
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
