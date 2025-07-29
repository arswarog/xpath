import { PositionalError } from '../common';
import { Token, TokenType } from '../lexer';

import { AbstractNode, NodeType } from './abstract';
import { NumberValue, Value, ValueType } from './value.type';

export class BinaryExpressionNode extends AbstractNode {
    public readonly type = NodeType.BinaryExpression;

    constructor(
        public operator: Token,
        public left: AbstractNode,
        public right: AbstractNode,
    ) {
        super();
    }

    public evaluate(): Value {
        const leftValue = this.left.evaluate();
        const rightValue = this.right.evaluate();

        if (leftValue.type !== rightValue.type) {
            throw new Error(
                `Cannot evaluate binary expression with different types: ${leftValue.type} and ${rightValue.type}`,
            );
        }

        if (leftValue.type === ValueType.Number) {
            return evaluateNumberExpression(
                leftValue as NumberValue,
                this.operator,
                rightValue as NumberValue,
            );
        }

        throw new Error(`Unsupported value type: ${leftValue.type}`);
    }
}

function evaluateNumberExpression(
    left: NumberValue,
    operator: Token,
    right: NumberValue,
): NumberValue {
    switch (operator.type) {
        case TokenType.PlusOperation:
            return {
                type: ValueType.Number,
                value: left.value + right.value,
            };
        case TokenType.MinusOperation:
            return {
                type: ValueType.Number,
                value: left.value - right.value,
            };
        case TokenType.MultiplyOperation:
            return {
                type: ValueType.Number,
                value: left.value * right.value,
            };
        case TokenType.DivideOperation:
            return {
                type: ValueType.Number,
                value: left.value / right.value,
            };
        default:
            throw new PositionalError(`Unexpected operator "${operator.text}"`, operator);
    }
}
