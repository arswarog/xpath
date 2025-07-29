import { Token } from '../lexer';

import { AbstractNode, NodeType } from './abstract';

export class BinaryExpressionNode extends AbstractNode {
    public readonly type = NodeType.BinaryExpression;

    constructor(
        public operator: Token,
        public left: AbstractNode,
        public right: AbstractNode,
    ) {
        super();

        this.start = left.start;
        this.end = right.end;
    }
}
