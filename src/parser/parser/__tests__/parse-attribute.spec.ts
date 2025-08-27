import { describe, expect, it } from 'vitest';

import { createToken, TokenType } from '../../lexer';
import { AttributeNode } from '../../nodes';
import { parseAttribute } from '../parser';

import { createPartialParser } from './utils';

const parse = createPartialParser(parseAttribute);

describe('parseAttribute', () => {
    it('success: simple attribute', () => {
        // Arrange
        const source = '@data-attr';

        // Act
        const ast = parse(source);

        // Assert
        expect(ast).toEqual(new AttributeNode(createToken(TokenType.Attribute, '@data-attr', 0)));
    });
});
