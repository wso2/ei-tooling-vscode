import { __rest } from "tslib";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useContext, useReducer } from "react";
import { recalculateSizingAndPositioning, sizingAndPositioning } from "../Utils";
const defaultState = {};
export const Context = React.createContext(defaultState);
const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_STATE':
            return Object.assign(Object.assign(Object.assign({}, state), action.payload), { targetPosition: state.targetPosition });
        case 'DIAGRAM_CLEAN_DRAW':
            return Object.assign(Object.assign({}, state), { syntaxTree: sizingAndPositioning(action.payload) });
        case 'DIAGRAM_REDRAW':
            return Object.assign(Object.assign({}, state), { syntaxTree: recalculateSizingAndPositioning(action.payload) });
        case 'INSERT_COMPONENT_START':
            return Object.assign(Object.assign({}, state), { targetPosition: action.payload });
        case 'EDITOR_COMPONENT_START':
            return Object.assign(Object.assign({}, state), { targetPosition: action.payload });
        default:
            return state;
    }
};
const updateState = (dispatch) => {
    return (payload) => {
        dispatch({ type: 'UPDATE_STATE', payload });
    };
};
const diagramCleanDraw = (dispatch) => {
    return (payload) => {
        dispatch({ type: 'DIAGRAM_CLEAN_DRAW', payload });
    };
};
const diagramRedraw = (dispatch) => {
    return (payload) => {
        dispatch({ type: 'DIAGRAM_REDRAW', payload });
    };
};
const insertComponentStart = (dispatch) => {
    return (payload) => {
        dispatch({ type: 'INSERT_COMPONENT_START', payload });
    };
};
const editorComponentStart = (dispatch) => {
    return (payload) => {
        dispatch({ type: 'EDITOR_COMPONENT_START', payload });
    };
};
export const Provider = (props) => {
    const { children, api } = props, restProps = __rest(props, ["children", "api"]);
    const [state, dispatch] = useReducer(reducer, { experimentalEnabled: props.experimentalEnabled });
    const actions = {
        updateState: updateState(dispatch),
        diagramCleanDraw: diagramCleanDraw(dispatch),
        diagramRedraw: diagramRedraw(dispatch),
        insertComponentStart: insertComponentStart(dispatch),
        editorComponentStart: editorComponentStart(dispatch)
    };
    return (_jsx(Context.Provider, Object.assign({ value: { state, actions, api, props: restProps } }, { children: children })));
};
export const useDiagramContext = () => useContext(Context);
//# sourceMappingURL=diagram.js.map