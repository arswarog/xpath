import { PositionalError } from '../common';
import { Token, TokenType } from '../lexer';

import { AbstractNode, NodeType } from './abstract';

export class AttributeNode extends AbstractNode {
    public readonly type = NodeType.Attribute;
    public readonly name: string;
    public readonly raw: string;

    constructor(private attributeToken: Token) {
        super();

        if (attributeToken.type !== TokenType.Attribute) {
            throw new PositionalError(
                `Expected attribute token, got ${attributeToken.type}`,
                attributeToken,
            );
        }

        this.name = attributeToken.text;
        this.raw = attributeToken.text;

        this.start = attributeToken.start;
        this.end = attributeToken.end;
    }

    public getTokens() {
        return [this.attributeToken];
    }
}
