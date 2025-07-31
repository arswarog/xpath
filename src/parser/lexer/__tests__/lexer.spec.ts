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
    describe('String literals', () => {
        describe('single quote', () => {
            it('success', () => {
                expect(analyzeCode("'test'")).toEqual([
                    createToken(TokenType.StringLiteral, "'test'", 0),
                ]);
            });
            it('with spaces', () => {
                expect(analyzeCode("' test '")).toEqual([
                    createToken(TokenType.StringLiteral, "' test '", 0),
                ]);
            });
            it('with spaces and special chars', () => {
                expect(analyzeCode("' test \t'")).toEqual([
                    createToken(TokenType.StringLiteral, "' test \t'", 0),
                ]);
            });
            it('empty string', () => {
                expect(analyzeCode("''")).toEqual([
                    // только один токен
                    createToken(TokenType.StringLiteral, "''", 0),
                ]);
            });
            it('without closing quote', () => {
                expect(analyzeCode("'test")).toEqual([
                    createToken(TokenType.UnknownSymbol, "'test", 0),
                ]);
            });
            it.skip('with spaces and new line chars', () => {
                expect(analyzeCode("' test \n'")).toEqual([
                    createToken(TokenType.StringLiteral, "' test \n'", 0),
                ]);
            });
        });
        describe('double quote', () => {
            it('success', () => {
                expect(analyzeCode('"test"')).toEqual([
                    createToken(TokenType.StringLiteral, '"test"', 0),
                ]);
            });
            it('with spaces', () => {
                expect(analyzeCode('" test "')).toEqual([
                    createToken(TokenType.StringLiteral, '" test "', 0),
                ]);
            });
            it('with spaces and special chars', () => {
                expect(analyzeCode('" test \t"')).toEqual([
                    createToken(TokenType.StringLiteral, '" test \t"', 0),
                ]);
            });
            it('empty string', () => {
                expect(analyzeCode('""')).toEqual([
                    // только один токен
                    createToken(TokenType.StringLiteral, '""', 0),
                ]);
            });
            it('without closing quote', () => {
                expect(analyzeCode('"test')).toEqual([
                    createToken(TokenType.UnknownSymbol, '"test', 0),
                ]);
            });
            it.skip('with spaces and new line chars', () => {
                expect(analyzeCode('" test \n"')).toEqual([
                    createToken(TokenType.StringLiteral, '" test \n"', 0),
                ]);
            });
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
                createToken(TokenType.Method, 'data', 0),
                createToken(TokenType.Attribute, '@qa-type', 4),
            ]);
        });
        it('присвоение значения атрибуту', () => {
            expect(analyzeCode('@data-qa-type = "test"')).toEqual([
                createToken(TokenType.Attribute, '@data-qa-type', 0),
                createToken(TokenType.Space, ' ', 13),
                createToken(TokenType.Equal, '=', 14),
                createToken(TokenType.Space, ' ', 15),
                createToken(TokenType.StringLiteral, '"test"', 16),
            ]);
        });
    });
    describe('Select node', () => {
        it('.//*[', () => {
            expect(analyzeCode('.//*[')).toEqual([
                createToken(TokenType.SelectNode, './/*', 0),
                createToken(TokenType.OpeningSquareBracket, '[', 4),
            ]);
        });
        it('..//*[', () => {
            expect(analyzeCode('..//*[')).toEqual([
                createToken(TokenType.SelectNode, '..//*', 0),
                createToken(TokenType.OpeningSquareBracket, '[', 5),
            ]);
        });
        it('../descendant-or-self::*[', () => {
            expect(analyzeCode('../descendant-or-self::*[')).toEqual([
                createToken(TokenType.SelectNode, '../descendant-or-self::*', 0),
                createToken(TokenType.OpeningSquareBracket, '[', 24),
            ]);
        });
        it('following::*[', () => {
            expect(analyzeCode('following::*[')).toEqual([
                createToken(TokenType.SelectNode, 'following::*', 0),
                createToken(TokenType.OpeningSquareBracket, '[', 12),
            ]);
        });
        it('or ./descendant::*[', () => {
            expect(analyzeCode('or ./descendant::*[')).toEqual([
                createToken(TokenType.Or, 'or', 0),
                createToken(TokenType.Space, ' ', 2),
                createToken(TokenType.SelectNode, './descendant::*', 3),
                createToken(TokenType.OpeningSquareBracket, '[', 18),
            ]);
        });
        it.skip('[child::chapter/descendant::para [', () => {
            expect(analyzeCode('[child::chapter/descendant::para [')).toEqual([
                createToken(TokenType.OpeningSquareBracket, '[', 0),
                createToken(TokenType.UnknownSymbol, 'child::chapter/descendant::para', 1),
                createToken(TokenType.OpeningSquareBracket, '[', 36),
            ]);
        });
        it('translate(n', () => {
            expect(analyzeCode('translate(n')).toEqual([
                createToken(TokenType.Method, 'translate', 0),
                createToken(TokenType.OpeningRoundBracket, '(', 9),
                createToken(TokenType.Method, 'n', 10),
            ]);
        });
        it('[translate(@value', () => {
            expect(analyzeCode('[translate(@value')).toEqual([
                createToken(TokenType.OpeningSquareBracket, '[', 0),
                createToken(TokenType.Method, 'translate', 1),
                createToken(TokenType.OpeningRoundBracket, '(', 10),
                createToken(TokenType.Attribute, '@value', 11),
            ]);
        });
    });
});
