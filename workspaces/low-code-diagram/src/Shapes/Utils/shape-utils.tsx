import { Shape, ShapeType } from "../types";

export class ShapeKindChecker {
    public static isTriangleShape(el: Shape) : boolean {
        return el.type === ShapeType.TRIANGLE;
    }

    public static isCircleShape(el: Shape) : boolean {
        return el.type === ShapeType.CIRCLE;
    }

    public static isSquareShape(el: Shape) : boolean {
        return el.type === ShapeType.SQUARE;
    }
}