import { Token } from '../lexer';

import { AbstractNode, NodeType } from './abstract';
import type { CheckAttributeNode } from './check-attribute';
import type { LogicalExpressionNode } from './logical-expression';

export class BracketedExpressionNode extends AbstractNode {
    public readonly type = NodeType.BracketedExpression;

    constructor(
        public openingBracket: Token,
        public spaceBeforeExpression: Token | undefined,
        public expression: CheckAttributeNode | LogicalExpressionNode | BracketedExpressionNode,
        public spaceAfterExpression: Token | undefined,
        public closingBracket: Token,
    ) {
        super();

        this.start = openingBracket.start;
        this.end = closingBracket.end;
    }

    public getTokens(): Token[] {
        return [
            this.openingBracket,
            this.spaceBeforeExpression,
            ...this.expression.getTokens(),
            this.spaceAfterExpression,
            this.closingBracket,
        ].filter(Boolean) as Token[];
    }
}
