import {ViewState} from "../ViewState/view-state";

export interface Shape {
    name: string;
    type: string;
    kind: string;
    viewState: ViewState;
}

export interface Square extends Shape {
    children: Square[];
}