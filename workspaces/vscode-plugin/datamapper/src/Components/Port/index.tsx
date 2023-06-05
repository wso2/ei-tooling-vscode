import { IntermediatePortFactory } from './IntermediatePort/IntermediatePortFactory';
import { DataMapperPortFactory } from './DataMapperPort/DataMapperPortFactory';

export const portFactories = [
    new IntermediatePortFactory(),
    new DataMapperPortFactory(),
];
