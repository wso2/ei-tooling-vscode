import {ViewState} from "../ViewState/view-state";

export enum ShapeType {
    CIRCLE = 'Circle',
    TRIANGLE = 'Triangle',
    SQUARE = 'Square',
}

export interface Shape {
    name: string;
    type: string;
    tag: string;
    viewState: ViewState;
    start: number;
    end: number;
    startTagOpenOffset: number;
    startTagOffOffset: number;
    endTagOpenOffset: number;
    endTagOffOffset: number;
    hasTextNode: boolean;
    selfClosed: boolean;

}

export interface Square extends Shape {
    children: Square[] | Circle[];
}

export interface Circle extends Shape {
    children: Square[];
}