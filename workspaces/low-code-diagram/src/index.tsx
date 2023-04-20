import { LowCodeDiagramProps } from "./Context";
import { Provider as DiagramContext } from "./Context/diagram";
import LowCodeDiagramRenderer from "./container";

export * from "./ViewState";
export * from "./Shapes";
export * from "./Utils";
export * from "./Context";
export * from "./Components/RenderingComponents/Mediator";

export function LowCodeDiagram(props: LowCodeDiagramProps) {
    return (
        <DiagramContext {...props}>
            <LowCodeDiagramRenderer />
        </DiagramContext>
    );
}
