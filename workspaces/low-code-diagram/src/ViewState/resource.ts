import {ViewState} from "./view-state";
import {SimpleBBox} from "./simple-bbox";

export class ResourceViewState extends ViewState {

    public dataProcess: SimpleBBox = new SimpleBBox();
    public workerLine2: SimpleBBox = new SimpleBBox();
    public workerLine3: SimpleBBox = new SimpleBBox();
}