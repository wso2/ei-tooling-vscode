import { SimpleBBox } from "./simple-bbox";
export class ViewState {
    constructor() {
        this.bBox = new SimpleBBox();
        this.hidden = false;
        this.hiddenBlock = false;
        this.synced = false;
        this.collapsed = false;
        this.folded = false;
        this.workerLine = new SimpleBBox();
    }
    getHeight() {
        return (this.bBox.h + this.bBox.offsetFromBottom + this.bBox.offsetFromTop);
    }
}
//# sourceMappingURL=view-state.js.map