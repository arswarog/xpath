import { Token, TokenType } from './types.ts';

export function createToken(type: TokenType, text: string, position: number): Token {
    return {
        type,
        text,
        start: position,
        end: position + text.length,
        fullEnd: position + text.length,
    };
}
