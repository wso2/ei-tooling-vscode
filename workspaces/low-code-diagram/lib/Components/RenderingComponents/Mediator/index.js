import { jsx as _jsx } from "react/jsx-runtime";
import { MediatorSVG, START_SVG_HEIGHT, START_SVG_WIDTH } from "./MediatorSVG";
export function STNode(props) {
    // const diagramContext = useContext(Context);
    // const { isReadOnly } = diagramContext.props;
    const { model } = props;
    const viewState = model.viewState;
    const cx = viewState.trigger.cx;
    const cy = viewState.trigger.cy;
    return (
    // hide edit button for triggers and expression bodied functions
    _jsx("g", Object.assign({ className: "mediator-wrapper" }, { children: _jsx(MediatorSVG, { x: cx - (START_SVG_WIDTH / 2), y: cy - (START_SVG_HEIGHT / 2), text: "START" }) })));
}
export * from "./MediatorSVG";
//# sourceMappingURL=index.js.map