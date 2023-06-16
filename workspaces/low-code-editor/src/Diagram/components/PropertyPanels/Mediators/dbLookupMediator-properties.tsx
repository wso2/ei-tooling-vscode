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
  // langClient: DiagramEditorLangClientInterface;
  textDocumentUrl: string;
  textDocumentFsPath: string;
  previousComponentStartPosition: number;
  textEdit?: TextEdit;
};
type State = {
  selectedConnectionType: string;
  selectedConnectionDbType: string;
  isRegBasedDriverConfig: boolean;
  selectedRegBDriConfigKey: string;
  connectionDbDriver: string;
  selectedConnectionDsType: string;
  connectionDsName: string;
  connectionDsInitialContext: string;
  isRegBasedUrlConfig: boolean;
  regBUrlConfigKey: string;
  connectionURL: string;
  isRegBasedUserConfig: boolean;
  regBUserConfigKey: string;
  connectionUserName: string;
  isRegBasedPassConfig: boolean;
  regBPassConfigKey: string;
  connectionPassword: string;
  selectedProAutocommit: string;
  selectedProIsolation: string;
  propertyMaxactive: string;
  propertyMaxidle: string;
  propertyMaxopenstatements: string;
  propertyMaxwait: string;
  propertyMinidle: string;
  selectedProPoolstatements: string;
  selectedProTestonborrow: string;
  selectedProTestwhileidle: string;
  propertyValidationquery: string;
  propertyInitialsize: string;
  sqlStatement: string;
  description: string;
};
export function DBLookupMediatorProperty(props: Props) {
  const {
    textDocumentUrl,
    textDocumentFsPath,
    previousComponentStartPosition,
    textEdit,
  } = props;
  const [selectedConnectionType, setSelectedConnectionType] =
    useState("DB_CONNECTION");
  const [selectedConnectionDbType, setSelectedConnectionDbType] =
    useState("OTHER");
  const [isRegBasedDriverConfig, setIsRegBasedDriverConfig] = useState(false);
  const [selectedRegBDriConfigKey, setSelectedRegBDriConfigKey] = useState("");
  const [connectionDbDriver, setConnectionDbDriver] = useState("");
  const [selectedConnectionDsType, setSelectedConnectionDsType] =
    useState("EXTERNAL");
  const [connectionDsName, setConnectionDsName] = useState("");
  const [connectionDsInitialContext, setConnectionDsInitialContext] =
    useState("");
  const [isRegBasedUrlConfig, setIsRegBasedUrlConfig] = useState(false);
  const [regBUrlConfigKey, setRegBUrlConfigKey] = useState("");
  const [connectionURL, setConnectionURL] = useState("");
  const [isRegBasedUserConfig, setIsRegBasedUserConfig] = useState(false);
  const [regBUserConfigKey, setRegBUserConfigKey] = useState("");
  const [connectionUserName, setConnectionUserName] = useState("");
  const [isRegBasedPassConfig, setIsRegBasedPassConfig] = useState(false);
  const [regBPassConfigKey, setRegBPassConfigKey] = useState("");
  const [connectionPassword, setConnectionPassword] = useState("");
  const [selectedProAutocommit, setSelectedProAutocommit] = useState("DEFAULT");
  const [selectedProIsolation, setSelectedProIsolation] = useState("Action1");
  const [propertyMaxactive, setPropertyMaxactive] = useState("");
  const [propertyMaxidle, setPropertyMaxidle] = useState("");
  const [propertyMaxopenstatements, setPropertyMaxopenstatements] =
    useState("");
  const [propertyMaxwait, setPropertyMaxwait] = useState("");
  const [propertyMinidle, setPropertyMinidle] = useState("");
  const [selectedProPoolstatements, setSelectedProPoolstatements] =
    useState("DEFAULT");
  const [selectedProTestonborrow, setSelectedProTestonborrow] =
    useState("DEFAULT");
  const [selectedProTestwhileidle, setSelectedProTestwhileidle] =
    useState("DEFAULT");
  const [propertyValidationquery, setPropertyValidationquery] = useState("");
  const [propertyInitialsize, setPropertyInitialsize] = useState("");
  const [sqlStatement, setSQLStatement] = useState("");
  const [description, setDescription] = useState("");
  const {
    api: {
      ls: { getDiagramEditorLangClient },
    },
  } = useContext(DiagramContext);
  const handleConnectionTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedConnectionType(event.target.value);
  };
  const handleConnectionDbTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedConnectionDbType(event.target.value);
  };
  //DB_CONNECTION "Is Registry Based Driver Config" checkbox
  const handleRegBDriConfigCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsRegBasedDriverConfig(event.target.checked);
  };
  const handleRegBDriConfigKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedRegBDriConfigKey(event.target.value);
  };
  //DB_CONNECTION "Connection Db Driver" default value change by Connection Db Type selection
  const handleConnectionDbDriverChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConnectionDbDriver(event.target.value);
  };
  const handleConnectionDsTypeSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedConnectionDsType(event.target.value);
  };
  const handleConnectionDsName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConnectionDsName(event.target.value);
  };
  const handleConnectionDsInitialContext = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConnectionDsInitialContext(event.target.value);
  };
  //DB_CONNECTION "Is Registry Based Url Config" checkbox
  const handleRegBUrlConfigCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsRegBasedUrlConfig(event.target.checked);
  };
  const handleRegBUrlConfigKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegBUrlConfigKey(event.target.value);
  };
  //DB_CONNECTION "Connection Db Url" default value change by Connection Db Type selection
  const handleConnectionUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConnectionURL(event.target.value);
  };
  //DB_CONNECTION "Is Registry Based User Config" checkbox
  const handleRegBUserConfigCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsRegBasedUserConfig(event.target.checked);
  };
  const handleRegBUserConfigKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegBUserConfigKey(event.target.value);
  };
  //DB_CONNECTION "Connection Db Username" default value change by Connection Db Type selection
  const handleConnectionUserNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConnectionUserName(event.target.value);
  };
  //DB_CONNECTION "Is Registry Based Password Config" checkbox
  const handleRegBPassConfigCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsRegBasedPassConfig(event.target.checked);
  };
  const handleRegBPassConfigKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegBPassConfigKey(event.target.value);
  };
  const handleConnectionPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConnectionPassword(event.target.value);
  };
  const handleProAutocommitSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProAutocommit(event.target.value);
  };
  const handleProIsolationSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProIsolation(event.target.value);
  };
  const handlePropertyMaxactive = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPropertyMaxactive(event.target.value);
  };
  const handlePropertyMaxidle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPropertyMaxidle(event.target.value);
  };
  const handlePropertyMaxopenstatements = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPropertyMaxopenstatements(event.target.value);
  };
  const handlePropertyMaxwait = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPropertyMaxwait(event.target.value);
  };
  const handlePropertyMinidle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPropertyMinidle(event.target.value);
  };
  const handleProPoolstatementsSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProPoolstatements(event.target.value);
  };
  const handleProTestonborrowSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProTestonborrow(event.target.value);
  };
  const handleProTestwhileidleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProTestwhileidle(event.target.value);
  };
  const handlePropertyValidationquery = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPropertyValidationquery(event.target.value);
  };
  const handlePropertyInitialsize = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPropertyInitialsize(event.target.value);
  };
  const handleSQLStatement = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSQLStatement(event.target.value);
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
        selectedConnectionType,
        selectedConnectionDbType,
        selectedRegBDriConfigKey,
        connectionDbDriver,
        // selectedConnectionDsType,
        // connectionDsName,
        // connectionDsInitialContext,
        // regBUrlConfigKey,
        // connectionURL,
        // regBUserConfigKey,
        // connectionUserName,
        // regBPassConfigKey,
        // connectionPassword,
        // selectedProAutocommit,
        // selectedProIsolation,
        // propertyMaxactive,
        // propertyMaxidle,
        // propertyMaxopenstatements,
        // propertyMaxwait,
        // propertyMinidle,
        // selectedProPoolstatements,
        // selectedProTestonborrow,
        // selectedProTestwhileidle,
        // propertyValidationquery,
        // propertyInitialsize,
        // sqlStatement,
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
  const handleCancelClick = () => {
    setSelectedConnectionType("DB_CONNECTION");
    setSelectedConnectionDbType("OTHER");
    setIsRegBasedDriverConfig(false);
    setSelectedRegBDriConfigKey("");
    setConnectionDbDriver("");
    setSelectedConnectionDsType("EXTERNAL");
    setConnectionDsName("");
    setConnectionDsInitialContext("");
    setIsRegBasedUrlConfig(false);
    setRegBUrlConfigKey("");
    setConnectionURL("");
    setIsRegBasedUserConfig(false);
    setRegBUserConfigKey("");
    setConnectionUserName("");
    setIsRegBasedPassConfig(false);
    setRegBPassConfigKey("");
    setConnectionPassword("");
    setSelectedProAutocommit("DEFAULT");
    setSelectedProIsolation("Action1");
    setPropertyMaxactive("");
    setPropertyMaxidle("");
    setPropertyMaxopenstatements("");
    setPropertyMaxwait("");
    setPropertyMinidle("");
    setSelectedProPoolstatements("DEFAULT");
    setSelectedProTestonborrow("DEFAULT");
    setSelectedProTestwhileidle("DEFAULT");
    setPropertyValidationquery("");
    setPropertyInitialsize("");
    setSQLStatement("");
    setDescription("");
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title className="text-primary">
          DB Lookup Mediator Property
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Connection</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="ConnectionType">ConnectionType</Form.Label>
              <Form.Select
                value={selectedConnectionType}
                onChange={handleConnectionTypeSelectChange}
              >
                <option value="DB_CONNECTION">DB_CONNECTION</option>
                <option value="DATA_SOURCE">DATA_SOURCE</option>
              </Form.Select>
              {selectedConnectionType === "DB_CONNECTION" && (
                <>
                  <Form.Label className="DatabaseConfiguration">
                    Database Configuration
                  </Form.Label>
                  {/* When a user clicks this textbox, Database Configuration Model appears*/}
                  <Form.Control type="text" readOnly />
                  <Form.Label className="ConnectionDbType">
                    Connection Db Type
                  </Form.Label>
                  <Form.Select
                    value={selectedConnectionDbType}
                    onChange={handleConnectionDbTypeSelectChange}
                  >
                    <option value="OTHER">OTHER</option>
                    <option value="MYSQL">MYSQL</option>
                    <option value="ORACLE">ORACLE</option>
                    <option value="MSSQL">MSSQL</option>
                    <option value="POSTGRESQL">POSTGRESQL</option>
                  </Form.Select>
                  <br />
                  <Form.Check
                    type="checkbox"
                    className="RegBasedDriverConfig"
                    style={{ display: "flex", alignItems: "center" }}
                    label={
                      <span style={{ marginLeft: "10px" }}>
                        Is Registry Based Driver Config
                      </span>
                    }
                    onChange={handleRegBDriConfigCheckboxChange}
                  />
                  {isRegBasedDriverConfig ? (
                    <>
                      <Form.Label className="RegBDriConfigKey">
                        Registry Based Driver Config Key
                      </Form.Label>
                      {/* When a user clicks this textbox, the Resource KeyModel appears.*/}
                      <Form.Control
                        type="text"
                        readOnly
                        value={selectedRegBDriConfigKey}
                        onChange={handleRegBDriConfigKey}
                      />
                    </>
                  ) : (
                    <>
                      <Form.Label className="ConnectionDbDriver">
                        Connection Db Driver
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={
                          selectedConnectionDbType === "MYSQL"
                            ? "com.mysql.jdbc.Driver"
                            : selectedConnectionDbType === "ORACLE"
                            ? "oracle.jdbc.driver.OracleDriver"
                            : selectedConnectionDbType === "MSSQL"
                            ? "com.microsoft.sqlserver.jdbc.SQLServerDriver"
                            : selectedConnectionDbType === "POSTGRESQL"
                            ? "jdbc:postgresql://localhost:5432/<dbName>"
                            : "eg: Connection Db Driver"
                        }
                        value={connectionDbDriver}
                        onChange={handleConnectionDbDriverChange}
                      />
                    </>
                  )}
                </>
              )}
              {selectedConnectionType === "DATA_SOURCE" && (
                <>
                  <Form.Label className="ConnectionDsType">
                    Connection Ds Type
                  </Form.Label>
                  <Form.Select
                    value={selectedConnectionDsType}
                    onChange={handleConnectionDsTypeSelectChange}
                  >
                    <option value="EXTERNAL">EXTERNAL</option>
                    <option value="CARBON">CARBON</option>
                  </Form.Select>
                  <Form.Label className="ConnectionDsName">
                    Connection Ds Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="eg: Connection Ds Name"
                    value={connectionDsName}
                    onChange={handleConnectionDsName}
                  />
                  {selectedConnectionDsType === "EXTERNAL" && (
                    <>
                      <Form.Label className="ConnectionDsInitialContext">
                        Connection Ds Initial Context
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="eg: Connection Ds Initial Context"
                        value={connectionDsInitialContext}
                        onChange={handleConnectionDsInitialContext}
                      />
                    </>
                  )}
                </>
              )}
              {(selectedConnectionDsType !== "CARBON" ||
                selectedConnectionType === "DB_CONNECTION") && (
                <>
                  <br />
                  <Form.Check
                    type="checkbox"
                    className="RegBasedUrlConfig"
                    style={{ display: "flex", alignItems: "center" }}
                    label={
                      <span style={{ marginLeft: "10px" }}>
                        Is Registry Based Url Config
                      </span>
                    }
                    onChange={handleRegBUrlConfigCheckboxChange}
                  />
                  {isRegBasedUrlConfig ? (
                    <>
                      <Form.Label className="RegBUrlConfigKey">
                        Registry Based Url Config Key
                      </Form.Label>
                      {/* When a user clicks this textbox, the Resource KeyModel appears.*/}
                      <Form.Control
                        type="text"
                        readOnly
                        value={regBUrlConfigKey}
                        onChange={handleRegBUrlConfigKey}
                      />
                    </>
                  ) : (
                    <>
                      <Form.Label className="ConnectionURL">
                        Connection URL
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={
                          selectedConnectionType === "DB_CONNECTION" &&
                          selectedConnectionDbType === "MYSQL"
                            ? "jdbc:mysql://localhost:3306/<dbName>"
                            : selectedConnectionType === "DB_CONNECTION" &&
                              selectedConnectionDbType === "ORACLE"
                            ? "jdbc:oracle:thin:@SERVER_NAME:PORT/SID"
                            : selectedConnectionType === "DB_CONNECTION" &&
                              selectedConnectionDbType === "MSSQL"
                            ? "jdbc:sqlserver://<IP>:1433=databaseName=<dbName>=SendStringParametersAsUnicode=false"
                            : selectedConnectionType === "DB_CONNECTION" &&
                              selectedConnectionDbType === "POSTGRESQL"
                            ? "jdbc:postgresql://localhost:5432/<dbName>"
                            : "eg: Connection URL"
                        }
                        value={connectionURL}
                        onChange={handleConnectionUrlChange}
                      />
                    </>
                  )}
                  <br />
                  <Form.Check
                    type="checkbox"
                    className="RegBasedUserConfig"
                    style={{ display: "flex", alignItems: "center" }}
                    label={
                      <span style={{ marginLeft: "10px" }}>
                        Is Registry Based User Config
                      </span>
                    }
                    onChange={handleRegBUserConfigCheckboxChange}
                  />
                  {isRegBasedUserConfig ? (
                    <>
                      <Form.Label className="RegBUserConfigKey">
                        Registry Based User Config Key
                      </Form.Label>
                      {/* When a user clicks this textbox, the Resource KeyModel appears.*/}
                      <Form.Control
                        type="text"
                        readOnly
                        value={regBUserConfigKey}
                        onChange={handleRegBUserConfigKey}
                      />
                    </>
                  ) : (
                    <>
                      <Form.Label className="ConnectionUserName">
                        Connection Username
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={
                          selectedConnectionType === "DB_CONNECTION" &&
                          selectedConnectionDbType === "MYSQL"
                            ? "root"
                            : selectedConnectionType === "DB_CONNECTION" &&
                              selectedConnectionDbType === "ORACLE"
                            ? "oracle"
                            : selectedConnectionType === "DB_CONNECTION" &&
                              selectedConnectionDbType === "MSSQL"
                            ? "sa"
                            : selectedConnectionType === "DB_CONNECTION" &&
                              selectedConnectionDbType === "POSTGRESQL"
                            ? "root"
                            : "eg: Connection Username"
                        }
                        value={connectionUserName}
                        onChange={handleConnectionUserNameChange}
                      />
                    </>
                  )}
                  <br />
                  <Form.Check
                    type="checkbox"
                    className="RegBasedPassConfig"
                    style={{ display: "flex", alignItems: "center" }}
                    label={
                      <span style={{ marginLeft: "10px" }}>
                        Is Registry Based Password Config
                      </span>
                    }
                    onChange={handleRegBPassConfigCheckboxChange}
                  />
                  {isRegBasedPassConfig ? (
                    <>
                      <Form.Label className="RegBPassConfigKey">
                        Registry Based Password Config Key
                      </Form.Label>
                      {/* When a user clicks this textbox, the Resource KeyModel appears.*/}
                      <Form.Control
                        type="text"
                        readOnly
                        value={regBPassConfigKey}
                        onChange={handleRegBPassConfigKey}
                      />
                    </>
                  ) : (
                    <>
                      <Form.Label className="ConnectionPassword">
                        Connection Password
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="eg: Connection Password"
                        value={connectionPassword}
                        onChange={handleConnectionPasswordChange}
                      />
                    </>
                  )}
                  <br />
                  <Row className="mb-4">
                    <Modal.Title className="text-secondary">
                      Properties
                    </Modal.Title>
                    <Form>
                      <Form.Group>
                        <Form.Label className="PropertyAutocommit">
                          Property Autocommit
                        </Form.Label>
                        <Form.Select
                          value={selectedProAutocommit}
                          onChange={handleProAutocommitSelectChange}
                        >
                          <option value="DEFAULT">DEFAULT</option>
                          <option value="TRUE">TRUE</option>
                          <option value="FALSE">FALSE</option>
                        </Form.Select>
                        <Form.Label className="PropertyIsolation">
                          Property Isolation
                        </Form.Label>
                        <Form.Select
                          value={selectedProIsolation}
                          onChange={handleProIsolationSelectChange}
                        >
                          <option value="Action1">DEFAULT</option>
                          <option value="Action2">
                            Connection.TRANSACTION_NONE
                          </option>
                          <option value="Action3">
                            Connection.TRANSACTION_READ_COMMITTED
                          </option>
                          <option value="Action4">
                            Connection.TRANSACTION_READ_UNCOMMITTED
                          </option>
                          <option value="Action5">
                            Connection.TRANSACTION_REPEATABLE_READ
                          </option>
                          <option value="Action6">
                            Connection.TRANSACTION_SERIALIZABLE
                          </option>
                        </Form.Select>
                        <Form.Label className="PropertyMaxactive">
                          Property Maxactive
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="-1"
                          value={propertyMaxactive}
                          onChange={handlePropertyMaxactive}
                        />
                        <Form.Label className="PropertyMaxidle">
                          Property Maxidle
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="-1"
                          value={propertyMaxidle}
                          onChange={handlePropertyMaxidle}
                        />
                        <Form.Label className="PropertyMaxopenstatements">
                          Property Maxopenstatements
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="-1"
                          value={propertyMaxopenstatements}
                          onChange={handlePropertyMaxopenstatements}
                        />
                        <Form.Label className="PropertyMaxwait">
                          Property Maxwait
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="-1"
                          value={propertyMaxwait}
                          onChange={handlePropertyMaxwait}
                        />
                        <Form.Label className="PropertyMinidle">
                          Property Minidle
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="-1"
                          value={propertyMinidle}
                          onChange={handlePropertyMinidle}
                        />
                        <Form.Label className="PropertyPoolstatements">
                          Property Poolstatements
                        </Form.Label>
                        <Form.Select
                          value={selectedProPoolstatements}
                          onChange={handleProPoolstatementsSelectChange}
                        >
                          <option value="DEFAULT">DEFAULT</option>
                          <option value="TRUE">TRUE</option>
                          <option value="FALSE">FALSE</option>
                        </Form.Select>
                        <Form.Label className="PropertyTestonborrow">
                          Property Testonborrow
                        </Form.Label>
                        <Form.Select
                          value={selectedProTestonborrow}
                          onChange={handleProTestonborrowSelectChange}
                        >
                          <option value="DEFAULT">DEFAULT</option>
                          <option value="TRUE">TRUE</option>
                          <option value="FALSE">FALSE</option>
                        </Form.Select>
                        <Form.Label className="PropertyTestwhileidle">
                          Property Testwhileidle
                        </Form.Label>
                        <Form.Select
                          value={selectedProTestwhileidle}
                          onChange={handleProTestwhileidleSelectChange}
                        >
                          <option value="DEFAULT">DEFAULT</option>
                          <option value="TRUE">TRUE</option>
                          <option value="FALSE">FALSE</option>
                        </Form.Select>
                        <Form.Label className="PropertyValidationquery">
                          Property Validationquery
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="eg: Property Validationquery"
                          value={propertyValidationquery}
                          onChange={handlePropertyValidationquery}
                        />
                        <Form.Label className="PropertyInitialsize">
                          Property Initialsize
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="-1"
                          value={propertyInitialsize}
                          onChange={handlePropertyInitialsize}
                        />
                      </Form.Group>
                    </Form>
                  </Row>
                </>
              )}
            </Form.Group>
          </Form>
        </Row>
        <br />
        <Row className="mb-4">
          <Modal.Title className="text-secondary">Statements</Modal.Title>
          <Form>
            <Form.Group>
              <Form.Label className="SQLStatement">SQLStatement</Form.Label>
              {/* When a user clicks this textbox, the SQLStatement Model appears.*/}
              <Form.Control
                as="textarea"
                style={{ minHeight: "200px" }}
                readOnly
                value={sqlStatement}
                onChange={handleSQLStatement}
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
