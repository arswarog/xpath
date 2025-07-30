import { describe, expect, it } from 'vitest';

import { analyzeCode } from '../lexer';
import { createContext } from '../parser';

import { HighlightedError, PositionalError } from './errors';

describe('Errors', () => {
    describe('PositionalError', () => {
        it('в середине выражения', () => {
            expect(() => {
                throw new PositionalError('Unexpected token', { start: 3, end: 4 });
            }).throws('Unexpected token at position 3');
        });
    });
    describe('HighlightedError', () => {
        it('в середине выражения', () => {
            const error = new PositionalError('Unexpected token', { start: 4, end: 6 });

            expect(() => {
                throw new HighlightedError(error, '1 + 23 + 5');
            }).throws(
                [
                    'Unexpected token',
                    // Подсвечивает ошибку
                    'Line: 1 + 23 + 5',
                    '          ~~',
                ].join('\n'),
            );
        });
        it('в первом символе', () => {
            const error = new PositionalError('Unexpected token', { start: 0, end: 2 });

            expect(() => {
                throw new HighlightedError(error, '12 + 3 + 5');
            }).throws(
                [
                    'Unexpected token',
                    // Подсвечивает ошибку
                    'Line: 12 + 3 + 5',
                    '      ~~',
                ].join('\n'),
            );
        });
        it('end of file', () => {
            const error = new PositionalError('Unexpected end of file', {
                start: 3,
                end: 3,
            });

            expect(() => {
                throw new HighlightedError(error, '1 +');
            }).throws(
                [
                    'Unexpected end of file',
                    // Подсвечивает ошибку
                    'Line: 1 +',
                    '         ~',
                ].join('\n'),
            );
        });
        describe('многострочный код', () => {
            it('ошибка в середине строки', () => {
                const error = new PositionalError('Unexpected token', { start: 15, end: 17 });

                expect(() => {
                    throw new HighlightedError(error, '1 + 23 + 5\n1 + 23 + 5\n1 + 23 + 5');
                }).throws(
                    [
                        'Unexpected token',
                        // Подсвечивает ошибку
                        'Line: 1 + 23 + 5',
                        'Line: 1 + 23 + 5',
                        '          ~~',
                        'Line: 1 + 23 + 5',
                    ].join('\n'),
                );
            });
            it('ошибка на несколько строк', () => {
                const error = new PositionalError('Unexpected token', { start: 10, end: 19 });

                expect(() => {
                    throw new HighlightedError(
                        error,
                        'const a = 10;\nconst b = 20;\nconst c = a + b;',
                    );
                }).throws(
                    [
                        'Unexpected token',
                        'Line: const a = 10;',
                        '                ~~~',
                        'Line: const b = 20;',
                        '      ~~~~~',
                        'Line: const c = a + b;',
                        '',
                    ].join('\n'),
                );
            });
        });
    });
    describe('Практическое использование', () => {
        it('ошибка из токена', () => {
            const source = '1 + 23 + 5';
            const tokens = analyzeCode(source);
            const ctx = createContext(tokens);

            ctx.next();
            ctx.next();
            ctx.next();
            ctx.next();

            const error = new PositionalError('Unexpected token', ctx.getCurrentToken());

            expect(() => {
                throw new HighlightedError(error, source);
            }).throws(
                [
                    'Unexpected token',
                    // Подсвечивает ошибку
                    'Line: 1 + 23 + 5',
                    '          ~~',
                ].join('\n'),
            );
        });
    });
});
