import { ViewState } from "./view-state";
import { SimpleBBox } from "./simple-bbox";
export class ConnectorViewState extends ViewState {
    constructor() {
        super(...arguments);
        this.dataProcess = new SimpleBBox();
    }
}
//# sourceMappingURL=connector.js.map