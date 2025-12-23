import { Token } from '../lexer';

export function skipUndefinedToken(token: Token | undefined): token is Token {
    return token !== undefined;
}
