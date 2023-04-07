import {SimpleBBox} from "./simple-bbox";

export class ViewState {
    public bBox: SimpleBBox = new SimpleBBox();
    public hidden: boolean = false;
    public hiddenBlock: boolean = false;
    public synced: boolean = false;
    public collapsed: boolean = false;
    public folded: boolean = false;
    public workerLine: SimpleBBox = new SimpleBBox();

    public getHeight(): number {
        return (this.bBox.h + this.bBox.offsetFromBottom + this.bBox.offsetFromTop);
    }
}