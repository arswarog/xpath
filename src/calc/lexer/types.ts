export enum TokenType {
    UnknownSymbol,
    Space,
    DecimalValue,
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
