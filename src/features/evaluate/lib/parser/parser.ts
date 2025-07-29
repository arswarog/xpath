import { HighlightedError, PositionalError } from '../common';
import { analyzeCode, Token, TokenType } from '../lexer';
import { BinaryExpressionNode, RootNode, ValueNode } from '../nodes';

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

    const root = new RootNode(parseBinaryExpression(ctx), source);

    if (!ctx.isEnd()) {
        throw new PositionalError(
            `Unexpected token "${ctx.getCurrentToken().text}" (${TokenType[ctx.getCurrentToken().type]})`,
            ctx.getCurrentToken(),
        );
    }

    return root;
}

function parseBinaryExpression(
    ctx: ParserContext,
    precedence = 0,
): BinaryExpressionNode | ValueNode {
    let left = parseValue(ctx);

    while (!ctx.isEnd()) {
        const operator = ctx.getCurrentToken();

        if (
            ![
                TokenType.PlusOperation,
                TokenType.MinusOperation,
                TokenType.MultiplyOperation,
                TokenType.DivideOperation,
            ].includes(operator.type)
        ) {
            break;
        }

        const operatorPrecedence = getPrecedence(operator);
        if (operatorPrecedence < precedence) break;

        ctx.next();

        const right = parseBinaryExpression(ctx, operatorPrecedence + 1);

        left = new BinaryExpressionNode(operator, left, right);
    }

    return left;
}

function parseValue(ctx: ParserContext): BinaryExpressionNode | ValueNode {
    const value = ctx.getCurrentToken();

    if (value.type === TokenType.NumericLiteral) {
        ctx.next();
        return new ValueNode(value);
    }

    throw new PositionalError(`Expected value, got "${value.text}"`, ctx.getCurrentToken());
}

function getPrecedence(operator: Token): number {
    switch (operator.type) {
        case TokenType.PlusOperation:
        case TokenType.MinusOperation:
            return 1;
        case TokenType.MultiplyOperation:
        case TokenType.DivideOperation:
            return 2;
        default:
            throw new Error(`Expected operation, got "${operator.type}"`);
    }
}
