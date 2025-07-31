import { Token } from '../lexer';

import { AbstractNode, NodeType } from './abstract';
import type { CheckAttributeNode } from './check-attribute';
import type { LogicalExpressionNode } from './logical-expression';

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

    public getTokens(): Token[] {
        return [
            this.open,
            this.spaceAfterOpen,
            ...this.expression.getTokens(),
            this.spaceBeforeClose,
            this.close,
        ].filter(Boolean) as Token[];
    }
}
