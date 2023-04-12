import React from "react";
import {Circle} from "@wso2-ei/low-code-diagram";
import { getComponent } from "../../util";
import {WorkerLine} from "../worker-line";

interface SquareProps {
    model: Circle;
}

export function CircleComponent(props: SquareProps) {
    const { model } = props;

    const viewState = model.viewState;
    const components: JSX.Element[] = [];

    model.children.forEach(child => {
        components.push(getComponent(child.type, { model: child }));
    })

    return (
        <>
            <circle
                cx={viewState.bBox.cx}
                cy={viewState.bBox.cy}
                r={viewState.bBox.r}
                stroke="black"
                stroke-width="3"
                fill="#fff"
            />
            <WorkerLine
                model={model}
            />
            {components}
            {/*<NameComponent model={model} />*/}
        </>
    )
}