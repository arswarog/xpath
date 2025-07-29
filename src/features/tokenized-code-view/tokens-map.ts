import { TokenType } from '@src/parser';
import { SyntaxTheme, SyntaxThemeItem } from '@src/shared/syntax-theme';

export const tokensMap: { [key in TokenType]: SyntaxThemeItem } = {
    [TokenType.UnknownSymbol]: SyntaxTheme.Error,
    [TokenType.EndOfFile]: SyntaxTheme.Regular,
    [TokenType.Space]: SyntaxTheme.Regular,
    [TokenType.OpeningSquareBracket]: SyntaxTheme.Regular,
    [TokenType.ClosingSquareBracket]: SyntaxTheme.Regular,
    [TokenType.OpeningRoundBracket]: SyntaxTheme.Regular,
    [TokenType.ClosingRoundBracket]: SyntaxTheme.Regular,
    [TokenType.Equal]: SyntaxTheme.Operator,
    [TokenType.Asterisk]: SyntaxTheme.Operator,
};
