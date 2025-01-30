import { AbstractNode, NodeType } from './abstract.ts';
import { Token } from '../lexer';

export class BinaryExpressionNode extends AbstractNode {
    public readonly type = NodeType.BinaryExpression;

    constructor(
        public operator: Token,
        public left: AbstractNode | null,
        public right: AbstractNode | null,
    ) {
        super();
    }
}
