import { Token } from '../lexer';

export interface ParserContext {
    index: number;
    getCurrentToken(): Token;
    next(): void;
    isEnd(): boolean;
    getText(): string;
}

export function createContext(tokens: Token[]): ParserContext {
    let index = 0;
    return {
        get index() {
            return index;
        },
        getCurrentToken() {
            return tokens[index];
        },
        next() {
            index++;
        },
        isEnd(): boolean {
            return index >= tokens.length;
        },
        getText() {
            return tokens.map((t) => t.text).join('');
        },
    };
}
