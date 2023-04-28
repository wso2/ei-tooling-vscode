import React from "react";
import { Circle } from "@wso2-ei/low-code-diagram";
import { getComponent } from "../../util";
import { WorkerLine } from "../worker-line";

interface SquareProps {
    model: Circle;
}

export function LogComponent(props: SquareProps) {
    const { model } = props;

    const viewState = model.viewState;
    const components: JSX.Element[] = [];

    model.children.forEach(child => {
        components.push(getComponent(child.type, { model: child }));
    })

    return (
        <>
            <svg>
                <circle cx={viewState.bBox.cx} cy={viewState.bBox.cy} r={viewState.bBox.r} fill="#3D84B8" id="Ellipse 1" />
                <rect x={viewState.bBox.cx - (viewState.bBox.r * 0.75)} y={viewState.bBox.cy - (viewState.bBox.r * 0.28)} width={viewState.bBox.r * 1.2} height={viewState.bBox.r * 0.06} rx={viewState.bBox.r * 0.3} fill="#D9D9D9" id="Rectangle 4" />
                <rect x={viewState.bBox.cx - (viewState.bBox.r * 0.75)} y={viewState.bBox.cy - (viewState.bBox.r * 0.17)} width={viewState.bBox.r * 0.548} height={viewState.bBox.r * 0.06} rx={viewState.bBox.r * 0.3} fill="#D9D9D9" id="Rectangle 2" />
                <rect x={viewState.bBox.cx - (viewState.bBox.r * 0.6)} y={viewState.bBox.cy - (viewState.bBox.r * 0.03)} width={viewState.bBox.r * 0.85} height={viewState.bBox.r * 0.06} rx={viewState.bBox.r * 0.3} fill="#D9D9D9" id="Rectangle 1" />
                <rect x={viewState.bBox.cx - (viewState.bBox.r * 0.1)} y={viewState.bBox.cy - (viewState.bBox.r * 0.17)} width={viewState.bBox.r * 0.548} height={viewState.bBox.r * 0.06} rx={viewState.bBox.r * 0.3} fill="#D9D9D9" id="Rectangle 3" />
                <rect x={viewState.bBox.cx - (viewState.bBox.r * 0.75)} y={viewState.bBox.cy + (viewState.bBox.r * 0.18)} width={viewState.bBox.r * 0.548} height={viewState.bBox.r * 0.06} rx={viewState.bBox.r * 0.3} fill="#D9D9D9" id="Rectangle 5" />
                <rect x={viewState.bBox.cx - (viewState.bBox.r * 0.1)} y={viewState.bBox.cy + (viewState.bBox.r * 0.18)} width={viewState.bBox.r * 0.548} height={viewState.bBox.r * 0.06} rx={viewState.bBox.r * 0.3} fill="#D9D9D9" id="Rectangle 6" />
                <rect x={viewState.bBox.cx - (viewState.bBox.r * 0.75)} y={viewState.bBox.cy + (viewState.bBox.r * 0.28)} width={viewState.bBox.r * 1.2} height={viewState.bBox.r * 0.044} rx={viewState.bBox.r * 0.28} fill="#D9D9D9" id="Rectangle 7" />
            </svg>


            <WorkerLine
                model={model}
            />
            {components}
        </>
    )
}