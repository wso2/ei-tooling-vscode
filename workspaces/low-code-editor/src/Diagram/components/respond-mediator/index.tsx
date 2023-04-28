import React from "react";
import { Circle } from "@wso2-ei/low-code-diagram";
import { getComponent } from "../../util";
import { WorkerLine } from "../worker-line";

interface SquareProps {
    model: Circle;
}

export function RespondComponent(props: SquareProps) {
    const { model } = props;

    const viewState = model.viewState;
    const components: JSX.Element[] = [];

    model.children.forEach(child => {
        components.push(getComponent(child.type, { model: child }));
    })

    return (
        <>
            <svg>

                <circle id="Ellipse 1" cx={viewState.bBox.cx} cy={viewState.bBox.cy} r={viewState.bBox.r} fill="#3D84B8" />
                <rect id="Rectangle 1" x={viewState.bBox.cx + (viewState.bBox.r * 0.34)} y={viewState.bBox.cy - (viewState.bBox.r * 0.62)} width={viewState.bBox.r * 0.13} height={viewState.bBox.r * 0.71} fill="#D9D9D9" />
                <rect id="Rectangle 2" x={viewState.bBox.cx - (viewState.bBox.r * 0.42)} y={viewState.bBox.cy + (viewState.bBox.r * -0.05)} width={viewState.bBox.r * 0.83} height={viewState.bBox.r * 0.14} fill="#D9D9D9" />
                <path id="Polygon 1" d={`M${viewState.bBox.cx - (viewState.bBox.r * 0.58)} ${viewState.bBox.cy - (viewState.bBox.r * 0.03)}L${viewState.bBox.cx - (viewState.bBox.r * 0.15)} ${viewState.bBox.cy - (viewState.bBox.r * 0.18)}V${viewState.bBox.cy + (viewState.bBox.r * 0.18)}L${viewState.bBox.cx - (viewState.bBox.r * 0.58)} ${viewState.bBox.cy + (viewState.bBox.r * 0.03)}Z`} fill="#D9D9D9" />

            </svg>



            <WorkerLine
                model={model}
            />
            {components}
        </>
    )
}