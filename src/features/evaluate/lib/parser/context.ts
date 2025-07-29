import { Token, TokenType } from '../lexer';

export interface ParserContext {
    index: number;
    getCurrentToken(): Token;
    next(): void;
    isEnd(): boolean;
    getText(): string;
}

export function createContext(tokens: Token[]): ParserContext {
    let index = 0;

    const eofToken = createEofToken(tokens);

    return {
        get index() {
            return index;
        },
        getCurrentToken() {
            return tokens[index] || eofToken;
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

function createEofToken(tokens: Token[]): Token {
    const lastToken = tokens[tokens.length - 1];

    if (!lastToken)
        return {
            start: 0,
            end: 0,
            text: '[EOF]',
            type: TokenType.EndOfFile,
        };

    return {
        type: TokenType.EndOfFile,
        start: lastToken.end,
        end: lastToken.end,
        text: '[EOF]',
    };
}
