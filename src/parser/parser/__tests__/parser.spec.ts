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
        const source = './/*[@data-attr="value" and @data-attr2="value2" or @data-attr3="value3"]';

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
                                createToken(TokenType.Space, ' ', 48),
                                createToken(TokenType.Or, 'or', 49),
                                createToken(TokenType.Space, ' ', 51),
                                new CheckAttributeNode(
                                    new AttributeNode(
                                        createToken(TokenType.Attribute, '@data-attr3', 52),
                                    ),
                                    undefined,
                                    createToken(TokenType.Equal, '=', 63),
                                    undefined,
                                    new ValueNode(
                                        createToken(TokenType.StringLiteral, '"value3"', 64),
                                    ),
                                ),
                            ),
                            undefined,
                            createToken(TokenType.ClosingSquareBracket, ']', 72),
                        ),
                    ],
                ]),
                undefined,
                source,
            ),
        );
    });
    // it('logical expressions', () => {
    //     // Arrange
    //     const source = [
    //         './/*[(@data-attr="value" or @data-attr2',
    //         '="value2")  and @data-attr3="value3"]',
    //     ].join('\n');
    //
    //     // Act
    //     const ast = parse(source);
    //
    //     // Assert
    //     expect(ast).toEqual(
    //         new RootNode(
    //             undefined,
    //             new SelectorNode(createToken(TokenType.SelectNode, './/*', 0), [
    //                 [
    //                     undefined,
    //                     new PredicateNode(
    //                         createToken(TokenType.OpeningSquareBracket, '[', 4),
    //                         undefined,
    //                         new CheckAttributeNode(
    //                             new AttributeNode(
    //                                 createToken(TokenType.Attribute, '@data-attr', 5),
    //                             ),
    //                             undefined,
    //                             createToken(TokenType.Equal, '=', 15),
    //                             undefined,
    //                             new ValueNode(createToken(TokenType.StringLiteral, '"value"', 16)),
    //                         ),
    //                         undefined,
    //                         createToken(TokenType.ClosingSquareBracket, ']', 23),
    //                     ),
    //                 ],
    //             ]),
    //             undefined,
    //             source,
    //         ),
    //     );
    // });
});
