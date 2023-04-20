import { Shape } from "../../../Shapes";

interface WorkerLineProps {
    model: Shape;
}

export function WorkerLine(props: WorkerLineProps) {
    const { model } = props;

    const workerLine = model.viewState.workerLine;

    return (
        <line 
            x1={workerLine.x1}
            x2={workerLine.x2}
            y1={workerLine.y1}
            y2={workerLine.y2}
            stroke="black"
            stroke-width="3"
        />
    )
}
