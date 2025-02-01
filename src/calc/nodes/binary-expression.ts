import { Token } from '../lexer';

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
                this.operator.text,
                rightValue as NumberValue,
            );
        }

        throw new Error(`Unsupported value type: ${leftValue.type}`);
    }
}

function evaluateNumberExpression(
    left: NumberValue,
    operator: string,
    right: NumberValue,
): NumberValue {
    switch (operator) {
        case '+':
            return {
                type: ValueType.Number,
                value: left.value + right.value,
            };
        case '-':
            return {
                type: ValueType.Number,
                value: left.value - right.value,
            };
        case '*':
            return {
                type: ValueType.Number,
                value: left.value * right.value,
            };
        case '/':
            return {
                type: ValueType.Number,
                value: left.value / right.value,
            };
        default:
            throw new Error(`Unexpected operator: ${operator}`);
    }
}
