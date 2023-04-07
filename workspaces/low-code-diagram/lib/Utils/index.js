import { traversNode } from "@wso2-ei/syntax-tree";
import { InitVisitor } from "../Visitors/init-visitor";
import { SizingVisitor } from "../Visitors/sizing-visitor";
import { PositioningVisitor } from "../Visitors/positioning-visitor";
export function sizingAndPositioning(st) {
    traversNode(st, new InitVisitor());
    traversNode(st, new SizingVisitor());
    traversNode(st, new PositioningVisitor());
    const clone = Object.assign({}, st);
    return clone;
}
export function recalculateSizingAndPositioning(st) {
    traversNode(st, new SizingVisitor());
    traversNode(st, new PositioningVisitor());
    // if (STKindChecker.isFunctionDefinition(st) && st?.viewState?.onFail) {
    //     const viewState = st.viewState as FunctionViewState;
    //     traversNode(viewState.onFail, new SizingVisitor(experimentalEnabled));
    //     traversNode(viewState.onFail, new PositioningVisitor());
    // }
    const clone = Object.assign({}, st);
    return clone;
}
//# sourceMappingURL=index.js.map