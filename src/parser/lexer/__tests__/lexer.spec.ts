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
});
