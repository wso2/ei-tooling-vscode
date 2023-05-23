import React from "react";
import { getComponent } from "../../util";
import { WorkerLine } from "../worker-line";
import { Circle, Square } from "@wso2-ei/low-code-diagram";

interface SquareProps {
    model: Square;
}

export function OutSequence(props: SquareProps) {
    const { model } = props;

    const viewState = model.viewState;

    const components: JSX.Element[] = [];

    model.children.forEach(child => {
        components.push(getComponent(child.tag, { model: child }));
    })

    return (
        <>
            <svg>
                <rect
                    x={viewState.bBox.x}
                    y={viewState.bBox.y}
                    width={viewState.bBox.w}
                    height={viewState.bBox.h}
                    fill='#fff'
                    stroke="#fff"
                    stroke-width="4"
                />
            </svg>

            <WorkerLine
                model={model}
            />
            {components}

        </>
    )
}