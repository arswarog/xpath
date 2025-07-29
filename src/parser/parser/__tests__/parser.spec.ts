import { describe, expect, it } from 'vitest';

import { HighlightedError, PositionalError } from '../../common/errors';
import { createToken, TokenType } from '../../lexer';
import { BinaryExpressionNode, RootNode, ValueNode } from '../../nodes';
import { parse } from '../parser';

describe('Parser', () => {
    describe('common', () => {
        it('12', () => {
            // Arrange
            const source = '12';

            // Act
            const ast = parse(source);

            // Assert
            expect(ast).toEqual(
                new RootNode(new ValueNode(createToken(TokenType.NumericLiteral, '12', 0)), source),
            );
        });
        it('12+34', () => {
            // Arrange
            const source = '12+34';

            // Act
            const ast = parse(source);

            // Assert
            expect(ast).toEqual(
                new RootNode(
                    new BinaryExpressionNode(
                        createToken(TokenType.PlusOperation, '+', 2),
                        new ValueNode(createToken(TokenType.NumericLiteral, '12', 0)),
                        new ValueNode(createToken(TokenType.NumericLiteral, '34', 3)),
                    ),
                    source,
                ),
            );
        });
        it('12-5+34', () => {
            // Arrange
            const source = '12-5+34';

            // Act
            const ast = parse(source);

            // Assert
            expect(ast).toEqual(
                new RootNode(
                    new BinaryExpressionNode(
                        createToken(TokenType.PlusOperation, '+', 4),
                        new BinaryExpressionNode(
                            createToken(TokenType.MinusOperation, '-', 2),
                            new ValueNode(createToken(TokenType.NumericLiteral, '12', 0)),
                            new ValueNode(createToken(TokenType.NumericLiteral, '5', 3)),
                        ),
                        new ValueNode(createToken(TokenType.NumericLiteral, '34', 5)),
                    ),
                    source,
                ),
            );
        });
        it('12×5+34', () => {
            // Arrange
            const source = '12×5+34';

            // Act
            const ast = parse(source);

            // Assert
            expect(ast).toEqual(
                new RootNode(
                    new BinaryExpressionNode(
                        createToken(TokenType.PlusOperation, '+', 4),
                        new BinaryExpressionNode(
                            createToken(TokenType.MultiplyOperation, '×', 2),
                            new ValueNode(createToken(TokenType.NumericLiteral, '12', 0)),
                            new ValueNode(createToken(TokenType.NumericLiteral, '5', 3)),
                        ),
                        new ValueNode(createToken(TokenType.NumericLiteral, '34', 5)),
                    ),
                    source,
                ),
            );
        });
        it('12+35/5', () => {
            // Arrange
            const source = '12+35/5';

            // Act
            const ast = parse(source);

            // Assert
            expect(ast).toEqual(
                new RootNode(
                    new BinaryExpressionNode(
                        createToken(TokenType.PlusOperation, '+', 2),
                        new ValueNode(createToken(TokenType.NumericLiteral, '12', 0)),
                        new BinaryExpressionNode(
                            createToken(TokenType.DivideOperation, '/', 5),
                            new ValueNode(createToken(TokenType.NumericLiteral, '35', 3)),
                            new ValueNode(createToken(TokenType.NumericLiteral, '5', 6)),
                        ),
                    ),
                    source,
                ),
            );
        });
        it('failed: expected value', () => {
            // Arrange
            const source = '12+35/x';

            // Act & Assert
            expect(() => parse(source)).toThrowError(
                new HighlightedError(
                    new PositionalError('Expected value, got "x"', {
                        start: 6,
                        end: 7,
                    }),
                    source,
                ),
            );
        });
        it('failed: unexpected token', () => {
            // Arrange
            const source = '12+35xx';

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
