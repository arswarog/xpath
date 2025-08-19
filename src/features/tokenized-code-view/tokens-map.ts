import { TokenType } from '@src/parser';
import { SyntaxTheme, SyntaxThemeItem } from '@src/shared/syntax-theme';

export const tokensMap: { [key in TokenType]: SyntaxThemeItem } = {
    [TokenType.UnknownSymbol]: SyntaxTheme.Error,
    [TokenType.EndOfFile]: SyntaxTheme.Regular,
    [TokenType.Space]: SyntaxTheme.Regular,
    [TokenType.NumericLiteral]: SyntaxTheme.Number,
    [TokenType.PlusOperation]: SyntaxTheme.Operator,
    [TokenType.MinusOperation]: SyntaxTheme.Operator,
    [TokenType.MultiplyOperation]: SyntaxTheme.Operator,
    [TokenType.DivideOperation]: SyntaxTheme.Operator,
    [TokenType.HourLiteral]: SyntaxTheme.Number,
    [TokenType.MinuteLiteral]: SyntaxTheme.Number,
    [TokenType.SecondLiteral]: SyntaxTheme.Number,
};
