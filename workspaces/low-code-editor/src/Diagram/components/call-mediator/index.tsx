import React from "react";
import { getComponent } from "../../util";
import { WorkerLine } from "../worker-line";
import { Square } from "@wso2-ei/low-code-diagram";

interface SquareProps {
    model: Square;
}

export function CallComponent(props: SquareProps) {
    const { model } = props;

    const viewState = model.viewState;

    const components: JSX.Element[] = [];

    model.children.forEach(child => {
        components.push(getComponent(child.tag, { model: child }));
    })

    return (
        <>
            <svg>

                <circle id="Ellipse 1" cx={viewState.bBox.cx} cy={viewState.bBox.cy} r={viewState.bBox.r} fill="#3D84B8" />
                <rect id="Rectangle 2" x={viewState.bBox.cx - (viewState.bBox.r * 0.82)} y={viewState.bBox.cy + (viewState.bBox.r * 0.05)} width={viewState.bBox.r * 0.40} height={viewState.bBox.r * 0.14} rx={viewState.bBox.r * 0.07} fill="#D9D9D9" />
                <rect id="Rectangle 5" x={viewState.bBox.cx + (viewState.bBox.r * 0.40)} y={viewState.bBox.cy + (viewState.bBox.r * 0.05)} width={viewState.bBox.r * 0.40} height={viewState.bBox.r * 0.14} rx={viewState.bBox.r * 0.07} fill="#D9D9D9" />
                <rect id="Rectangle 6" x={viewState.bBox.cx - (viewState.bBox.r * 0.26)} y={viewState.bBox.cy - (viewState.bBox.r * 0.5)} width={viewState.bBox.r * 0.14} height={viewState.bBox.r * 0.40} rx={viewState.bBox.r * 0.07} fill="#D9D9D9" />
                <rect id="Rectangle 7" x={viewState.bBox.cx + (viewState.bBox.r * 0.12)} y={viewState.bBox.cy - (viewState.bBox.r * 0.5)} width={viewState.bBox.r * 0.14} height={viewState.bBox.r * 0.40} rx={viewState.bBox.r * 0.07} fill="#D9D9D9" />
                <circle id="Ellipse 1_2" cx={viewState.bBox.cx - (viewState.bBox.r * 0.2)} cy={viewState.bBox.cy + (viewState.bBox.r * 0.15)} r={viewState.bBox.r * 0.05} fill="#D9D9D9" />
                <circle id="Ellipse 2" cx={viewState.bBox.cx + (viewState.bBox.r * 0.2)} cy={viewState.bBox.cy + (viewState.bBox.r * 0.15)} r={viewState.bBox.r * 0.05} fill="#D9D9D9" />

            </svg>


            <WorkerLine
                model={model}
            />
            {components}
            {/*<NameComponent model={model} />*/}
        </>
    )
}