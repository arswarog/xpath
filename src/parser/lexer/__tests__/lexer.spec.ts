import { describe, expect, it } from 'vitest';

import { createToken } from '../create-token';
import { analyzeCode } from '../lexer';
import { TokenType } from '../types';

describe('Lexer', () => {
    it('должен вернуть пустой массив токенов для пустой строки', () => {
        expect(analyzeCode('')).toEqual([]);
    });
    describe('Spaces', () => {
        it('1 space', () => {
            expect(analyzeCode(' ')).toEqual([createToken(TokenType.Space, ' ', 0)]);
        });
        it('many spaces', () => {
            expect(analyzeCode('   ')).toEqual([createToken(TokenType.Space, '   ', 0)]);
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
            expect(analyzeCode('[ΨΩ]Θ')).toEqual([
                createToken(TokenType.OpeningSquareBracket, '[', 0),
                createToken(TokenType.UnknownSymbol, 'ΨΩ', 1),
                createToken(TokenType.ClosingSquareBracket, ']', 3),
                createToken(TokenType.UnknownSymbol, 'Θ', 4),
            ]);
        });
    });
    describe('Single tokens', () => {
        it('каждый символ генерирует отдельный токен в начале выражения', () => {
            expect(analyzeCode('[[')).toEqual([
                createToken(TokenType.OpeningSquareBracket, '[', 0),
                createToken(TokenType.OpeningSquareBracket, '[', 1),
            ]);
        });
        it('каждый символ генерирует отдельный токен в середине выражения', () => {
            expect(analyzeCode('[((')).toEqual([
                createToken(TokenType.OpeningSquareBracket, '[', 0),
                createToken(TokenType.OpeningRoundBracket, '(', 1),
                createToken(TokenType.OpeningRoundBracket, '(', 2),
            ]);
        });
    });
    describe('Attributes', () => {
        it('single data attribute', () => {
            expect(analyzeCode('@data-qa-type')).toEqual([
                createToken(TokenType.Attribute, '@data-qa-type', 0),
            ]);
        });
        it('attribute with value', () => {
            expect(analyzeCode('@data-qa-type = *')).toEqual([
                createToken(TokenType.Attribute, '@data-qa-type', 0),
                createToken(TokenType.Space, ' ', 13),
                createToken(TokenType.Equal, '=', 14),
                createToken(TokenType.Space, ' ', 15),
                createToken(TokenType.Asterisk, '*', 16),
            ]);
        });
        it('not char after @', () => {
            expect(analyzeCode('@-qa-type=@data-x')).toEqual([
                createToken(TokenType.UnknownSymbol, '@-qa-type', 0),
                createToken(TokenType.Equal, '=', 9),
                createToken(TokenType.Attribute, '@data-x', 10),
            ]);
        });
        it('attribute not starting with @', () => {
            expect(analyzeCode('data@qa-type')).toEqual([
                createToken(TokenType.UnknownSymbol, 'data', 0),
                createToken(TokenType.Attribute, '@qa-type', 4),
            ]);
        });
        it('not char after @', () => {
            expect(analyzeCode('@-qa-type')).toEqual([
                createToken(TokenType.UnknownSymbol, '@', 0),
                createToken(TokenType.Attribute, '@qa-type', 4),
            ]);
        });
        it('присвоение значения атрибуту', () => {
            expect(analyzeCode('@data-qa-type = "test"')).toEqual([
                createToken(TokenType.Attribute, '@data-qa-type', 0),
                createToken(TokenType.Space, ' ', 13),
                createToken(TokenType.Equal, '=', 14),
                createToken(TokenType.Space, ' ', 15),
                createToken(TokenType.UnknownSymbol, '"test"', 16),
            ]);
        });
    });
});
