export enum TokenType {
    UnknownSymbol,
    Space,
    NumericLiteral,
    Operation,
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
