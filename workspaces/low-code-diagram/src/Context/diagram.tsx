/**
 * Copyright (c) 2023, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

import React, { useContext, useReducer } from "react";
import { LowCodeDiagramContext, LowCodeDiagramProps, LowCodeDiagramState } from "./types";
import { NodePosition, STNode } from "@wso2-ei/syntax-tree";
import { recalculateSizingAndPositioning, sizingAndPositioning } from "../Utils";

const defaultState: any = {};
export const Context = React.createContext<LowCodeDiagramContext>(defaultState);

const reducer = (state: LowCodeDiagramState, action: any) => {
    switch (action.type) {
        case 'UPDATE_STATE':
            return {
                ...state,
                ...action.payload,
                targetPosition: state.targetPosition,
            };
        case 'DIAGRAM_CLEAN_DRAW':
            return {
                ...state,
                syntaxTree: sizingAndPositioning(action.payload),
            };
        case 'DIAGRAM_REDRAW':
            return {
                ...state,
                syntaxTree: recalculateSizingAndPositioning(action.payload)
            };
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
        default:
            return state;
    }
};

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
    return (payload: STNode) => {
        dispatch({ type: 'EDITOR_COMPONENT_START', payload })
    }
}

export const Provider: React.FC<LowCodeDiagramProps> = (props) => {
    const { children, api, ...restProps } = props;

    const [state, dispatch] = useReducer(reducer, { experimentalEnabled: props.experimentalEnabled });

    const actions = {
        updateState: updateState(dispatch),
        diagramCleanDraw: diagramCleanDraw(dispatch),
        diagramRedraw: diagramRedraw(dispatch),
        insertComponentStart: insertComponentStart(dispatch),
        editorComponentStart: editorComponentStart(dispatch)
    };

    return (
        <Context.Provider value={{ state, actions, api, props: restProps }}>
            {children}
        </Context.Provider>
    );
}

export const useDiagramContext = () => useContext(Context);