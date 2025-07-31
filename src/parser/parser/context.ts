import { PositionalError } from '../common';
import { Token, TokenType } from '../lexer';

export interface ParserContext {
    index: number;
    getCurrentToken(): Token;
    getCurrentTokenIfTypeAndNext(type: TokenType): Token | undefined;
    getCurrentTokenOrDie(type: TokenType): Token;
    next(): void;
    isEnd(): boolean;
    getText(): string;
}

export function createContext(tokens: Token[]): ParserContext {
    let index = 0;

    const eofToken = createEofToken(tokens);

    function next() {
        index++;
    }

    function getCurrentToken() {
        return tokens[index] || eofToken;
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
        getCurrentTokenOrDie(type: TokenType) {
            const token = getCurrentToken();

            if (token.type === type) {
                return token;
            }

            throw new PositionalError(
                `Expected token ${TokenType[type]}, got ${TokenType[token.type]}`,
                {
                    start: token.start,
                    end: token.end,
                },
            );
        },
        next,
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
