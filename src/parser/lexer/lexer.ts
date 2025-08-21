import { PositionalError } from '@src/parser';

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
            insertUnknownSymbol(tokens, char, index + 1);
            reset();

            index++;

            continue;
        }

        if (!buffer) {
            const possibleSingleCharTokens = nextPossibleTokens.filter(({ single }) => single);

            if (possibleSingleCharTokens.length > 1) {
                throw new Error(`Multiple possible single char tokens for char "${char}"`);
            }

            if (possibleSingleCharTokens.length === 1) {
                tokens.push(createToken(possibleSingleCharTokens[0].type, char, index));
                reset();
                index++;

                continue;
            }
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

        if (actualTokens.length === 0) {
            insertUnknownSymbol(tokens, buffer, index);
            reset();
            throw new Error('No possible tokens found');
        }

        if (actualTokens.length === 0) {
            throw new PositionalError('No possible tokens found twice', {
                start: index - buffer.length,
                end: index,
            });
        }

        let completeTokens = actualTokens.filter(({ finalCheck }) => {
            if (!finalCheck) {
                return true;
            }

            return finalCheck(buffer);
        });

        if (completeTokens.length === 0) {
            insertUnknownSymbol(tokens, buffer, index);

            reset();

            continue;
        }

        if (completeTokens.length > 1) {
            completeTokens = completeTokens.filter(({ constString }) => constString);
        }

        if (completeTokens.length > 1) {
            throw new PositionalError('Multiple tokens found', {
                start: index - buffer.length,
                end: index,
            });
        }

        const { type } = completeTokens[0];

        tokens.push(createToken(type, buffer, index - buffer.length));

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

function insertUnknownSymbol(tokens: Token[], buffer: string, index: number) {
    const lastToken = tokens[tokens.length - 1];

    if (!lastToken || lastToken.type !== TokenType.UnknownSymbol) {
        return tokens.push(createToken(TokenType.UnknownSymbol, buffer, index - buffer.length));
    }

    lastToken.text += buffer;
    lastToken.end = index;
}
