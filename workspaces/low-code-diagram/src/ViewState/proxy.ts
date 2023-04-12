import {ViewState} from "./view-state";
import {SimpleBBox} from "./simple-bbox";

export class ProxyViewState extends ViewState {

    public dataProcess: SimpleBBox = new SimpleBBox();
}