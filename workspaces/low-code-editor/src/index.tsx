import React, {createElement} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider as DiagramProvider } from "./Contexts/diagram";
import { LowCodeEditorProps as Props } from "./Types";
import DiagramContainer from "./Diagram/Container";
import {Diagram, EditorProps} from "./DiagramGenerator/vscode/Diagram";
import {render} from "react-dom";
export * from "./DiagramGenerator/vscode";

const LowCodeEditor: React.FC<Props> = (props: Props) => {

    const newProps = {
        ...props
    }

    console.log("inside LowCodeEditor");

    return (
        <DiagramProvider {...newProps} >
            <div className="diagram-container">
                <DiagramContainer />
            </div>
        </DiagramProvider>
    );
}

export default LowCodeEditor;
