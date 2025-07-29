import { createToken } from './create-token';
import { TokenDeclaration, tokenDeclarations } from './tokens';
import { Token, TokenType } from './types';

export function analyzeCode(code: string): Token[] {
    const tokens: Token[] = [];

    if (!code.length) {
        return tokens;
    }

    let index = 0;
    let buffer = '';
    let tokenType = TokenType.UnknownSymbol;

    do {
        const char = code[index];
        const { type, single } = getCharType(char);

        if (!buffer.length) {
            buffer = char;
            tokenType = type;
            index++;

            if (single) {
                tokens.push(createToken(tokenType, char, index - 1));
                buffer = '';
                tokenType = TokenType.UnknownSymbol;
            }

            continue;
        }

        if (type === tokenType) {
            buffer += char;
            index++;
            continue;
        }

        tokens.push(createToken(tokenType, buffer, index - buffer.length));
        buffer = '';
        tokenType = TokenType.UnknownSymbol;
    } while (index < code.length);

    if (buffer.length) {
        tokens.push(createToken(tokenType, buffer, index - buffer.length));
    }

    return tokens;
}

function getCharType(char: string): TokenDeclaration {
    for (const data of tokenDeclarations) {
        const { chars } = data;
        if (typeof chars === 'string') {
            if (chars.includes(char)) {
                return data;
            }
        }

        if (isRegExp(chars)) {
            if (chars.test(char)) {
                return data;
            }
        }
    }

    return {
        type: TokenType.UnknownSymbol,
        chars: '',
    };
}

function isRegExp(value: string | RegExp): value is RegExp {
    return value instanceof RegExp;
}
