import { TokenType } from './types';

export interface TokenDeclaration {
    type: TokenType;
    chars: string;
    // каждый символ этого типа - отдельный токен
    single?: boolean;
}

export const tokenDeclarations: TokenDeclaration[] = [
    {
        type: TokenType.Space,
        chars: ' ',
    },
    {
        type: TokenType.NumericLiteral,
        chars: '0123456789',
    },
    {
        type: TokenType.PlusOperation,
        chars: '+',
        single: true,
    },
    {
        type: TokenType.MinusOperation,
        chars: '-',
        single: true,
    },
    {
        type: TokenType.MultiplyOperation,
        chars: '*×',
        single: true,
    },
    {
        type: TokenType.DivideOperation,
        chars: '/÷',
        single: true,
    },
    {
        type: TokenType.HourLiteral,
        chars: 'hHчЧ',
        single: true,
    },
    {
        type: TokenType.MinuteLiteral,
        chars: 'mMмМ',
        single: true,
    },
    {
        type: TokenType.SecondLiteral,
        chars: 'sSсС',
        single: true,
    },
];
