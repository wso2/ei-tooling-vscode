import React from "react";
import {STNode} from "@wso2-ei/syntax-tree";
import {MediatorSVG, START_SVG_HEIGHT, START_SVG_WIDTH} from "./MediatorSVG";

export interface MediatorProps {
    model: STNode;
}

export function STNode(props: MediatorProps) {
    // const diagramContext = useContext(Context);
    // const { isReadOnly } = diagramContext.props;

    const { model } = props;
    const viewState = model.viewState;
    const cx = viewState.trigger.cx;
    const cy = viewState.trigger.cy;

    return (
        // hide edit button for triggers and expression bodied functions
        <g className="mediator-wrapper">
            <MediatorSVG
                x={cx - (START_SVG_WIDTH / 2)}
                y={cy - (START_SVG_HEIGHT / 2)}
                text="START"
            />
            {/*{block && initPlusAvailable && !isReadOnly && <PlusButton viewState={plusView} model={block} initPlus={true} />}*/}
        </g>
    );
}

export * from "./MediatorSVG";