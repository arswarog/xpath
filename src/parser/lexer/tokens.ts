import { TokenType } from './types';

export interface TokenDeclaration {
    type: TokenType;
    // все символы, которые могут быть в токене
    chars: string | RegExp;
    // проверка частичного совпадения строки
    check?: RegExp | ((text: string) => boolean);
    // финальная проверка
    finalCheck?: RegExp | ((text: string) => boolean);
    // каждый символ этого типа - отдельный токен
    single?: boolean;
}

export const tokenDeclarations: TokenDeclaration[] = [
    {
        type: TokenType.EndOfFile,
        chars: /.*/,
        check: (str) => !str,
    },
    {
        type: TokenType.Space,
        chars: ' ',
    },
    {
        type: TokenType.OpeningSquareBracket,
        chars: '[',
        single: true,
    },
    {
        type: TokenType.ClosingSquareBracket,
        chars: ']',
        single: true,
    },
    {
        type: TokenType.OpeningRoundBracket,
        chars: '(',
        single: true,
    },
    {
        type: TokenType.ClosingRoundBracket,
        chars: ')',
        single: true,
    },
    {
        type: TokenType.Equal,
        chars: '=',
        single: true,
    },
    {
        type: TokenType.Asterisk,
        chars: '*',
        single: true,
    },
    {
        type: TokenType.Attribute,
        chars: /^[@\w+-]$/,
        check: /^@\w?[\w+-]*$/,
        finalCheck: /^@\w[\w+-]+$/,
    },
];
