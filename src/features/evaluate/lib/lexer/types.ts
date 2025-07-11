export enum TokenType {
    UnknownSymbol,
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

export interface Positionable {
    start: number;
    end: number;
    fullEnd: number;
}

export interface Token extends Positionable {
    type: TokenType;
    text: string;
}
