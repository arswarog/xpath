import { AbstractNode, NodeType } from './abstract';
import { Value, ValueType } from './value.type';
import { Token, TokenType } from '../lexer';

export class ValueNode extends AbstractNode {
    public readonly type = NodeType.Value;
    public readonly value: Value;

    constructor(valueToken: Token) {
        super();

        switch (valueToken.type) {
            case TokenType.NumericLiteral:
                if (!Number.isFinite(parseInt(valueToken.text))) {
                    throw new Error(`Invalid number "${valueToken.text}"`);
                }

                this.value = {
                    type: ValueType.Number,
                    value: parseInt(valueToken.text),
                };
                break;
            default:
                throw new Error(`Unexpected token type: ${valueToken.type}`);
        }
    }
}
