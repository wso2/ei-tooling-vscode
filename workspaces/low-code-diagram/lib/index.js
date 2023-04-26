import { jsx as _jsx } from "react/jsx-runtime";
import { Provider as DiagramContext } from "./Context/diagram";
import LowCodeDiagramRenderer from "./container";
export * from "./ViewState";
export * from "./Shapes";
export * from "./Utils";
export * from "./Context";
export * from "./Components/RenderingComponents/Mediator";
export function LowCodeDiagram(props) {
    return (_jsx(DiagramContext, Object.assign({}, props, { children: _jsx(LowCodeDiagramRenderer, {}) })));
}
//# sourceMappingURL=index.js.map