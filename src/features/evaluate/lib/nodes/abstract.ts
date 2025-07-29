import { Positionable } from '../common';

import { Value } from './value.type';

export enum NodeType {
    Detached,
    Root,
    Value,
    BinaryExpression,
}

const INVALID_POSITION = -1;

export abstract class AbstractNode implements Positionable {
    public readonly type: NodeType = NodeType.Detached;

    public start: number = INVALID_POSITION;
    public end: number = INVALID_POSITION;

    public abstract evaluate(): Value;
}
