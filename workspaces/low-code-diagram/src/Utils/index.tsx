import {STNode, Visitor} from "@wso2-ei/syntax-tree";
// import {traversNode} from "@wso2-ei/syntax-tree";
import {InitVisitor} from "../Visitors/init-visitor";
import {SizingVisitor} from "../Visitors/sizing-visitor";
import {PositioningVisitor} from "../Visitors/positioning-visitor";
// import { Shape } from "../Shapes/types";

export function sizingAndPositioning(st: STNode): STNode {
    traverse(st, new InitVisitor());
    traverse(st, new SizingVisitor());
    traverse(st, new PositioningVisitor());
    const clone = { ...st };
    return clone;
}

export function recalculateSizingAndPositioning(st: STNode) {
    traverse(st, new SizingVisitor());
    traverse(st, new PositioningVisitor());
    // if (STKindChecker.isFunctionDefinition(st) && st?.viewState?.onFail) {
    //     const viewState = st.viewState as FunctionViewState;
    //     traversNode(viewState.onFail, new SizingVisitor(experimentalEnabled));
    //     traversNode(viewState.onFail, new PositioningVisitor());
    // }
    const clone = { ...st };
    return clone;
}

export function traverse(el: STNode, visitor: Visitor): void {
    let str2 = el.kind;
    if (el.kind !== undefined) {
        str2 = el.kind.charAt(0).toUpperCase() + el.kind.slice(1);
    }

    let beginFunction = (visitor as any)[`beginVisit${str2}`];

    if (!beginFunction) { // check if specific visitor exist for shape
        beginFunction = visitor.beginVisitSTNode; // asign the default visit function
    }

    if (beginFunction) {
        beginFunction.bind(visitor)(el);
    }

    const keys = Object.keys(el);

    keys.forEach((key: string) => {
        const childEl: any = (el as any)[key];

        if (Array.isArray(childEl)) { // if the child is a type of collection
            childEl.forEach(obj => { // visit collection children
                if (!obj.kind) {
                    return;
                }

                traverse(obj, visitor);
            });
        }

        if (!childEl.kind) {
            return;
        }

        traverse(childEl, visitor);
    });


    let endFunction = (visitor as any)[`endVisit${str2}`];

    if (!endFunction) { // check if specific visit function exist for the element type
        endFunction = visitor.endVisitSTNode;
    }

    if (endFunction) {
        endFunction.bind(visitor)(el);
    }
}

