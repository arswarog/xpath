import { PositionalError } from '../common';
import { Token } from '../lexer';

export function checkUndefinedTokens(tokens: Token[]): void {
    const firstUndefinedTokenIndex = tokens.findIndex((token) => token === undefined);

    if (firstUndefinedTokenIndex === -1) {
        return;
    }

    const start = tokens[firstUndefinedTokenIndex - 1]?.end || 0;

    throw new PositionalError('RootNode.getTokens: undefined in tokens', {
        start,
        end: start + 1,
    });
}

export function checkTokensOrder(tokens: Token[]): void {
    // проверить что start и end идут по порядку
    for (let i = 0; i < tokens.length - 1; i++) {
        if (tokens[i].end > tokens[i + 1].start) {
            throw new PositionalError('checkTokensOrder: tokens are not in order', {
                start: tokens[i].end,
                end: tokens[i].end + 1,
            });
        }
    }
}
