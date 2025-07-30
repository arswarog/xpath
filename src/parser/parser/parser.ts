import { ValueNode } from '@src/parser/nodes/value.ts';

import { HighlightedError, PositionalError } from '../common';
import { analyzeCode, Token, TokenType } from '../lexer';
import { AttributeNode, CheckAttributeNode, LogicalExpressionNode, RootNode } from '../nodes';

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

    const root = new RootNode(parseLogicalExpression(ctx), source);

    if (!ctx.isEnd()) {
        //     throw new PositionalError(
        //         `Unexpected token "${ctx.getCurrentToken().text}" (${TokenType[ctx.getCurrentToken().type]})`,
        //         ctx.getCurrentToken(),
        //     );
    }

    return root;
}

function parseLogicalExpression(
    ctx: ParserContext,
    precedence = 0,
): LogicalExpressionNode | CheckAttributeNode {
    if (ctx.getCurrentToken().type === TokenType.Space) {
        ctx.next();
    }

    let left: CheckAttributeNode | LogicalExpressionNode = parseCheckAttribute(ctx);

    if (ctx.getCurrentToken().type === TokenType.Space) {
        ctx.next();
    }

    while (!ctx.isEnd()) {
        const operator = ctx.getCurrentToken();

        if (![TokenType.And, TokenType.Or].includes(operator.type)) {
            break;
        }

        const operatorPrecedence = getPrecedence(operator);
        if (operatorPrecedence < precedence) {
            break;
        }

        ctx.next();

        if (ctx.getCurrentToken().type === TokenType.Space) {
            ctx.next();
        }

        const right = parseLogicalExpression(ctx, operatorPrecedence + 1);

        left = new LogicalExpressionNode(left, undefined, operator, undefined, right);
    }

    return left;
}

function getPrecedence(operator: Token): number {
    switch (operator.type) {
        case TokenType.Or:
            return 1;
        case TokenType.And:
            return 2;
        default:
            throw new Error(`Expected operation, got "${operator.type}"`);
    }
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
