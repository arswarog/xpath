import { TokenType } from './types';

export interface TokenDeclaration {
    type: TokenType;
    chars: string;
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
    },
    {
        type: TokenType.MinusOperation,
        chars: '-',
    },
    {
        type: TokenType.MultiplyOperation,
        chars: '*×',
    },
    {
        type: TokenType.DivideOperation,
        chars: '/÷',
    },
    {
        type: TokenType.HourLiteral,
        chars: 'hHчЧ',
    },
    {
        type: TokenType.MinuteLiteral,
        chars: 'mMмМ',
    },
    {
        type: TokenType.SecondLiteral,
        chars: 'sSсС',
    },
];
