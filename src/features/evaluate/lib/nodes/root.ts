import { HighlightedError, PositionalError } from '../common';

import { AbstractNode, NodeType } from './abstract';
import { BinaryExpressionNode } from './binary-expression';
import { ValueNode } from './value';

export class RootNode extends AbstractNode {
    public readonly type = NodeType.Root;

    constructor(
        public expression: BinaryExpressionNode | ValueNode | null,
        public source: string,
    ) {
        super();
    }

    public evaluate() {
        if (!this.expression) {
            throw new Error('Root expression is null');
        }

        try {
            return this.expression.evaluate();
        } catch (e) {
            if (e instanceof PositionalError) {
                throw new HighlightedError(e, this.source);
            } else {
                throw e;
            }
        }
    }
}
