import { describe, expect, it } from 'vitest';

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
                        new ValueNode(createToken(TokenType.NumericLiteral, '34', 6)),
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
                        new ValueNode(createToken(TokenType.NumericLiteral, '34', 6)),
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
            const source = '12+35/d';

            // Act & Assert
            expect(() => parse(source)).toThrowError(/Expected value, got "d"/);
        });
        it('failed: unexpected token', () => {
            // Arrange
            const source = '12+35d';

            // Act & Assert
            expect(() => parse(source)).toThrowError(/Unexpected token: "d"/);
        });
    });
});
