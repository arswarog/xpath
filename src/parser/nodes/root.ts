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

    public getTokens() {
        return this.expression.getTokens();
    }
}
