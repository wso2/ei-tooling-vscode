import { vscode } from "./utilities/vscode";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import "./App.css";

function App() {
  function resourcesPanel() {
    vscode.postMessage(
      {
        command: "resources",
        text: "This is resources panel",
      }
    );
  }



  return (
    <main>
      <h1>Hello World!</h1>
      <VSCodeButton onClick={resourcesPanel}>Resources</VSCodeButton>
    </main>
  );
}

export default App;
