import { describe, expect, it } from 'vitest';

import { createToken, TokenType } from '../../lexer';
import { AttributeNode, CheckAttributeNode, ValueNode } from '../../nodes';
import { parseCheckAttribute } from '../parser';

import { createPartialParser } from './utils';

const parse = createPartialParser(parseCheckAttribute);

describe('parseCheckAttribute', () => {
    it('@a="x"', () => {
        // Arrange
        const source = '@a="x"';

        // Act
        const ast = parse(source);

        // Assert
        expect(ast).toEqual(
            new CheckAttributeNode(
                new AttributeNode(createToken(TokenType.Attribute, '@a', 0)),
                undefined,
                createToken(TokenType.Equal, '=', 2),
                undefined,
                new ValueNode(createToken(TokenType.StringLiteral, '"x"', 3)),
            ),
        );
    });
    it('@a = "x"', () => {
        // Arrange
        const source = '@a = "x"';

        // Act
        const ast = parse(source);

        // Assert
        expect(ast).toEqual(
            new CheckAttributeNode(
                new AttributeNode(createToken(TokenType.Attribute, '@a', 0)),
                createToken(TokenType.Space, ' ', 2),
                createToken(TokenType.Equal, '=', 3),
                createToken(TokenType.Space, ' ', 4),
                new ValueNode(createToken(TokenType.StringLiteral, '"x"', 5)),
            ),
        );
    });
});
