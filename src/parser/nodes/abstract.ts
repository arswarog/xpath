import { Positionable } from '../common';

export enum NodeType {
    Detached,
    Root,
}

const INVALID_POSITION = -1;

export abstract class AbstractNode implements Positionable {
    public readonly type: NodeType = NodeType.Detached;

    public start: number = INVALID_POSITION;
    public end: number = INVALID_POSITION;
}
