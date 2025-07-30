import { Positionable } from '../common';

export enum TokenType {
    UnknownSymbol = -1,
    EndOfFile = 0,
    Space,
    OpeningSquareBracket, // символ '['
    ClosingSquareBracket, // символ ']'
    OpeningRoundBracket, // символ '('
    ClosingRoundBracket, // символ ')'
    Equal, // символ '='
    Asterisk, // символ '*'
    Attribute,
    StringLiteral,
    And,
    Or,
}

export interface Token extends Positionable {
    type: TokenType;
    text: string;
}
