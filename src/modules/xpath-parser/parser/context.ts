import { PositionalError } from '../common';
import { Token, TokenType } from '../lexer';

export interface ParserContext {
    index: number;
    getCurrentToken(): Token;
    getCurrentTokenIfTypeAndNext(type: TokenType): Token | undefined;
    getCurrentTokenOrDie(type: TokenType, errorMessage: string): Token;
    next(steps?: number): void;
    isEnd(): boolean;
    getText(): string;
    getNext(delta?: number): Token;
    getNextOrDie(type: TokenType, errorMessage: string, delta?: number): Token;
    checkNext(type: TokenType, delta?: number): boolean;
}

export function createContext(tokens: Token[]): ParserContext {
    let index = 0;

    const eofToken = createEofToken(tokens);

    function next(steps = 1) {
        index += steps;
    }

    function getCurrentToken() {
        return tokens[index] || eofToken;
    }

    function getNext(delta = 1): Token {
        return tokens[index + delta] || eofToken;
    }

    function getNextOrDie(type: TokenType, errorMessage: string, delta = 1) {
        const token = getNext(delta);

        if (token.type === type) {
            return token;
        }

        throw new PositionalError(
            `${errorMessage}\nExpected token ${TokenType[type]}, got ${TokenType[token.type]}`,
            {
                start: token.start,
                end: token.end,
            },
        );
    }

    return {
        get index() {
            return index;
        },
        getCurrentToken,
        getCurrentTokenIfTypeAndNext(type: TokenType): Token | undefined {
            const token = getCurrentToken();

            if (token.type !== type) {
                return undefined;
            }

            next();

            return token;
        },
        getCurrentTokenOrDie(type: TokenType, errorMessage: string) {
            return getNextOrDie(type, errorMessage, 0);
        },
        next,
        isEnd(): boolean {
            return index >= tokens.length;
        },
        getText() {
            return tokens.map((t) => t.text).join('');
        },
        getNext,
        getNextOrDie,
        checkNext(type: TokenType, delta = 1): boolean {
            return getNext(delta).type === type;
        },
    };
}

function createEofToken(tokens: Token[]): Token {
    const lastToken = tokens[tokens.length - 1];

    if (!lastToken) {
        return {
            start: 0,
            end: 0,
            text: '[EOF]',
            type: TokenType.EndOfFile,
        };
    }

    return {
        type: TokenType.EndOfFile,
        start: lastToken.end,
        end: lastToken.end,
        text: '[EOF]',
    };
}
