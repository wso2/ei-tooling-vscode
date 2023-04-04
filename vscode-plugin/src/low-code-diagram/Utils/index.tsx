import {STNode} from "../../syntax-tree/syntax-tree-interfaces";
import {traversNode} from "../../syntax-tree/ast-utils";
import {InitVisitor} from "../Visitors/init-visitor";
import {SizingVisitor} from "../Visitors/sizing-visitor";
import {PositioningVisitor} from "../Visitors/positioning-visitor";

export function sizingAndPositioning(st: STNode, experimentalEnabled?: boolean): STNode {
    traversNode(st, new InitVisitor());
    traversNode(st, new SizingVisitor());
    traversNode(st, new PositioningVisitor());
    const clone = { ...st };
    return clone;
}

export function recalculateSizingAndPositioning(
    st: STNode, experimentalEnabled?: boolean, parentConnectors?: Map<string, Endpoint>
): STNode {
    traversNode(st, new SizingVisitor(experimentalEnabled, parentConnectors));
    traversNode(st, new PositioningVisitor());
    if (STKindChecker.isFunctionDefinition(st) && st?.viewState?.onFail) {
        const viewState = st.viewState as FunctionViewState;
        traversNode(viewState.onFail, new SizingVisitor(experimentalEnabled));
        traversNode(viewState.onFail, new PositioningVisitor());
    }
    const clone = { ...st };
    return clone;
}
