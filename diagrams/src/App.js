import "./App.css";
import "reactjs-popup/dist/index.css";
import MediatorButton from "./Components/MediatorButton";
import LogMediator from "./Components/LogMediator";
import CallMediator from "./Components/CallMediator";
import DropMediator from "./Components/DropMediator";
import PropertyMediator from "./Components/PropertyMediator";
import { useState } from "react";


function App() {
  const JSONPretty = require("react-json-pretty");
  const theme = require("react-json-pretty/dist/monikai");
  const [apiState, setApiState] = useState({
    api: {
      resource: {
        inSequence: {},
        outSequence: "",
        faultSequence: "",
      },
    },
  });

  return (
    <div className="ContentArea">
      <div className="DraggingArea">
        {/* <button
          className="codeBtn"
          onClick={() => {
            vscode.window.showTextDocument(document, {
              viewColumn: vscode.ViewColumn.Beside,
            });
          }}
        >
          code
        </button> */}

        <MediatorButton
          onLogClick={() => {
            const nextApiInSequence = {
              ...apiState.api.resource.inSequence,
              log: "",
            };
            const nextResource = {
              ...apiState.api.resource,
              inSequence: nextApiInSequence,
            };
            const nextApi = { ...apiState.api, resource: nextResource };
            const nextApiState = { ...apiState, api: nextApi };
            setApiState(nextApiState);
          }}
          onCallClick={() => {
            const nextApiInSequence = {
              ...apiState.api.resource.inSequence,
              call: "",
            };
            const nextResource = {
              ...apiState.api.resource,
              inSequence: nextApiInSequence,
            };
            const nextApi = { ...apiState.api, resource: nextResource };
            const nextApiState = { ...apiState, api: nextApi };
            setApiState(nextApiState);
          }}
          onDropClick={() => {
            const nextApiInSequence = {
              ...apiState.api.resource.inSequence,
              drop: "",
            };
            const nextResource = {
              ...apiState.api.resource,
              inSequence: nextApiInSequence,
            };
            const nextApi = { ...apiState.api, resource: nextResource };
            const nextApiState = { ...apiState, api: nextApi };
            setApiState(nextApiState);
          }}
          onPropertyClick={() => {
            const nextApiInSequence = {
              ...apiState.api.resource.inSequence,
              property: "",
            };
            const nextResource = {
              ...apiState.api.resource,
              inSequence: nextApiInSequence,
            };
            const nextApi = { ...apiState.api, resource: nextResource };
            const nextApiState = { ...apiState, api: nextApi };
            setApiState(nextApiState);
          }}
        />

        {typeof apiState.api.resource.inSequence.log != "undefined" ? (
          <LogMediator />
        ) : typeof apiState.api.resource.inSequence.call != "undefined" ? (
          <CallMediator />
        ) : typeof apiState.api.resource.inSequence.drop != "undefined" ? (
          <DropMediator />
        ) : typeof apiState.api.resource.inSequence.property != "undefined" ? (
          <PropertyMediator />
        ) : null}
      </div>

      <div className="CodeTextArea">
        <JSONPretty
          className="json-display"
          id="json-pretty"
          data={JSON.stringify(apiState)}
          theme={theme}
        ></JSONPretty>
      </div>
    </div>
  );
}

export default App;
