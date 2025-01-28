import { describe, expect, it } from 'vitest';
import { analyzeCode } from '../lexer';
import { createToken } from '../create-token';
import { TokenType } from '../types';

describe('Lexer', () => {
    it('должен вернуть пустой массив токенов для пустой строки', () => {
        expect(analyzeCode('')).toEqual([]);
    });
    describe('TokenTypes', () => {
        describe('DecimalValue', () => {
            it('1 char', () => {
                expect(analyzeCode('3')).toEqual([createToken(TokenType.DecimalValue, '3', 0)]);
            });
            it('many chars', () => {
                expect(analyzeCode('1234567890')).toEqual([
                    createToken(TokenType.DecimalValue, '1234567890', 0),
                ]);
            });
        });
        describe('UnknownSymbol', () => {
            it('1 char', () => {
                expect(analyzeCode('Θ')).toEqual([createToken(TokenType.UnknownSymbol, 'Θ', 0)]);
            });
            it('many chars', () => {
                expect(analyzeCode('ΨΩ')).toEqual([createToken(TokenType.UnknownSymbol, 'ΨΩ', 0)]);
            });
            it('mixed', () => {
                expect(analyzeCode('12ΨΩ3Θ')).toEqual([
                    createToken(TokenType.DecimalValue, '12', 0),
                    createToken(TokenType.UnknownSymbol, 'ΨΩ', 2),
                    createToken(TokenType.DecimalValue, '3', 4),
                    createToken(TokenType.UnknownSymbol, 'Θ', 5),
                ]);
            });
        });
        describe('Space', () => {
            it('1 space', () => {
                expect(analyzeCode(' ')).toEqual([createToken(TokenType.Space, ' ', 0)]);
            });
            it('many spaces', () => {
                expect(analyzeCode('   ')).toEqual([createToken(TokenType.Space, '   ', 0)]);
            });
        });
        describe('Operations', () => {
            it('10 + 900', () => {
                expect(analyzeCode('10 + 900')).toEqual([
                    createToken(TokenType.DecimalValue, '10', 0),
                    createToken(TokenType.Space, ' ', 2),
                    createToken(TokenType.Operation, '+', 3),
                    createToken(TokenType.Space, ' ', 4),
                    createToken(TokenType.DecimalValue, '900', 5),
                ]);
            });
        });
    });
});
