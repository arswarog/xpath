import { describe, expect, it } from 'vitest';

import { createToken, TokenType } from '../../lexer';
import { AttributeNode, CheckAttributeNode, LogicalExpressionNode, ValueNode } from '../../nodes';
import { parseLogicalExpression } from '../parser';

import { createPartialParser } from './utils';

const parse = createPartialParser(parseLogicalExpression);

describe('parseLogicalExpression', () => {
    it('only CheckAttributeNode', () => {
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
    it('a AND b', () => {
        // Arrange
        const source = '@a="x" and @b="y"';

        // Act
        const ast = parse(source);

        // Assert
        expect(ast).toEqual(
            new LogicalExpressionNode(
                new CheckAttributeNode(
                    new AttributeNode(createToken(TokenType.Attribute, '@a', 0)),
                    undefined,
                    createToken(TokenType.Equal, '=', 2),
                    undefined,
                    new ValueNode(createToken(TokenType.StringLiteral, '"x"', 3)),
                ),
                createToken(TokenType.Space, ' ', 6),
                createToken(TokenType.And, 'and', 7),
                createToken(TokenType.Space, ' ', 10),
                new CheckAttributeNode(
                    new AttributeNode(createToken(TokenType.Attribute, '@b', 11)),
                    undefined,
                    createToken(TokenType.Equal, '=', 13),
                    undefined,
                    new ValueNode(createToken(TokenType.StringLiteral, '"y"', 14)),
                ),
            ),
        );
    });
    it('a OR b', () => {
        // Arrange
        const source = '@a="x" or  @b="y"';

        // Act
        const ast = parse(source);

        // Assert
        expect(ast).toEqual(
            new LogicalExpressionNode(
                new CheckAttributeNode(
                    new AttributeNode(createToken(TokenType.Attribute, '@a', 0)),
                    undefined,
                    createToken(TokenType.Equal, '=', 2),
                    undefined,
                    new ValueNode(createToken(TokenType.StringLiteral, '"x"', 3)),
                ),
                createToken(TokenType.Space, ' ', 6),
                createToken(TokenType.Or, 'or', 7),
                createToken(TokenType.Space, '  ', 9),
                new CheckAttributeNode(
                    new AttributeNode(createToken(TokenType.Attribute, '@b', 11)),
                    undefined,
                    createToken(TokenType.Equal, '=', 13),
                    undefined,
                    new ValueNode(createToken(TokenType.StringLiteral, '"y"', 14)),
                ),
            ),
        );
    });
    it('a OR b AND c', () => {
        // Arrange
        const source = '@a="x" or @b="y" and @c="z"';

        // Act
        const ast = parse(source);

        // Assert
        expect(ast).toEqual(
            new LogicalExpressionNode(
                new CheckAttributeNode(
                    new AttributeNode(createToken(TokenType.Attribute, '@a', 0)),
                    undefined,
                    createToken(TokenType.Equal, '=', 2),
                    undefined,
                    new ValueNode(createToken(TokenType.StringLiteral, '"x"', 3)),
                ),
                createToken(TokenType.Space, ' ', 6),
                createToken(TokenType.Or, 'or', 7),
                createToken(TokenType.Space, ' ', 9),
                new LogicalExpressionNode(
                    new CheckAttributeNode(
                        new AttributeNode(createToken(TokenType.Attribute, '@b', 10)),
                        undefined,
                        createToken(TokenType.Equal, '=', 12),
                        undefined,
                        new ValueNode(createToken(TokenType.StringLiteral, '"y"', 13)),
                    ),
                    createToken(TokenType.Space, ' ', 16),
                    createToken(TokenType.And, 'and', 17),
                    createToken(TokenType.Space, ' ', 20),
                    new CheckAttributeNode(
                        new AttributeNode(createToken(TokenType.Attribute, '@c', 21)),
                        undefined,
                        createToken(TokenType.Equal, '=', 23),
                        undefined,
                        new ValueNode(createToken(TokenType.StringLiteral, '"z"', 24)),
                    ),
                ),
            ),
        );
    });
    it('a AND b OR c', () => {
        // Arrange
        const source = '@a="x" and @b="y" or @c="z"';

        // Act
        const ast = parse(source);

        // Assert
        expect(ast).toEqual(
            new LogicalExpressionNode(
                new LogicalExpressionNode(
                    new CheckAttributeNode(
                        new AttributeNode(createToken(TokenType.Attribute, '@a', 0)),
                        undefined,
                        createToken(TokenType.Equal, '=', 2),
                        undefined,
                        new ValueNode(createToken(TokenType.StringLiteral, '"x"', 3)),
                    ),
                    createToken(TokenType.Space, ' ', 6),
                    createToken(TokenType.And, 'and', 7),
                    createToken(TokenType.Space, ' ', 10),
                    new CheckAttributeNode(
                        new AttributeNode(createToken(TokenType.Attribute, '@b', 11)),
                        undefined,
                        createToken(TokenType.Equal, '=', 13),
                        undefined,
                        new ValueNode(createToken(TokenType.StringLiteral, '"y"', 14)),
                    ),
                ),
                createToken(TokenType.Space, ' ', 17),
                createToken(TokenType.Or, 'or', 18),
                createToken(TokenType.Space, ' ', 20),
                new CheckAttributeNode(
                    new AttributeNode(createToken(TokenType.Attribute, '@c', 21)),
                    undefined,
                    createToken(TokenType.Equal, '=', 23),
                    undefined,
                    new ValueNode(createToken(TokenType.StringLiteral, '"z"', 24)),
                ),
            ),
        );
    });
    it('a AND b OR c AND d', () => {
        // Arrange
        const source = '@a="x" and @b="y" or @c="z" and @d="w"';

        // Act
        const ast = parse(source);

        // Assert
        expect(ast).toEqual(
            new LogicalExpressionNode(
                new LogicalExpressionNode(
                    new CheckAttributeNode(
                        new AttributeNode(createToken(TokenType.Attribute, '@a', 0)),
                        undefined,
                        createToken(TokenType.Equal, '=', 2),
                        undefined,
                        new ValueNode(createToken(TokenType.StringLiteral, '"x"', 3)),
                    ),
                    createToken(TokenType.Space, ' ', 6),
                    createToken(TokenType.And, 'and', 7),
                    createToken(TokenType.Space, ' ', 10),
                    new CheckAttributeNode(
                        new AttributeNode(createToken(TokenType.Attribute, '@b', 11)),
                        undefined,
                        createToken(TokenType.Equal, '=', 13),
                        undefined,
                        new ValueNode(createToken(TokenType.StringLiteral, '"y"', 14)),
                    ),
                ),
                createToken(TokenType.Space, ' ', 17),
                createToken(TokenType.Or, 'or', 18),
                createToken(TokenType.Space, ' ', 20),
                new LogicalExpressionNode(
                    new CheckAttributeNode(
                        new AttributeNode(createToken(TokenType.Attribute, '@c', 21)),
                        undefined,
                        createToken(TokenType.Equal, '=', 23),
                        undefined,
                        new ValueNode(createToken(TokenType.StringLiteral, '"z"', 24)),
                    ),
                    createToken(TokenType.Space, ' ', 27),
                    createToken(TokenType.And, 'and', 28),
                    createToken(TokenType.Space, ' ', 31),
                    new CheckAttributeNode(
                        new AttributeNode(createToken(TokenType.Attribute, '@d', 32)),
                        undefined,
                        createToken(TokenType.Equal, '=', 34),
                        undefined,
                        new ValueNode(createToken(TokenType.StringLiteral, '"w"', 35)),
                    ),
                ),
            ),
        );
    });
    it('a AND b AND c OR d', () => {
        // Arrange
        const source = '@a="x" and @b="y" and @c="z" or @d="w"';

        // Act
        const ast = parse(source);

        // Assert
        expect(ast).toEqual(
            new LogicalExpressionNode(
                new LogicalExpressionNode(
                    new LogicalExpressionNode(
                        new CheckAttributeNode(
                            new AttributeNode(createToken(TokenType.Attribute, '@a', 0)),
                            undefined,
                            createToken(TokenType.Equal, '=', 2),
                            undefined,
                            new ValueNode(createToken(TokenType.StringLiteral, '"x"', 3)),
                        ),
                        createToken(TokenType.Space, ' ', 6),
                        createToken(TokenType.And, 'and', 7),
                        createToken(TokenType.Space, ' ', 10),
                        new CheckAttributeNode(
                            new AttributeNode(createToken(TokenType.Attribute, '@b', 11)),
                            undefined,
                            createToken(TokenType.Equal, '=', 13),
                            undefined,
                            new ValueNode(createToken(TokenType.StringLiteral, '"y"', 14)),
                        ),
                    ),
                    createToken(TokenType.Space, ' ', 17),
                    createToken(TokenType.And, 'and', 18),
                    createToken(TokenType.Space, ' ', 21),
                    new CheckAttributeNode(
                        new AttributeNode(createToken(TokenType.Attribute, '@c', 22)),
                        undefined,
                        createToken(TokenType.Equal, '=', 24),
                        undefined,
                        new ValueNode(createToken(TokenType.StringLiteral, '"z"', 25)),
                    ),
                ),
                createToken(TokenType.Space, ' ', 28),
                createToken(TokenType.Or, 'or', 29),
                createToken(TokenType.Space, ' ', 31),
                new CheckAttributeNode(
                    new AttributeNode(createToken(TokenType.Attribute, '@d', 32)),
                    undefined,
                    createToken(TokenType.Equal, '=', 34),
                    undefined,
                    new ValueNode(createToken(TokenType.StringLiteral, '"w"', 35)),
                ),
            ),
        );
    });
});
