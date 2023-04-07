import {Mediator, Visitor} from "@wso2-ei/syntax-tree";
import { MediatorViewState } from "../ViewState";
import {COMPONENT_GAP} from "./sizing-visitor";

export class PositioningVisitor implements Visitor {

    beginVisitMediator(el: Mediator) {
        if (el.viewState) {
            const viewState: MediatorViewState = el.viewState as MediatorViewState;

            let height = viewState.bBox.y + COMPONENT_GAP;
            if (el.children === undefined) {
                return;
            }

            el.children.forEach((child, index) => {
                const childVS: MediatorViewState = child.viewState as MediatorViewState;

                // childVS.shapeName.y = height;
                // childVS.shapeName.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;

                childVS.bBox.x = viewState.bBox.x + viewState.bBox.w / 2 - childVS.bBox.w / 2;
                childVS.bBox.y = height;

                // set worker line positions
                switch (index) {
                    case 0:
                        viewState.workerLine.x1 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y1 = height;
                        break;
                    case el.children.length - 1:
                        viewState.workerLine.x2 = viewState.bBox.x + viewState.bBox.w / 2;
                        viewState.workerLine.y2 = height;
                        break;
                    default:
                }


                height += childVS.bBox.h + COMPONENT_GAP;
            })
        }
    }

}