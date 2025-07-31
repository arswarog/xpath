import { describe, expect, it } from 'vitest';

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
                                createToken(TokenType.OpeningSquareBracket, '[', 4),
                                undefined,
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
                                undefined,
                                createToken(TokenType.ClosingSquareBracket, ']', 23),
                            ),
                        ],
                    ]),
                    undefined,
                    source,
                ),
            );
        });
    });
});
