import { AbstractNode, NodeType } from './abstract.ts';

export class ValueNode extends AbstractNode {
    public readonly type = NodeType.Value;

    constructor(public value: any) {
        super();
    }
}
