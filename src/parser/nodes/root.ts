import { Token } from '../lexer';

import { AbstractNode, NodeType } from './abstract';
import { SelectorNode } from './selector.ts';

export class RootNode extends AbstractNode {
    public readonly type = NodeType.Root;

    constructor(
        public startSpace: Token | undefined,
        public selector: SelectorNode,
        public endSpace: Token | undefined,
        public source: string,
    ) {
        super();

        this.start = startSpace?.start || selector.start;
        this.end = endSpace?.end || selector.end;
    }

    public getTokens(): Token[] {
        return [this.startSpace, ...this.selector.getTokens(), this.endSpace].filter(
            Boolean,
        ) as Token[];
    }
}
