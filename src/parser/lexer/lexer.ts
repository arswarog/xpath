import { createToken } from './create-token';
import { TokenDeclaration, tokenDeclarations } from './tokens';
import { Token, TokenType } from './types';

const unknownSymbol: TokenDeclaration = {
    type: TokenType.UnknownSymbol,
    chars: /.*/,
    check: () => true,
    finalCheck: () => true,
};

export function analyzeCode(code: string): Token[] {
    const tokens: Token[] = [];

    if (!code.length) {
        return tokens;
    }

    let index = 0;
    let buffer = '';
    let possibleTokens: TokenDeclaration[] = [];

    function reset() {
        buffer = '';
        possibleTokens = tokenDeclarations;
    }

    reset();

    do {
        const char = code[index] || '';

        if (!char && !buffer) {
            break;
        }

        const nextPossibleTokens = filterPossibleTokens(char, buffer + char, possibleTokens);

        if (nextPossibleTokens.length === 0 && !buffer) {
            tokens.push(createToken(TokenType.UnknownSymbol, char, index));
            reset();

            index++;

            continue;
        }

        if (nextPossibleTokens.length && char) {
            possibleTokens = nextPossibleTokens;
            buffer += char;
            index++;

            continue;
        }

        const actualTokens = possibleTokens.filter(({ check }) => {
            if (!check) {
                return true;
            }

            if (isRegExp(check)) {
                return check.test(buffer);
            }

            return check(buffer);
        });

        console.log({ char, buffer, possibleTokens, actualTokens });

        if (actualTokens.length === 0) {
            tokens.push(createToken(TokenType.UnknownSymbol, buffer, index - buffer.length));
            reset();
            continue;
        }

        if (actualTokens.length > 1) {
            throw new Error('Multiple tokens found');
        }

        const { type, finalCheck } = actualTokens[0];

        if (!finalCheck || finalCheck(buffer)) {
            tokens.push(createToken(type, buffer, index - buffer.length));
        } else {
            tokens.push(createToken(TokenType.UnknownSymbol, buffer, index - buffer.length));
        }

        reset();
    } while (index <= code.length);

    return tokens;
}

function filterPossibleTokens(
    char: string,
    buffer: string,
    list: TokenDeclaration[],
): TokenDeclaration[] {
    return list
        .filter(({ chars }) => {
            if (char && typeof chars === 'string') {
                if (chars.includes(char)) {
                    return true;
                }
            }

            if (isRegExp(chars)) {
                if (chars.test(char)) {
                    return true;
                }
            }
        })
        .filter(({ check }) => {
            if (!check) {
                return true;
            }

            if (isRegExp(check)) {
                return check.test(buffer);
            }

            return check(buffer);
        });
}

function isRegExp(value: unknown): value is RegExp {
    return value instanceof RegExp;
}
