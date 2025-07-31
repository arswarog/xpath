import { AttributeNode } from '@src/parser';
import { ValueNode } from '@src/parser/nodes/value.ts';

import { Token } from '../lexer';

import { AbstractNode, NodeType } from './abstract';

export class CheckAttributeNode extends AbstractNode {
    public readonly type = NodeType.CheckAttribute;

    constructor(
        public attribute: AttributeNode,
        public spaceBeforeOperator: Token | undefined,
        public operator: Token,
        public spaceAfterOperator: Token | undefined,
        public value: ValueNode,
    ) {
        super();

        this.start = attribute.start;
        this.end = value.end;
    }

    public getTokens(): Token[] {
        return [
            ...this.attribute.getTokens(),
            this.spaceBeforeOperator!,
            this.operator,
            this.spaceAfterOperator!,
            ...this.value.getTokens(),
        ];
    }
}
