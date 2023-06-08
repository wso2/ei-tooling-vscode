import { DataMapperNodeFactory } from "./DataMapperNodes/DataMapperNodeFactory";
import { InputsNodeFactory } from "./InputsNodes/InputsNodeFactory";
import { JoinNodeFactory } from "./Boolean_StringJoin/JoinNodeFactory";
import { SplitNodeFactory } from "./String/Split/SplitNodeFactory";
import { SubStringNodeFactory } from "./String/SubString/SubStringNodeFactory";
import { TransformNodeFactory } from "./String_Transform_TypeConversion/TransformNodeFactory";

export const nodeFactories = [
  new InputsNodeFactory(),
  new DataMapperNodeFactory(),
  new JoinNodeFactory(),
  new TransformNodeFactory(),
  new SplitNodeFactory(),
  new SubStringNodeFactory(),
];
