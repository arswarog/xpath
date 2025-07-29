import { HighlightedError, PositionalError } from '../common';

import { AbstractNode, NodeType } from './abstract';

export class RootNode extends AbstractNode {
    public readonly type = NodeType.Root;

    constructor(
        public expression: AbstractNode,
        public source: string,
    ) {
        super();

        this.start = expression.start;
        this.end = expression.end;
    }

    public evaluate() {
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
