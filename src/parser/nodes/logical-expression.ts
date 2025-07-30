import type { CheckAttributeNode } from '@src/parser';

import { Token } from '../lexer';

import { AbstractNode, NodeType } from './abstract';

export class LogicalExpressionNode extends AbstractNode {
    public readonly type = NodeType.LogicalExpression;

    constructor(
        public left: CheckAttributeNode | LogicalExpressionNode,
        public spaceBeforeOperator: Token | undefined,
        public operator: Token,
        public spaceAfterOperator: Token | undefined,
        public right: CheckAttributeNode | LogicalExpressionNode,
    ) {
        super();

        this.start = left.start;
        this.end = right.end;
    }
}
