import { Positionable } from '../common';

export enum TokenType {
    UnknownSymbol = -1,
    EndOfFile = 0,
    Space,
    NumericLiteral,
    PlusOperation,
    MinusOperation,
    MultiplyOperation,
    DivideOperation,
    HourLiteral,
    MinuteLiteral,
    SecondLiteral,
}

export interface Token extends Positionable {
    type: TokenType;
    text: string;
}
