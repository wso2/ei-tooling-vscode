import React from "react";
import { getComponent } from "../../util";
import { WorkerLine } from "../worker-line";
import { Square } from "@wso2-ei/low-code-diagram";

interface SquareProps {
    model: Square;
}

export function SquareComponent(props: SquareProps) {
    const { model } = props;

    const viewState = model.viewState;

    const components: JSX.Element[] = [];

    model.children.forEach(child => {
        components.push(getComponent(child.tag, { model: child }));
    })

    return (
        <>
            <rect
                x={viewState.bBox.x}
                y={viewState.bBox.y}
                width={viewState.bBox.w}
                height={viewState.bBox.h}
                fill='#fff'
                stroke="black"
                stroke-width="3"
            />
            

            <WorkerLine
                model={model}
            />
            {components}
            {/*<NameComponent model={model} />*/}
        </>
    )
}