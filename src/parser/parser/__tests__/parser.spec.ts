import { describe, expect, it } from 'vitest';

import { createToken, TokenType } from '../../lexer';
import {
    AttributeNode,
    CheckAttributeNode,
    LogicalExpressionNode,
    PredicateNode,
    RootNode,
    SelectorNode,
    ValueNode,
} from '../../nodes';
import { parse } from '../parser';

describe('Parser', () => {
    it('selector and predicate', () => {
        // Arrange
        const source = './/*[@data-attr="value" and @data-attr2="value2"]';

        // Act
        const ast = parse(source);

        // Assert
        expect(ast).toEqual(
            new RootNode(
                undefined,
                new SelectorNode(createToken(TokenType.SelectNode, './/*', 0), [
                    [
                        undefined,
                        new PredicateNode(
                            createToken(TokenType.OpeningSquareBracket, '[', 4),
                            undefined,
                            new LogicalExpressionNode(
                                new CheckAttributeNode(
                                    new AttributeNode(
                                        createToken(TokenType.Attribute, '@data-attr', 5),
                                    ),
                                    undefined,
                                    createToken(TokenType.Equal, '=', 15),
                                    undefined,
                                    new ValueNode(
                                        createToken(TokenType.StringLiteral, '"value"', 16),
                                    ),
                                ),
                                createToken(TokenType.Space, ' ', 23),
                                createToken(TokenType.And, 'and', 24),
                                createToken(TokenType.Space, ' ', 27),
                                new CheckAttributeNode(
                                    new AttributeNode(
                                        createToken(TokenType.Attribute, '@data-attr2', 28),
                                    ),
                                    undefined,
                                    createToken(TokenType.Equal, '=', 39),
                                    undefined,
                                    new ValueNode(
                                        createToken(TokenType.StringLiteral, '"value2"', 40),
                                    ),
                                ),
                            ),
                            undefined,
                            createToken(TokenType.ClosingSquareBracket, ']', 48),
                        ),
                    ],
                ]),
                undefined,
                source,
            ),
        );
    });
});
