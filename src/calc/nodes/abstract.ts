export enum NodeType {
    Detached,
    Root,
    Value,
    BinaryExpression,
}

export abstract class AbstractNode {
    public readonly type: NodeType = NodeType.Detached;
}
