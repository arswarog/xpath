import { Token } from '../lexer';

import { AbstractNode, NodeType } from './abstract';
import type { CheckAttributeNode } from './check-attribute';

export class LogicalExpressionNode extends AbstractNode {
    public readonly type = NodeType.LogicalExpression;

    constructor(
        public left: CheckAttributeNode | LogicalExpressionNode,
        public spaceBeforeOperator: Token,
        public operator: Token,
        public spaceAfterOperator: Token,
        public right: CheckAttributeNode | LogicalExpressionNode,
    ) {
        super();

        this.start = left.start;
        this.end = right.end;
    }

    public getTokens(): Token[] {
        return [
            ...this.left.getTokens(),
            this.spaceBeforeOperator,
            this.operator,
            this.spaceAfterOperator,
            ...this.right.getTokens(),
        ];
    }
}
