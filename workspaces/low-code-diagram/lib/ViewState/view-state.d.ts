import { SimpleBBox } from "./simple-bbox";
export declare class ViewState {
    bBox: SimpleBBox;
    hidden: boolean;
    hiddenBlock: boolean;
    synced: boolean;
    collapsed: boolean;
    folded: boolean;
    workerLine: SimpleBBox;
    getHeight(): number;
}
