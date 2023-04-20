import { createElement } from "react";
import { render } from "react-dom";

import { Diagram, EditorProps } from "./Diagram";
// import {debug} from "util";

export function renderDiagramEditor(options: { target: HTMLElement, editorProps: EditorProps }) {
    const start = new Date().getTime();
    // consoleLog(start, 'renderDiagramEditor');
    console.log("inside renderDiagramEditor");
    const DiagramElement = createElement(Diagram, options.editorProps);
    return render(DiagramElement, options.target);
}

/*function consoleLog(start: number, fnName: string) {
    const end = new Date().getTime();
    debug(`Backend - Time taken for ${fnName}: ${end - start}ms`);
}*/

// export function renderOverviewDiagram(options: {
//     target: HTMLElement,
//     editorProps: EditorProps
// }) {
//     const DiagramElement = createElement(WorkspaceOverview, options.editorProps);
//     return render(DiagramElement, options.target);
// }
