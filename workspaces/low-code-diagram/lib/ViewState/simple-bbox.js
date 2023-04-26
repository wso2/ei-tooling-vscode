import { DefaultConfig } from "../Visitors/default";
export class SimpleBBox {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.r = 0;
        this.w = 0;
        this.rw = 0;
        this.lw = 0;
        this.h = 0;
        this.rx = 0;
        this.ry = 0;
        this.cx = 0;
        this.cy = 0;
        this.length = 0;
        this.label = "";
        this.labelWidth = 0;
        this.offsetFromBottom = DefaultConfig.offSet;
        this.offsetFromTop = DefaultConfig.offSet;
        this.x1 = 0;
        this.x2 = 0;
        this.y1 = 0;
        this.y2 = 0;
    }
}
//# sourceMappingURL=simple-bbox.js.map