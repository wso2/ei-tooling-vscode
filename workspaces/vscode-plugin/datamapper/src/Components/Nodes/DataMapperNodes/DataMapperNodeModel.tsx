import { DeserializeEvent } from '@projectstorm/react-canvas-core';
import DataMapperPortModel from '../../Port/DataMapperPort/DataMapperPortModel';
import { CustomNodeModel } from '../Customs/CustomNodeModel';
import { DiagramEngine } from '@projectstorm/react-diagrams';

interface SchemaProperty {
    [key: string]: {
        type: string;
        id?: string;
        description?: string;
    }
}

export class DataMapperNodeModel extends CustomNodeModel {
    name: string;
    schema: SchemaProperty;
    engine!: DiagramEngine;

    constructor(schema: SchemaProperty, options: any = {}) {
        super('my-datamapper-node', options.name);
        this.name = options.name || undefined;
        this.schema = schema;
        this.initPorts();
    }

    initPorts(): void {
        let portType: 'IN' | 'OUT' = 'OUT';
        let alignment = 'right';
        if (this.name === 'Output') {
            portType = 'IN';
            alignment = 'left'
        }
        if(this.schema){
            for (const [propertyName, property] of Object.entries(this.schema)) {
                const port = new DataMapperPortModel(`${propertyName} : ${property.type}`, portType, alignment);
                this.addPort(port);
            }
        }
    }

    initLinks(): void { }

    serialize() {
        return {
            ...super.serialize(),
            name : this.name,
            schema :  this.schema,
        };
    }

    deserialize(event: DeserializeEvent<this>) {
        super.deserialize(event);
        this.name = event.data.name;
        this.schema = event.data.schema;
    }

}