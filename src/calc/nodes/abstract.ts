import { Value } from './value.type';

export enum NodeType {
    Detached,
    Root,
    Value,
    BinaryExpression,
}

export abstract class AbstractNode {
    public readonly type: NodeType = NodeType.Detached;

    public abstract evaluate(): Value;
}
