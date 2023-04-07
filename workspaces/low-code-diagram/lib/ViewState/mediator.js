import { ViewState } from "./view-state";
import { SimpleBBox } from "./simple-bbox";
export class MediatorViewState extends ViewState {
    constructor() {
        super(...arguments);
        this.dataProcess = new SimpleBBox();
    }
}
//# sourceMappingURL=mediator.js.map