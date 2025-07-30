import { ValueNode } from '@src/parser/nodes/value.ts';

import { HighlightedError, PositionalError } from '../common';
import { analyzeCode, Token, TokenType } from '../lexer';
import { AttributeNode, CheckAttributeNode, RootNode } from '../nodes';

import { createContext, ParserContext } from './context';

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
        //     throw new PositionalError(
        //         `Unexpected token "${ctx.getCurrentToken().text}" (${TokenType[ctx.getCurrentToken().type]})`,
        //         ctx.getCurrentToken(),
        //     );
    }

    return root;
}

function parseCheckAttribute(ctx: ParserContext): CheckAttributeNode {
    if (ctx.getCurrentToken().type === TokenType.Space) {
        ctx.next();
    }

    const attribute = parseAttribute(ctx);

    if (ctx.getCurrentToken().type === TokenType.Space) {
        ctx.next();
    }

    const operator = ctx.getCurrentToken();

    if (![TokenType.Equal].includes(operator.type)) {
        throw new PositionalError(`Expected operator token, got ${operator.type}`, operator);
    }

    ctx.next();

    if (ctx.getCurrentToken().type === TokenType.Space) {
        ctx.next();
    }

    const value = parseValue(ctx);

    return new CheckAttributeNode(attribute, undefined, operator, undefined, value);
}

function parseValue(ctx: ParserContext): ValueNode {
    const value = ctx.getCurrentToken();

    if (value.type === TokenType.StringLiteral) {
        ctx.next();
        return new ValueNode(value);
    }

    throw new PositionalError(`Expected value token, got ${value.type}`, value);
}

function parseAttribute(ctx: ParserContext): AttributeNode {
    const attr = ctx.getCurrentToken();

    if (attr.type === TokenType.Attribute) {
        ctx.next();
        return new AttributeNode(attr);
    }

    throw new PositionalError(`Expected attribute token, got ${attr.type}`, attr);
}
