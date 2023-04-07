import { DefaultConfig } from "../Visitors/default";

export class SimpleBBox {
    public x: number = 0;
    public y: number = 0;
    public r: number = 0;
    public w: number = 0;
    public rw: number = 0;
    public lw: number = 0;
    public h: number = 0;
    public rx: number = 0;
    public ry: number = 0;
    public cx: number = 0;
    public cy: number = 0;
    public length: number = 0;
    public label: string = "";
    public labelWidth: number = 0;
    public offsetFromBottom: number = DefaultConfig.offSet;
    public offsetFromTop: number = DefaultConfig.offSet;

    public x1: number = 0;
    public x2: number = 0;
    public y1: number = 0;
    public y2: number = 0;
}
