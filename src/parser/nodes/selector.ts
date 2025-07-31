import { Token } from '../lexer';

import { AbstractNode, NodeType } from './abstract';

export class SelectorNode extends AbstractNode {
    public readonly type = NodeType.Selector;

    constructor(
        public selector: Token,
        public predicates: [spaceBefore: Token | undefined, predicate: AbstractNode][] = [],
    ) {
        super();

        this.start = selector.start;
        this.end = selector.end;

        if (predicates.length > 0) {
            const [, lastPredicate] = predicates[predicates.length - 1];
            this.end = lastPredicate.end;
        }
    }

    public getTokens(): Token[] {
        return [
            this.selector,
            this.predicates.map(([space, predicate]) => [space, ...predicate.getTokens()]),
        ].flat(3) as Token[];
    }
}
