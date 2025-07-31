import { PositionalError } from '@src/parser';

import { Token, TokenType } from '../lexer';

import { AbstractNode, NodeType } from './abstract';

export class ValueNode extends AbstractNode {
    public readonly type = NodeType.Value;
    public readonly value: string;
    public readonly raw: string;

    constructor(private valueToken: Token) {
        super();

        if (valueToken.type !== TokenType.StringLiteral) {
            throw new PositionalError(
                `Expected string literal, got ${valueToken.type}`,
                valueToken,
            );
        }

        this.value = valueToken.text;
        this.raw = valueToken.text;

        this.start = valueToken.start;
        this.end = valueToken.end;
    }

    public getTokens() {
        return [this.valueToken];
    }
}
