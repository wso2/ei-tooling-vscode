import { PortModel, PortModelGenerics } from "@projectstorm/react-diagrams";
import { DataMapperLinkModel } from "../../Link/Model/DataMapperLinkModel";
import { IntermediatePortModel } from './../IntermediatePort/IntermediatePortModel';
import { DeserializeEvent } from "@projectstorm/react-canvas-core";

export interface DataMapperNodeModelGenerics {
    PORT: DataMapperPortModel;
}

// Declaration of model for customized ports for the Input and output nodes.
export default class DataMapperPortModel extends PortModel<PortModelGenerics & DataMapperNodeModelGenerics>  {
    linkedPorts: DataMapperPortModel[] =[];
   
    constructor(
        public portName: string,
        public portType: "IN" | "OUT",
        public alignment : string,
        public parentModel?: DataMapperPortModel,
        public collapsed?: boolean,
        public hidden?: boolean,
        public descendantHasValue?: boolean,
        public ancestorHasValue?: boolean) {
        super({
            name: `${portName}`,
            type: 'my-datamapper-port',
        });
    }

    getPortType(): string {
        return this.portType;
    }

    createLinkModel(): DataMapperLinkModel {
        const dm = new DataMapperLinkModel();
        return dm;
    }

    addLinkedPort(port: DataMapperPortModel): void {
        this.linkedPorts.push(port);
        port.linkedPorts.push(this);
    }

    isDisabled(): boolean | undefined {
        return this.ancestorHasValue || this.descendantHasValue;
    }

    isLinkedTo(port: DataMapperPortModel): boolean {
        return this.linkedPorts.some((linkedPort) => linkedPort.getID() === port.getID());
    }

    canLinkToPort(port: DataMapperPortModel): boolean {
        return ((this.portType !== port.portType) && !this.isLinkedTo(port) &&  (port instanceof IntermediatePortModel || (!port.isDisabled())) );
    }

    serialize() {
        return {
            ...super.serialize(),
            portName : this.portName,
            portType : this.portType,
        };
    }

    deserialize(event: DeserializeEvent<this>) {
        super.deserialize(event);
        this.portName = event.data.portName;
        this.portType = event.data.portType;
    }

}
