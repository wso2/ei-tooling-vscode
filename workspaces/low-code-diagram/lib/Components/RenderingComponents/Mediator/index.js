import React from "react";
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
    React.createElement("g", { className: "mediator-wrapper" },
        React.createElement(MediatorSVG, { x: cx - (START_SVG_WIDTH / 2), y: cy - (START_SVG_HEIGHT / 2), text: "START" })));
}
//# sourceMappingURL=index.js.map