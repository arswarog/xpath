import { TokenType } from './types';

export interface TokenDeclaration {
    type: TokenType;
    // все символы, которые могут быть в токене
    chars: string | RegExp;
    // проверка частичного совпадения строки
    check?: RegExp | ((text: string) => boolean);
    // финальная проверка
    finalCheck?: (text: string) => boolean;
    // каждый символ этого типа - отдельный токен
    single?: boolean;
}

export const tokenDeclarations: TokenDeclaration[] = [
    {
        type: TokenType.Space,
        chars: ' \n\t',
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
        finalCheck: (str) => /^@\w[\w+-]+$/.test(str),
    },
    {
        type: TokenType.StringLiteral,
        chars: /./,
        check: /^'[^']*'?$/m,
        finalCheck: (str) => /^'[^']*'$/m.test(str),
    },
    {
        type: TokenType.StringLiteral,
        chars: /./,
        check: /^"[^"]*"?$/m,
        finalCheck: (str) => /^"[^"]*"$/m.test(str),
    },
    {
        type: TokenType.And,
        chars: 'and',
        check: /^an?d?$/,
        finalCheck: (str) => str === 'and',
    },
    {
        type: TokenType.Or,
        chars: 'or',
        check: /^or?$/,
        finalCheck: (str) => str === 'or',
    },
    {
        type: TokenType.SelectNode,
        chars: /[.*/]/,
        check: /^\.\.?\/?\/?\*?$/,
        finalCheck: (str) => ['.//*', '..//*'].includes(str),
    },
];
