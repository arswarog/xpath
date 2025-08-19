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

    public getTokens() {
        const tokens = [this.startSpace, ...this.selector.getTokens(), this.endSpace].filter(
            Boolean,
        ) as Token[];

        // проверить что нет undefined в tokens
        if (tokens.some((token) => token === undefined)) {
            throw new Error('RootNode.getTokens: undefined in tokens');
        }

        // проверить что start и end идут по порядку
        for (let i = 0; i < tokens.length - 1; i++) {
            if (tokens[i].end > tokens[i + 1].start) {
                throw new Error('RootNode.getTokens: tokens are not in order');
            }
        }

        return tokens;
    }
}
