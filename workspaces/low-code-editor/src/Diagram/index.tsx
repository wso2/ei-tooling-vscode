import { ShapeKindChecker } from "@wso2-ei/low-code-diagram";
import { Shape } from "@wso2-ei/low-code-diagram/dist/Shapes/types";
import { useAppContext } from "../contexts/AppContext";
import { getComponent } from "./util";

export function Diagram() {
    const { state: { syntaxTree } } = useAppContext();

    const model = syntaxTree?.model;

    const components: JSX.Element[] = [];

    let height = 0
    let width = 0;

    if (model) {
        components.push(getComponent(model.kind, { model }));

        const viewState = (model as Shape).viewState;

        if (ShapeKindChecker.isCircleShape(model)) {
            height = viewState.bBox.h;
            width = viewState.bBox.r * 2 + 10;
        } else {
            height = viewState.bBox.h;
            width = viewState.bBox.h;
        }
    }

    return (
        <svg width={width} height={height}>
            {components}
        </svg>
    )

}