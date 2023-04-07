var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from "react";
export const START_HOVER_SVG_WIDTH_WITH_SHADOW = 94;
export const START_HOVER_SVG_HEIGHT_WITH_SHADOW = 52;
export const START_SVG_WIDTH = 82;
export const START_SVG_HEIGHT = 40;
export function MediatorSVG(props) {
    const { text: startText } = props, xyProps = __rest(props, ["text"]);
    return (React.createElement("svg", Object.assign({}, xyProps, { width: START_HOVER_SVG_WIDTH_WITH_SHADOW, height: START_HOVER_SVG_HEIGHT_WITH_SHADOW }),
        React.createElement("defs", null,
            React.createElement("filter", { id: "StartFilterDefault", x: "0", y: "0", width: "94", height: "52", filterUnits: "userSpaceOnUse" },
                React.createElement("feOffset", { dy: "1", in: "SourceAlpha" }),
                React.createElement("feGaussianBlur", { stdDeviation: "2", result: "blur" }),
                React.createElement("feFlood", { "flood-color": "#a9acb6", "flood-opacity": "0.388" }),
                React.createElement("feComposite", { operator: "in", in2: "blur" }),
                React.createElement("feComposite", { in: "SourceGraphic" })),
            React.createElement("linearGradient", { id: "linear-gradient", x1: "0.5", x2: "0.5", y2: "1", gradientUnits: "objectBoundingBox" },
                React.createElement("stop", { offset: "0", "stop-color": "#fcfcfd" }),
                React.createElement("stop", { offset: "1", "stop-color": "#f7f8fb" }))),
        React.createElement("g", { id: "Start", className: "start-button" },
            React.createElement("g", null,
                React.createElement("g", { className: "start-button-rect", transform: "matrix(1, 0, 0, 1, -6, -5)", filter: "url(#StartFilterDefault)" },
                    React.createElement("rect", { id: "StartRectangle", width: START_SVG_WIDTH, height: START_SVG_HEIGHT, rx: "20", transform: "translate(6 5)", fill: "#dce1ff" })),
                React.createElement("g", { id: "Rectangle-4", className: "start-rect-fill" },
                    React.createElement("rect", { width: "82", height: "40", rx: "20", stroke: "none", fill: "#dce1ff" }),
                    React.createElement("rect", { x: "0.5", y: "0.5", width: "81", height: "39", rx: "19.5", fill: "none" }))),
            React.createElement("text", { id: "StartText", x: "42", y: "24", textAnchor: "middle", className: "start-text" },
                React.createElement("tspan", { className: "start-text" }, startText.length > 9 ? `${startText.substring(0, 7)}...` : startText)))));
}
//# sourceMappingURL=MediatorSVG.js.map