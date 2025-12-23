import { ReactNode } from 'react';

import { Token, TokenType } from '@src/modules/xpath-parser';

import { SyntaxTheme, SyntaxThemeItem } from '../../syntax-theme';

const tokensMap: { [key in TokenType]: SyntaxThemeItem } = {
    [TokenType.UnknownSymbol]: SyntaxTheme.Error,
    [TokenType.EndOfFile]: SyntaxTheme.Regular,
    [TokenType.Space]: SyntaxTheme.Regular,
    [TokenType.Comma]: SyntaxTheme.Regular,
    [TokenType.OpeningSquareBracket]: SyntaxTheme.Regular,
    [TokenType.ClosingSquareBracket]: SyntaxTheme.Regular,
    [TokenType.OpeningRoundBracket]: SyntaxTheme.Regular,
    [TokenType.ClosingRoundBracket]: SyntaxTheme.Regular,
    [TokenType.Equal]: SyntaxTheme.Operator,
    [TokenType.Asterisk]: SyntaxTheme.Operator,
    [TokenType.Attribute]: SyntaxTheme.Constant,
    [TokenType.StringLiteral]: SyntaxTheme.String,
    [TokenType.And]: SyntaxTheme.Keyword,
    [TokenType.Or]: SyntaxTheme.Keyword,
    [TokenType.SelectNode]: SyntaxTheme.Keyword,
    [TokenType.Method]: SyntaxTheme.Method,
};

export type ViewTokenFn = (token: Token, key: number | string) => ReactNode;

export const viewToken: ViewTokenFn = (token, key) => {
    const Component = tokensMap[token.type];

    return <Component key={key}>{token.text}</Component>;
};
