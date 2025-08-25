import { HighlightedError, PositionalError } from '../common';
import { analyzeCode, Token, TokenType } from '../lexer';
import { AttributeNode, CheckAttributeNode, RootNode, ValueNode } from '../nodes';

import { createContext, ParserContext } from './context';
import { checkTokensOrder, checkUndefinedTokens } from './utils';

export function parse(source: string): RootNode {
    try {
        return parseTokens(analyzeCode(source), source);
    } catch (e) {
        if (e instanceof PositionalError) {
            throw new HighlightedError(e, source);
        } else {
            throw e;
        }
    }
}

export function parseTokens(tokens: Token[], source: string): RootNode {
    // так как дальше мы будем мутировать массив токенов, клонируем его
    tokens = [...tokens];

    const ctx = createContext(tokens);

    const root = new RootNode(parseCheckAttribute(ctx), source);

    if (!ctx.isEnd()) {
        throw new PositionalError(
            `Unexpected token "${ctx.getCurrentToken().text}" (${TokenType[ctx.getCurrentToken().type]})`,
            ctx.getCurrentToken(),
        );
    }

    const codeTokens = root.getTokens();

    checkUndefinedTokens(codeTokens);
    checkTokensOrder(codeTokens);

    return root;
}

export function parseCheckAttribute(ctx: ParserContext): CheckAttributeNode {
    if (ctx.getCurrentToken().type === TokenType.Space) {
        ctx.next();
    }

    const attribute = parseAttribute(ctx);

    const spaceBeforeOperator = ctx.getCurrentTokenIfTypeAndNext(TokenType.Space);

    const operator = ctx.getCurrentToken();

    if (![TokenType.Equal].includes(operator.type)) {
        throw new PositionalError(`Expected operator token, got ${operator.type}`, operator);
    }

    ctx.next();

    const spaceAfterOperator = ctx.getCurrentTokenIfTypeAndNext(TokenType.Space);

    const value = parseValue(ctx);

    return new CheckAttributeNode(
        attribute,
        spaceBeforeOperator,
        operator,
        spaceAfterOperator,
        value,
    );
}

export function parseValue(ctx: ParserContext): ValueNode {
    const value = ctx.getCurrentToken();

    if (value.type === TokenType.StringLiteral) {
        ctx.next();
        return new ValueNode(value);
    }

    throw new PositionalError(`Expected value token, got ${value.type}`, value);
}

export function parseAttribute(ctx: ParserContext): AttributeNode {
    const attr = ctx.getCurrentTokenOrDie(TokenType.Attribute, 'Failed to parse attribute');
    ctx.next();

    return new AttributeNode(attr);
}
