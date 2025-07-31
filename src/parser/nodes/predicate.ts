import { CheckAttributeNode, LogicalExpressionNode } from '@src/parser';

import { Token } from '../lexer';

import { AbstractNode, NodeType } from './abstract';

export class PredicateNode extends AbstractNode {
    public readonly type = NodeType.Predicate;

    constructor(
        public open: Token,
        public spaceAfterOpen: Token | undefined,
        public expression: CheckAttributeNode | LogicalExpressionNode,
        public spaceBeforeClose: Token | undefined,
        public close: Token,
    ) {
        super();

        this.start = open.start;
        this.end = close.end;
    }
}
