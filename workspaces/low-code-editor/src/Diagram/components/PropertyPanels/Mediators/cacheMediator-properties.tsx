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
  selectedCacheMImp: string;
  selectedCacheType: string;
  cacheTimeout: string;
  maxMsgSize: string;
  maxEntryCount: string;
  selectedSequenceType: string;
  sequenceKey: string;
  selectedCacheProtocolType: string;
  cacheProtocolMethods: string;
  headersToExcludeInHash: string;
  headersToIncludeInHash: string;
  responseCodes: string;
  selectedEnableCacheControlMethod: string;
  selectedIncludeAgeHeaderMethod: string;
  hashGenerator: string;
  cacheTypeId: string;
  hashGeneratorAttr: string;
  selectedScope: string;
  selectedImpType: string;
  description: string;
};
export function CacheMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [selectedCacheMImp, setSelectedCacheMImp] = useState<string>("Default");
  const [selectedCacheType, setSelectedCacheType] = useState<string>("FINDER");
  const [cacheTimeout, setCacheTimeout] = useState<string>("");
  const [maxMsgSize, setMaxMsgSize] = useState<string>("");
  const [maxEntryCount, setMaxEntryCount] = useState<string>("");
  const [selectedSequenceType, setSelectedSequenceType] =
    useState<string>("ANONYMOUS");
  const [sequenceKey, setSequenceKey] = useState<string>("");
  const [selectedCacheProtocolType, setSelectedCacheProtocolType] =
    useState<string>("HTTP");
  const [cacheProtocolMethods, setCacheProtocolMethods] = useState<string>("");
  const [headersToExcludeInHash, setHeadersToExcludeInHash] =
    useState<string>("");
  const [headersToIncludeInHash, setHeadersToIncludeInHash] =
    useState<string>("");
  const [responseCodes, setResponseCodes] = useState<string>("");
  const [
    selectedEnableCacheControlMethod,
    setSelectedEnableCacheControlMethod,
  ] = useState<string>("");
  const [selectedIncludeAgeHeaderMethod, setSelectedIncludeAgeHeaderMethod] =
    useState<string>("");
  const [hashGenerator, setHashGenerator] = useState<string>("");
  const [cacheTypeId, setCacheTypeId] = useState<string>("");
  const [hashGeneratorAttr, setHashGeneratorAttr] = useState<string>("");
  const [selectedScope, setSelectedScope] = useState<string>("Per_Host");
  const [selectedImpType, setSelectedImpType] = useState<string>("memory");
  const [description, setDescription] = useState<string>("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleCacheMImpSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCacheMImp(event.target.value);
  };
  const handleCacheTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCacheType(event.target.value);
  };
  const handleCacheTimeout = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCacheTimeout(event.target.value);
  };
  const handleMaxMsgSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxMsgSize(event.target.value);
  };
  const handleMaxEntryCount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxEntryCount(event.target.value);
  };
  const handleSequenceTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSequenceType(event.target.value);
  };
  const handleSequenceKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSequenceKey(event.target.value);
  };
  const handleCacheProtocolTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCacheProtocolType(event.target.value);
  };
  const handleCacheProtocolMethods = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCacheProtocolMethods(event.target.value);
  };
  const handleHeadersToExcludeInHash = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHeadersToExcludeInHash(event.target.value);
  };
  const handleHeadersToIncludeInHash = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHeadersToIncludeInHash(event.target.value);
  };
  const handleResponseCodes = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResponseCodes(event.target.value);
  };
  const handleEnableCacheControlMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedEnableCacheControlMethod(event.target.value);
  };
  const handleIncludeAgeHeaderMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedIncludeAgeHeaderMethod(event.target.value);
  };
  const handleHashGenerator = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHashGenerator(event.target.value);
  };
  const handleCacheTypeId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCacheTypeId(event.target.value);
  };
  const handleHashGeneratorAttr = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHashGeneratorAttr(event.target.value);
  };
  const handleScopeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedScope(event.target.value);
  };
  const handleImpTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedImpType(event.target.value);
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
    setSelectedCacheMImp("Default");
    setSelectedCacheType("FINDER");
    setCacheTimeout("");
    setMaxMsgSize("");
    setMaxEntryCount("");
    setSelectedSequenceType("ANONYMOUS");
    setSequenceKey("");
    setSelectedCacheProtocolType("HTTP");
    setCacheProtocolMethods("");
    setHeadersToExcludeInHash("");
    setHeadersToIncludeInHash("");
    setResponseCodes("");
    setSelectedEnableCacheControlMethod("");
    setSelectedIncludeAgeHeaderMethod("");
    setHashGenerator("");
    setCacheTypeId("");
    setHashGeneratorAttr("");
    setSelectedScope("Per_Host");
    setSelectedImpType("memory");
    setDescription("");
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          Cache Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Type</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="CacheMImp">
                Cache Mediator Implementation
              </Form.Label>
              <Form.Select
                value={selectedCacheMImp}
                onChange={handleCacheMImpSelectChange}
              >
                <option value="Default">Default</option>
                <option value="Compatible611">611 Compatible</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Row>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Properties</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="CacheType">Cache Type</Form.Label>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id="help-tooltip">
                    Finder: <br />
                    Is used to search for the request hash of incoming messages{" "}
                    <br /> <br />
                    Collector: <br /> Is used to collect the response messages
                    in the cacheS
                  </Tooltip>
                }
              >
                <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                  <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                </span>
              </OverlayTrigger>

              <Form.Select
                value={selectedCacheType}
                onChange={handleCacheTypeSelectChange}
              >
                <option value="FINDER">FINDER</option>
                <option value="COLLECTOR">COLLECTOR</option>
              </Form.Select>
              {selectedCacheMImp === "Default" &&
                selectedCacheType === "FINDER" && (
                  <>
                    <Form.Label className="CacheTimeout">
                      Cache Timeout&#40;S&#41;
                    </Form.Label>
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id="help-tooltip">
                          The time duration that the cache should be retained
                          specified in seconds. The cache expires once this time
                          duration elapses
                        </Tooltip>
                      }
                    >
                      <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                        <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                      </span>
                    </OverlayTrigger>
                    <Form.Control
                      type="text"
                      placeholder="120"
                      value={cacheTimeout}
                      onChange={handleCacheTimeout}
                    />
                    <Form.Label className="MaxMsgSize">
                      Max Message Size&#40;bytes&#41;
                    </Form.Label>
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id="help-tooltip">
                          The maximum size of the message to be cached. This
                          should be specified in bytes
                        </Tooltip>
                      }
                    >
                      <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                        <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                      </span>
                    </OverlayTrigger>
                    <Form.Control
                      type="text"
                      placeholder="2000"
                      value={maxMsgSize}
                      onChange={handleMaxMsgSize}
                    />
                    <br />
                    <Row className="mb-4">
                      <Modal.Title className="text-secondary">
                        Implementation
                      </Modal.Title>
                      <Form>
                        <Form.Group>
                          <Form.Label className="MaxEntryCount">
                            Max Entry Count
                          </Form.Label>
                          <OverlayTrigger
                            placement="right"
                            overlay={
                              <Tooltip id="help-tooltip">
                                The maximum number of element to be cached. The
                                default size is 1000
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
                            placeholder="1000"
                            value={maxEntryCount}
                            onChange={handleMaxEntryCount}
                          />
                        </Form.Group>
                      </Form>
                    </Row>
                    <br />
                    <Row className="mb-4">
                      <Modal.Title className="text-secondary">
                        On Case Hit
                      </Modal.Title>
                      <Form>
                        <Form.Group>
                          <Form.Label className="SequenceType">
                            Sequence Type
                          </Form.Label>
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
                                readOnly
                                value={sequenceKey}
                                onChange={handleSequenceKey}
                              />
                            </>
                          )}
                        </Form.Group>
                      </Form>
                    </Row>
                    <br />
                    <Row className="mb-4">
                      <Modal.Title className="text-secondary">
                        Protocol
                      </Modal.Title>
                      <Form>
                        <Form.Group>
                          <Form.Label className="CacheProtocolType">
                            Cache Protocol Type
                          </Form.Label>
                          <Form.Select
                            value={selectedCacheProtocolType}
                            onChange={handleCacheProtocolTypeSelectChange}
                          >
                            <option value="HTTP">HTTP</option>
                          </Form.Select>
                          <Form.Label className="CacheProtocolMethods">
                            Cache Protocol Methods
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="*"
                            value={cacheProtocolMethods}
                            onChange={handleCacheProtocolMethods}
                          />
                          <Form.Label className="HeadersToExcludeInHash">
                            Headers To Exclude In Hash
                          </Form.Label>
                          <OverlayTrigger
                            placement="right"
                            overlay={
                              <Tooltip id="help-tooltip">
                                A comma separated list of headers to ignore when
                                hashing an incoming messages. If you want to
                                exclude all headers when hashing an incoming
                                message, specify*
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
                            placeholder="eg: Headers To Exclude In Hash"
                            value={headersToExcludeInHash}
                            onChange={handleHeadersToExcludeInHash}
                          />
                          <Form.Label className="HeadersToExcludeInHash">
                            Headers To Include In Hash
                          </Form.Label>
                          <OverlayTrigger
                            placement="right"
                            overlay={
                              <Tooltip id="help-tooltip">
                                A comma separated list of headers to include
                                when hashing an incoming messages. If you want
                                to include all headers when hashing an incoming
                                message, specify*
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
                            placeholder="eg: Headers To Include In Hash"
                            value={headersToIncludeInHash}
                            onChange={handleHeadersToIncludeInHash}
                          />
                          <Form.Label className="ResponseCodes">
                            Response Codes
                          </Form.Label>
                          <OverlayTrigger
                            placement="right"
                            overlay={
                              <Tooltip id="help-tooltip">
                                Specify the response codes to be cached as a
                                regular expression. If the HTTP status code of a
                                response matches the regular expression, the
                                response should be cached. The default setting
                                to cache any response code
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
                            placeholder=".*"
                            value={responseCodes}
                            onChange={handleResponseCodes}
                          />
                          <br />
                          <Form.Group style={{ textAlign: "left" }}>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Form.Check
                                type="checkbox"
                                className="EnableCacheControl"
                                label={
                                  <span style={{ marginLeft: "10px" }}>
                                    Enable Cache Control
                                  </span>
                                }
                                checked={
                                  selectedEnableCacheControlMethod ===
                                  "EnableCacheControl"
                                }
                                value="EnableCacheControl"
                                onChange={handleEnableCacheControlMethodChange}
                              />
                              <OverlayTrigger
                                placement="right"
                                overlay={
                                  <Tooltip id="help-tooltip">
                                    Whether the Cache mediator should honor the
                                    Cache-Control header &#40;no-cache,
                                    no-store, max-age headers&#41;
                                  </Tooltip>
                                }
                              >
                                <span
                                  style={{
                                    marginLeft: "10px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faQuestionCircle}
                                    size="sm"
                                  />
                                </span>
                              </OverlayTrigger>
                            </div>
                          </Form.Group>
                          <Form.Group style={{ textAlign: "left" }}>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Form.Check
                                type="checkbox"
                                className="IncludeAgeHeader"
                                label={
                                  <span style={{ marginLeft: "10px" }}>
                                    Include Age Header
                                  </span>
                                }
                                checked={
                                  selectedIncludeAgeHeaderMethod ===
                                  "IncludeAgeHeader"
                                }
                                value="IncludeAgeHeader"
                                onChange={handleIncludeAgeHeaderMethodChange}
                              />
                              <OverlayTrigger
                                placement="right"
                                overlay={
                                  <Tooltip id="help-tooltip">
                                    Whether an Age header needs to be included
                                    when returning the cached response
                                  </Tooltip>
                                }
                              >
                                <span
                                  style={{
                                    marginLeft: "10px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faQuestionCircle}
                                    size="sm"
                                  />
                                </span>
                              </OverlayTrigger>
                            </div>
                            <br />
                          </Form.Group>
                          <Form.Label className="HashGenerator">
                            Hash Generator
                          </Form.Label>
                          <OverlayTrigger
                            placement="right"
                            overlay={
                              <Tooltip id="help-tooltip">
                                Used to define the logic used by the Cache
                                mediator to evaluate to evaluate the hash values
                                of incoming messages. The value specified here
                                should be a class that implement the
                                org.separated.carbon.mediator.cache.digest.DigestGenerator
                                class interface
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
                            defaultValue="org.wso2.carbon.mediator.cache.digest.HttpRequestHashGenerator"
                            value={hashGenerator}
                            onChange={handleHashGenerator}
                          />
                        </Form.Group>
                      </Form>
                    </Row>
                  </>
                )}
              {selectedCacheMImp === "Default" &&
                selectedCacheType === "COLLECTOR" && <></>}
              {selectedCacheMImp === "Compatible611" &&
                selectedCacheType === "FINDER" && (
                  <>
                    <Form.Label className="CacheTypeId">Id</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="eg: Id"
                      value={cacheTypeId}
                      onChange={handleCacheTypeId}
                    />
                    <Form.Label className="CacheTimeout">
                      Cache Timeout&#40;S&#41;
                    </Form.Label>
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id="help-tooltip">
                          The time duration that the cache should be retained
                          specified in seconds. The cache expires once this time
                          duration elapses
                        </Tooltip>
                      }
                    >
                      <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                        <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                      </span>
                    </OverlayTrigger>
                    <Form.Control
                      type="text"
                      placeholder="120"
                      value={cacheTimeout}
                      onChange={handleCacheTimeout}
                    />
                    <Form.Label className="MaxMsgSize">
                      Max Message Size&#40;bytes&#41;
                    </Form.Label>
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Tooltip id="help-tooltip">
                          The maximum size of the message to be cached. This
                          should be specified in bytes
                        </Tooltip>
                      }
                    >
                      <span style={{ marginLeft: "10px", cursor: "pointer" }}>
                        <FontAwesomeIcon icon={faQuestionCircle} size="sm" />
                      </span>
                    </OverlayTrigger>
                    <Form.Control
                      type="text"
                      placeholder="2000"
                      value={maxMsgSize}
                      onChange={handleMaxMsgSize}
                    />
                    <Form.Label className="Scope">Scope</Form.Label>
                    <Form.Select
                      value={selectedScope}
                      onChange={handleScopeSelectChange}
                    >
                      <option value="Per_Host">Per_Host</option>
                      <option value="Per_Mediator">Per_Mediator</option>
                    </Form.Select>
                    <Form.Label className="HashGeneratorAttr">
                      Hash Generator Attribute
                    </Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue="org.wso2.carbon.mediator.cache.digest.DOMHASHGenerator"
                      value={hashGeneratorAttr}
                      onChange={handleHashGeneratorAttr}
                    />
                    <Row className="mb-4">
                      <Modal.Title className="text-secondary">
                        Implementation
                      </Modal.Title>
                      <Form>
                        <Form.Group>
                          <Form.Label className="MaxEntryCount">
                            Max Entry Count
                          </Form.Label>
                          <OverlayTrigger
                            placement="right"
                            overlay={
                              <Tooltip id="help-tooltip">
                                The maximum number of element to be cached. The
                                default size is 1000
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
                            placeholder="1000"
                            value={maxEntryCount}
                            onChange={handleMaxEntryCount}
                          />
                          <Form.Label className="ImpType">
                            Implementation Type
                          </Form.Label>
                          <Form.Select
                            value={selectedImpType}
                            onChange={handleImpTypeSelectChange}
                          >
                            <option value="memory">memory</option>
                            <option value="disk">disk</option>
                          </Form.Select>
                        </Form.Group>
                      </Form>
                    </Row>
                    <br />
                    <Row className="mb-4">
                      <Modal.Title className="text-secondary">
                        On Case Hit
                      </Modal.Title>
                      <Form>
                        <Form.Group>
                          <Form.Label className="SequenceType">
                            Sequence Type
                          </Form.Label>
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
                                readOnly
                                value={sequenceKey}
                                onChange={handleSequenceKey}
                              />
                            </>
                          )}
                        </Form.Group>
                      </Form>
                    </Row>
                  </>
                )}
              {selectedCacheMImp === "Compatible611" &&
                selectedCacheType === "COLLECTOR" && (
                  <>
                    <Form.Label className="Scope">Scope</Form.Label>
                    <Form.Select
                      value={selectedScope}
                      onChange={handleScopeSelectChange}
                    >
                      <option value="Per_Host">Per_Host</option>
                      <option value="Per_Mediator">Per_Mediator</option>
                    </Form.Select>
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
