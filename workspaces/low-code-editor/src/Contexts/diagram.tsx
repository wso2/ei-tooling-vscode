import React from "react";
import {LowCodeEditorContext, LowCodeEditorProps, LowCodeEditorState} from "../Types";
import {NodePosition, STNode} from "@wso2-ei/syntax-tree";
import {recalculateSizingAndPositioning, sizingAndPositioning} from "@wso2-ei/low-code-diagram";
// import {recalculateSizingAndPositioning, sizingAndPositioning } from "@wso2-ei/low-code-diagram";

const reducer = (state: LowCodeEditorState, action: any) => {
    switch (action.type) {
        // case "0":
        //     const model = action.payload.model;
        //     // traverse(model, initVisitor);
        //     // traverse(model, sizingVisitor);
        //     // traverse(model, positionVisitor);
        //     return { ...state, ...action.payload }
        case 'UPDATE_STATE':
            return { ...state, ...action.payload, targetPosition: state.targetPosition };
        case 'DIAGRAM_CLEAN_DRAW':
            return {
                ...state,
                syntaxTree: sizingAndPositioning(action.payload),
            }
        case 'DIAGRAM_REDRAW':
            return {
                ...state,
                syntaxTree: recalculateSizingAndPositioning(action.payload)
            }
        case 'INSERT_COMPONENT_START':
            return {
                ...state,
                targetPosition: action.payload
            }
        case 'EDITOR_COMPONENT_START':
            return {
                ...state,
                targetPosition: action.payload
            }
        case 'TOGGLE_DIAGRAM_OVERLAY':
            return {
                ...state,
                isConfigOverlayFormOpen: !state.isConfigOverlayFormOpen,
                dataMapperConfig: undefined
            }
        case 'UPDATE_DATAMAPPER_CONFIG':
            return {
                ...state,
                dataMapperConfig: action.payload
            }
        case 'UPDATE_CURRENT_FUNCTION_NODE':
            return {
                ...state,
                currentFunctionNode: action.payload
            }
        default:
            return state;

    }
}

const updateCurrentFunctionNode = (dispatch: any) => {
    return (payload: any) => {
        dispatch({ type: 'UPDATE_CURRENT_FUNCTION_NODE', payload });
    };
}

const updateState = (dispatch: any) => {
    return (payload: any) => {
        dispatch({ type: 'UPDATE_STATE', payload });
    };
}

const diagramCleanDraw = (dispatch: any) => {
    return (payload: STNode) => {
        dispatch({ type: 'DIAGRAM_CLEAN_DRAW', payload });
    }
}

const diagramRedraw = (dispatch: any) => {
    return (payload: STNode) => {
        dispatch({ type: 'DIAGRAM_REDRAW', payload })
    }
}

const insertComponentStart = (dispatch: any) => {
    return (payload: NodePosition) => {
        dispatch({ type: 'INSERT_COMPONENT_START', payload })
    }
}

const editorComponentStart = (dispatch: any) => {
    return (payload: NodePosition) => {
        dispatch({ type: 'EDITOR_COMPONENT_START', payload })
    }
}

const toggleDiagramOverlay = (dispatch: any) => {
    return () => {
        dispatch({ type: 'TOGGLE_DIAGRAM_OVERLAY' })
    }
}

const setTriggerUpdated = (dispatch: any) => {
    return (isUpdated: boolean) => {
        dispatch({ type: 'SET_TRIGGER_UPDATED', payload: isUpdated })
    }
}

const defaultValue: any = {}

// export const AppContext = React.createContext<LowCodeEditorContext>(defaultValue);

export const Context = React.createContext<LowCodeEditorContext>(defaultValue); // FIXME: Add proper deafault state

export const useAppContext = () => React.useContext(Context);

export const Provider: React.FC<LowCodeEditorProps> = (props:React.PropsWithChildren<LowCodeEditorProps>) => {
    const { children, api, ...restProps } = props;
    const [state, dispatch] = React.useReducer(reducer, { model: undefined });

    const actions = {
        updateState: updateState(dispatch),
        diagramCleanDraw: diagramCleanDraw(dispatch),
        diagramRedraw: diagramRedraw(dispatch),
        insertComponentStart: insertComponentStart(dispatch),
        editorComponentStart: editorComponentStart(dispatch),
        toggleDiagramOverlay: toggleDiagramOverlay(dispatch),
        updateCurrentFunctionNode: updateCurrentFunctionNode(dispatch),
        setTriggerUpdated: setTriggerUpdated(dispatch)
    };

    return (
        <Context.Provider value={{ state, actions, api, props: restProps }}>
            {children}
        </Context.Provider>
    );
}