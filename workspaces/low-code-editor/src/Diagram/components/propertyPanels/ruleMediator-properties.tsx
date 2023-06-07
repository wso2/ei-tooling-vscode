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
  sourceValue: string;
  sourceXPath: string;
  targetValue: string;
  selectedTargetAction: string;
  targetXPath: string;
  targetResultXPath: string;
  selectedRuleSetType: string;
  selectedRuleSetSourceType: string;
  ruleSetSourceCode: string;
  inlineRegistryKey: string;
  ruleSetURL: string;
  inputWrapperName: string;
  inputNamespace: string;
  factsConfiguration: string;
  outputWrapperName: string;
  outputNamespace: string;
  resultsConfiguration: string;
  description: string;
};
export function RuleMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [sourceValue, setSourceValue] = useState<string>("");
  const [sourceXPath, setSourceXPath] = useState<string>("");
  const [targetValue, setTargetValue] = useState<string>("");
  const [selectedTargetAction, setSelectedTargetAction] =
    useState<string>("Replace");
  const [targetXPath, setTargetXPath] = useState<string>("");
  const [targetResultXPath, setTargetResultXPath] = useState<string>("");
  const [selectedRuleSetType, setSelectedRuleSetType] =
    useState<string>("Regular");
  const [selectedRuleSetSourceType, setSelectedRuleSetSourceType] =
    useState<string>("INLINE");
  const [ruleSetSourceCode, setRuleSetSourceCode] = useState<string>("");
  const [inlineRegistryKey, setInlineRegistryKey] = useState<string>("");
  const [ruleSetURL, setRuleSetURL] = useState<string>("");
  const [inputWrapperName, setInputWrapperName] = useState<string>("");
  const [inputNamespace, setInputNamespace] = useState<string>("");
  const [factsConfiguration, setFactsConfiguration] = useState<string>("");
  const [outputWrapperName, setOutputWrapperName] = useState<string>("");
  const [outputNamespace, setOutputNamespace] = useState<string>("");
  const [resultsConfiguration, setResultsConfiguration] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleSourceValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourceValue(event.target.value);
  };
  const handleSourceXPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSourceXPath(event.target.value);
  };
  const handleTargetValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetValue(event.target.value);
  };
  const handleTargetActionSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTargetAction(event.target.value);
  };
  const handleTargetXPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetXPath(event.target.value);
  };
  const handleTargetResultXPath = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTargetResultXPath(event.target.value);
  };
  const handleRuleSetTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedRuleSetType(event.target.value);
  };
  const handleRuleSetSourceTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedRuleSetSourceType(event.target.value);
  };
  const handleRuleSetSourceCode = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setRuleSetSourceCode(event.target.value);
  };
  const handleInlineRegistryKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInlineRegistryKey(event.target.value);
  };
  const handleRuleSetURL = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRuleSetURL(event.target.value);
  };
  const handleInputWrapperName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputWrapperName(event.target.value);
  };
  const handleInputNamespace = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputNamespace(event.target.value);
  };
  const handleFactsConfiguration = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFactsConfiguration(event.target.value);
  };
  const handleOutputWrapperName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOutputWrapperName(event.target.value);
  };
  const handleOutputNamespace = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOutputNamespace(event.target.value);
  };
  const handleResultsConfiguration = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setResultsConfiguration(event.target.value);
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
        sourceValue,
        sourceXPath,
        targetValue,
        selectedTargetAction,
        // targetXPath,
        // targetResultXPath,
        // selectedRuleSetType,
        // selectedRuleSetSourceType,
        // ruleSetSourceCode,
        // inlineRegistryKey,
        // ruleSetURL,
        // inputWrapperName,
        // inputNamespace,
        // factsConfiguration,
        // outputWrapperName,
        // outputNamespace,
        // resultsConfiguration,
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
          Rule Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Source</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="SourceValue">Source Value</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg: Source Value"
                value={sourceValue}
                onChange={handleSourceValue}
              />
              <Form.Label className="SourceXPath">Source XPath</Form.Label>
              {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
              <Form.Control
                type="text"
                readOnly
                value={sourceXPath}
                onChange={handleSourceXPath}
              />
            </Form.Group>
          </Form>
        </Row>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Target</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="TargetValue">Target Value</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg: Target Value"
                value={targetValue}
                onChange={handleTargetValue}
              />
              <Form.Label className="TargetAction">Target Action</Form.Label>
              <Form.Select
                value={selectedTargetAction}
                onChange={handleTargetActionSelectChange}
              >
                <option value="Replace">Replace</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
              </Form.Select>
              <Form.Label className="TargetXPath">Target XPath</Form.Label>
              {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
              <Form.Control
                type="text"
                readOnly
                value={targetXPath}
                onChange={handleTargetXPath}
              />
              <Form.Label className="TargetResultXPath">
                Target Result XPath
              </Form.Label>
              {/* When a user clicks this textbox, the Expression Selector Model appears.*/}
              <Form.Control
                type="text"
                readOnly
                value={targetResultXPath}
                onChange={handleTargetResultXPath}
              />
            </Form.Group>
          </Form>
        </Row>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Rule Set</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="RuleSetType">Rule Set Type</Form.Label>
              <Form.Select
                value={selectedRuleSetType}
                onChange={handleRuleSetTypeSelectChange}
              >
                <option value="Regular">Regular</option>
                <option value="DecisionTable">Decision Table</option>
              </Form.Select>
              <Form.Label className="RuleSetSourceType">
                Rule Set Source Type
              </Form.Label>
              <Form.Select
                value={selectedRuleSetSourceType}
                onChange={handleRuleSetSourceTypeSelectChange}
              >
                <option value="INLINE">INLINE</option>
                <option value="REGISTRY_REFERENCE">REGISTRY_REFERENCE</option>
                <option value="URL">URL</option>
              </Form.Select>
              {selectedRuleSetSourceType === "INLINE" && (
                <>
                  <Form.Label className="RuleSetSourceCode">
                    Rule Set Source Code
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    style={{ minHeight: "200px" }}
                    value={ruleSetSourceCode}
                    onChange={handleRuleSetSourceCode}
                  >
                    &lt;code/&gt;
                  </Form.Control>
                </>
              )}
              {selectedRuleSetSourceType === "REGISTRY_REFERENCE" && (
                <>
                  <Form.Label className="InlineRegistryKey">
                    Inline Registry Key
                  </Form.Label>
                  {/* When a user clicks this textbox, the Resource KeyModel appears.*/}
                  <Form.Control
                    type="text"
                    readOnly
                    value={inlineRegistryKey}
                    onChange={handleInlineRegistryKey}
                  />
                </>
              )}
              {selectedRuleSetSourceType === "URL" && (
                <>
                  <Form.Label className="RuleSetURL">Rule Set URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="eg: Rule Set URL"
                    value={ruleSetURL}
                    onChange={handleRuleSetURL}
                  />
                </>
              )}
            </Form.Group>
          </Form>
        </Row>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Input Facts</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="InputWrapperName">
                Input Wrapper Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="eg: Input Wrapper Name"
                value={inputWrapperName}
                onChange={handleInputWrapperName}
              />
              <Form.Label className="InputNamespace">
                Input Namespace
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="eg: Input Namespace"
                value={inputNamespace}
                onChange={handleInputNamespace}
              />
              <Form.Label className="FactsConfiguration">
                Facts Configuration
              </Form.Label>
              {/* When a user clicks this textbox, the RuleFactsConfiguration Model appears.*/}
              <Form.Control
                as="textarea"
                style={{ minHeight: "200px" }}
                readOnly
                value={factsConfiguration}
                onChange={handleFactsConfiguration}
              />
            </Form.Group>
          </Form>
        </Row>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Output Facts</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="OutputWrapperName">
                Output Wrapper Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="eg: Output Wrapper Name"
                value={outputWrapperName}
                onChange={handleOutputWrapperName}
              />
              <Form.Label className="OutputNamespace">
                Output Namespace
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="eg: Output Namespace"
                value={outputNamespace}
                onChange={handleOutputNamespace}
              />
              <Form.Label className="ResultsConfiguration">
                Results Configuration
              </Form.Label>
              {/* When a user clicks this textbox, the RuleResultsConfiguration Model appears.*/}
              <Form.Control
                as="textarea"
                style={{ minHeight: "200px" }}
                readOnly
                value={resultsConfiguration}
                onChange={handleResultsConfiguration}
              />
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
