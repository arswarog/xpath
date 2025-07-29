import { describe, expect, it } from 'vitest';

import { createToken } from '../create-token';
import { analyzeCode } from '../lexer';
import { TokenType } from '../types';

describe('Lexer', () => {
    it('должен вернуть пустой массив токенов для пустой строки', () => {
        expect(analyzeCode('')).toEqual([]);
    });
    describe('TokenTypes', () => {
        describe('DecimalValue', () => {
            it('1 char', () => {
                expect(analyzeCode('3')).toEqual([createToken(TokenType.NumericLiteral, '3', 0)]);
            });
            it('many chars', () => {
                expect(analyzeCode('1234567890')).toEqual([
                    createToken(TokenType.NumericLiteral, '1234567890', 0),
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
                    createToken(TokenType.NumericLiteral, '12', 0),
                    createToken(TokenType.UnknownSymbol, 'ΨΩ', 2),
                    createToken(TokenType.NumericLiteral, '3', 4),
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
            describe('PlusOperation', () => {
                it('10+900', () => {
                    expect(analyzeCode('10+900')).toEqual([
                        createToken(TokenType.NumericLiteral, '10', 0),
                        createToken(TokenType.PlusOperation, '+', 2),
                        createToken(TokenType.NumericLiteral, '900', 3),
                    ]);
                });
            });
            describe('MinusOperation', () => {
                it('118-3', () => {
                    expect(analyzeCode('118-3')).toEqual([
                        createToken(TokenType.NumericLiteral, '118', 0),
                        createToken(TokenType.MinusOperation, '-', 3),
                        createToken(TokenType.NumericLiteral, '3', 4),
                    ]);
                });
            });
            describe('MultiplyOperation', () => {
                it('2*3', () => {
                    expect(analyzeCode('2*3')).toEqual([
                        createToken(TokenType.NumericLiteral, '2', 0),
                        createToken(TokenType.MultiplyOperation, '*', 1),
                        createToken(TokenType.NumericLiteral, '3', 2),
                    ]);
                });
                it('2×5', () => {
                    expect(analyzeCode('2×5')).toEqual([
                        createToken(TokenType.NumericLiteral, '2', 0),
                        createToken(TokenType.MultiplyOperation, '×', 1),
                        createToken(TokenType.NumericLiteral, '5', 2),
                    ]);
                });
            });
            describe('DivideOperation', () => {
                it('1/2', () => {
                    expect(analyzeCode('1/2')).toEqual([
                        createToken(TokenType.NumericLiteral, '1', 0),
                        createToken(TokenType.DivideOperation, '/', 1),
                        createToken(TokenType.NumericLiteral, '2', 2),
                    ]);
                });
                it('1÷2', () => {
                    expect(analyzeCode('1÷2')).toEqual([
                        createToken(TokenType.NumericLiteral, '1', 0),
                        createToken(TokenType.DivideOperation, '÷', 1),
                        createToken(TokenType.NumericLiteral, '2', 2),
                    ]);
                });
            });
        });
        describe('time literals', () => {
            describe('HourLiteral', () => {
                it('1h', () => {
                    expect(analyzeCode('1h')).toEqual([
                        createToken(TokenType.NumericLiteral, '1', 0),
                        createToken(TokenType.HourLiteral, 'h', 1),
                    ]);
                });
                it('1H', () => {
                    expect(analyzeCode('1H')).toEqual([
                        createToken(TokenType.NumericLiteral, '1', 0),
                        createToken(TokenType.HourLiteral, 'H', 1),
                    ]);
                });
                it('1ч', () => {
                    expect(analyzeCode('1ч')).toEqual([
                        createToken(TokenType.NumericLiteral, '1', 0),
                        createToken(TokenType.HourLiteral, 'ч', 1),
                    ]);
                });
                it('1Ч', () => {
                    expect(analyzeCode('1Ч')).toEqual([
                        createToken(TokenType.NumericLiteral, '1', 0),
                        createToken(TokenType.HourLiteral, 'Ч', 1),
                    ]);
                });
            });
            describe('MinuteLiteral', () => {
                it('1m', () => {
                    expect(analyzeCode('1m')).toEqual([
                        createToken(TokenType.NumericLiteral, '1', 0),
                        createToken(TokenType.MinuteLiteral, 'm', 1),
                    ]);
                });
                it('1M', () => {
                    expect(analyzeCode('1M')).toEqual([
                        createToken(TokenType.NumericLiteral, '1', 0),
                        createToken(TokenType.MinuteLiteral, 'M', 1),
                    ]);
                });
                it('1м', () => {
                    expect(analyzeCode('1м')).toEqual([
                        createToken(TokenType.NumericLiteral, '1', 0),
                        createToken(TokenType.MinuteLiteral, 'м', 1),
                    ]);
                });
                it('1М', () => {
                    expect(analyzeCode('1М')).toEqual([
                        createToken(TokenType.NumericLiteral, '1', 0),
                        createToken(TokenType.MinuteLiteral, 'М', 1),
                    ]);
                });
            });
            describe('SecondLiteral', () => {
                it('1s', () => {
                    expect(analyzeCode('1s')).toEqual([
                        createToken(TokenType.NumericLiteral, '1', 0),
                        createToken(TokenType.SecondLiteral, 's', 1),
                    ]);
                });
                it('1S', () => {
                    expect(analyzeCode('1S')).toEqual([
                        createToken(TokenType.NumericLiteral, '1', 0),
                        createToken(TokenType.SecondLiteral, 'S', 1),
                    ]);
                });
                it('1с', () => {
                    expect(analyzeCode('1с')).toEqual([
                        createToken(TokenType.NumericLiteral, '1', 0),
                        createToken(TokenType.SecondLiteral, 'с', 1),
                    ]);
                });
                it('1С', () => {
                    expect(analyzeCode('1С')).toEqual([
                        createToken(TokenType.NumericLiteral, '1', 0),
                        createToken(TokenType.SecondLiteral, 'С', 1),
                    ]);
                });
            });
        });
    });
});
