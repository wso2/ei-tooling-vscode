import { Shape } from "../types";

export class ShapeKindChecker {
    public static isTriangleShape(el: Shape) : boolean {
        return el.type === 'Triangle';
    }

    public static isCircleShape(el: Shape) : boolean {
        return el.type === 'Circle';
    }

    public static isSquareShape(el: Shape) : boolean {
        return el.type === 'Square';
    }
}