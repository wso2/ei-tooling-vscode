import React from "react";
import { getComponent } from "../../util";
import { WorkerLine } from "../worker-line";
import { Square } from "@wso2-ei/low-code-diagram";

interface SquareProps {
    model: Square;
}

export function ApiComponent(props: SquareProps) {
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
                    x={viewState.bBox.x - 75}
                    y={viewState.bBox.y - 15}
                    width={viewState.bBox.r * 0.83}
                    height={viewState.bBox.r * 0.14}
                    rx="15"
                    fill="#D9D9D9"
                />
                <line
                    id="Line 1"
                    x1={viewState.bBox.x - 74}
                    y1={viewState.bBox.y - 11}
                    x2={viewState.bBox.x + viewState.bBox.w + 74}
                    y2={viewState.bBox.y - 11}
                    stroke="black"
                    stroke-width="10"
                />
                <line
                    id="Line 2"
                    x1={viewState.bBox.x - 74}
                    y1={viewState.bBox.y + viewState.bBox.h + 11}
                    x2={viewState.bBox.x + viewState.bBox.w + 74}
                    y2={viewState.bBox.y + viewState.bBox.h + 11}
                    stroke="black"
                    stroke-width="10"
                />
                <line
                    id="Line 3"
                    x1={viewState.bBox.x + viewState.bBox.w + 8}
                    y1={viewState.bBox.y + viewState.bBox.h + 8}
                    x2={viewState.bBox.x + viewState.bBox.w + 8}
                    y2={viewState.bBox.y - 8}
                    stroke="black"
                    stroke-width="10"
                />

            </svg>


            <WorkerLine
                model={model}
            />
            {components}
        </>
    )
}