
import { getComponent } from "../../util";
import {WorkerLine} from "../worker-line";
import {Circle} from "../../../Shapes";

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

            {/*<svg viewBox="0 0 100 100">*/}
            {/*    <circle cx={viewState.bBox.cx} cy={viewState.bBox.cy} r={viewState.bBox.r} stroke="black" stroke-width="2" fill="cyan"/>*/}
            {/*    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="black" font-size="20">HUKAHAN!</text>*/}
            {/*</svg>*/}

            {/*<svg viewBox="0 0 100 100">*/}
            {/*    <circle cx={viewState.bBox.cx} cy={viewState.bBox.cy} r={viewState.bBox.r} fill="cyan"/>*/}
            {/*    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="black" font-size="20">Happy New Year!</text>*/}
            {/*</svg>*/}

            {/*<g className="mediator">*/}
            {/*    <MediatorSVG*/}
            {/*        x={viewState.bBox.cx - (START_SVG_WIDTH / 2)}*/}
            {/*        y={viewState.bBox.cy - (START_SVG_WIDTH / 2)}*/}
            {/*        text="START"*/}
            {/*    />*/}
            {/*    /!*{block && initPlusAvailable && !isReadOnly && <PlusButton viewState={plusView} model={block} initPlus={true} />}*!/*/}
            {/*</g>*/}

            <WorkerLine
                model={model}
            />
            {components}
            {/*<NameComponent model={model} />*/}
        </>
    )
}