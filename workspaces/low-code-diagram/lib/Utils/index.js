import { jsx as _jsx } from "react/jsx-runtime";
// import {traversNode} from "@wso2-ei/syntax-tree";
import { InitVisitor } from "../Visitors/init-visitor";
import { SizingVisitor } from "../Visitors/sizing-visitor";
import { PositioningVisitor } from "../Visitors/positioning-visitor";
// import { Shape } from "../Shapes/types";
import * as ShapeComponents from '../Components/RenderingComponents';
export function sizingAndPositioning(st) {
    traverse(st, new InitVisitor());
    traverse(st, new SizingVisitor());
    traverse(st, new PositioningVisitor());
    const clone = Object.assign({}, st);
    return clone;
}
export function recalculateSizingAndPositioning(st) {
    traverse(st, new SizingVisitor());
    traverse(st, new PositioningVisitor());
    // if (STKindChecker.isFunctionDefinition(st) && st?.viewState?.onFail) {
    //     const viewState = st.viewState as FunctionViewState;
    //     traversNode(viewState.onFail, new SizingVisitor(experimentalEnabled));
    //     traversNode(viewState.onFail, new PositioningVisitor());
    // }
    const clone = Object.assign({}, st);
    return clone;
}
export function traverse(el, visitor) {
    let str2 = el.tag;
    if (el.tag !== undefined) {
        str2 = el.tag.charAt(0).toUpperCase() + el.tag.slice(1);
    }
    let beginFunction = visitor[`beginVisit${str2}`];
    if (!beginFunction) { // check if specific visitor exist for shape
        beginFunction = visitor.beginVisitSTNode; // asign the default visit function
    }
    if (beginFunction) {
        beginFunction.bind(visitor)(el);
    }
    const keys = Object.keys(el);
    keys.forEach((key) => {
        const childEl = el[key];
        if (Array.isArray(childEl)) { // if the child is a type of collection
            childEl.forEach(obj => {
                if (!obj.tag) {
                    return;
                }
                traverse(obj, visitor);
            });
        }
        if (!childEl.tag) {
            return;
        }
        traverse(childEl, visitor);
    });
    let endFunction = visitor[`endVisit${str2}`];
    if (!endFunction) { // check if specific visit function exist for the element type
        endFunction = visitor.endVisitSTNode;
    }
    if (endFunction) {
        endFunction.bind(visitor)(el);
    }
}
export function getSTComponent(node) {
    // const ChildComp = (stComponents as any)[node.kind];
    const ChildComp = ShapeComponents[node.tag];
    // if (!ChildComp) {
    //     return <Statement model={node} />;
    // }
    return _jsx(ChildComp, { model: node });
}
//# sourceMappingURL=index.js.map