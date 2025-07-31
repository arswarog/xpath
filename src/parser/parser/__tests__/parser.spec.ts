import { describe, expect, it } from 'vitest';

import { HighlightedError, PositionalError } from '../../common';
import { createToken, TokenType } from '../../lexer';
import {
    AttributeNode,
    CheckAttributeNode,
    PredicateNode,
    RootNode,
    SelectorNode,
    ValueNode,
} from '../../nodes';
import { parse } from '../parser';

describe('Parser', () => {
    describe('XPath', () => {
        it('selector and predicate', () => {
            // Arrange
            const source = './/*[@data-attr="value"]';

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
                                createToken(TokenType.OpeningSquareBracket, '[', 5),
                                undefined,
                                new CheckAttributeNode(
                                    new AttributeNode(
                                        createToken(TokenType.Attribute, '@data-attr', 6),
                                    ),
                                    undefined,
                                    createToken(TokenType.Equal, '=', 14),
                                    undefined,
                                    new ValueNode(
                                        createToken(TokenType.StringLiteral, '"value"', 16),
                                    ),
                                ),
                                undefined,
                                createToken(TokenType.ClosingSquareBracket, ']', 16),
                            ),
                        ],
                    ]),
                    undefined,
                    source,
                ),
            );
        });
    });
    describe('Attribute', () => {
        it('success: simple attribute', () => {
            // Arrange
            const source = '@data-attr';

            // Act
            const ast = parse(source);

            // Assert
            expect(ast).toEqual(
                new RootNode(
                    new AttributeNode(createToken(TokenType.Attribute, '@data-attr', 0)),
                    source,
                ),
            );
        });
        it('failed: unexpected token', () => {
            // Arrange
            const source = '@data-attr 123';

            // Act & Assert
            expect(() => parse(source)).toThrowError(
                new HighlightedError(
                    new PositionalError('Unexpected token "xx" (UnknownSymbol)', {
                        start: 5,
                        end: 7,
                    }),
                    source,
                ),
            );
        });
        it('failed: unexpected end of file', () => {
            // Arrange
            const source = '12+35/';

            // Act & Assert
            expect(() => parse(source)).toThrowError(
                new HighlightedError(
                    new PositionalError('Expected value, got "[EOF]"', {
                        start: 6,
                        end: 6,
                    }),
                    source,
                ),
            );
        });
    });
});
