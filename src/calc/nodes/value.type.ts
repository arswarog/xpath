export enum ValueType {
    Number,
}

interface BaseValue {
    type: ValueType;
    value: unknown;
}

export interface NumberValue extends BaseValue {
    type: ValueType.Number;
    value: number;
}

export type Value = NumberValue;
