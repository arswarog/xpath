import { HighlightedError, PositionalError } from '../common';
import { analyzeCode, Token, TokenType } from '../lexer';
import {
    AttributeNode,
    BracketedExpressionNode,
    CheckAttributeNode,
    LogicalExpressionNode,
    PredicateNode,
    RootNode,
    SelectorNode,
    ValueNode,
} from '../nodes';

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

    const startSpace = ctx.getCurrentTokenIfTypeAndNext(TokenType.Space);
    const selector = parseSelector(ctx);
    const endSpace = ctx.getCurrentTokenIfTypeAndNext(TokenType.Space);

    const root = new RootNode(startSpace, selector, endSpace, source);

    if (!ctx.isEnd()) {
        //     throw new PositionalError(
        //         `Unexpected token "${ctx.getCurrentToken().text}" (${TokenType[ctx.getCurrentToken().type]})`,
        //         ctx.getCurrentToken(),
        //     );
    }

    const codeTokens = root.getTokens();

    checkUndefinedTokens(codeTokens);
    checkTokensOrder(codeTokens);

    return root;
}

function parseSelector(ctx: ParserContext): SelectorNode {
    const selectNode = parseSelectNode(ctx);

    const spaceBeforePredicate = ctx.getCurrentTokenIfTypeAndNext(TokenType.Space);
    const predicate = parsePredicate(ctx);

    return new SelectorNode(selectNode, [[spaceBeforePredicate, predicate]]);
}

function parseSelectNode(ctx: ParserContext): Token {
    const token = ctx.getCurrentTokenOrDie(TokenType.SelectNode, 'Failed to parse node');
    ctx.next();
    return token;
}

function parsePredicate(ctx: ParserContext): PredicateNode {
    const open = ctx.getCurrentTokenOrDie(
        TokenType.OpeningSquareBracket,
        'Failed to parse predicate',
    );
    ctx.next();

    const spaceAfterOpen = ctx.getCurrentTokenIfTypeAndNext(TokenType.Space);

    const expression = parseBracketedExpression(ctx);

    const spaceBeforeClose = ctx.getCurrentTokenIfTypeAndNext(TokenType.Space);

    const close = ctx.getCurrentTokenOrDie(
        TokenType.ClosingSquareBracket,
        'Failed to parse predicate',
    );
    ctx.next();

    return new PredicateNode(open, spaceAfterOpen, expression, spaceBeforeClose, close);
}

export function parseBracketedExpression(
    ctx: ParserContext,
): BracketedExpressionNode | CheckAttributeNode | LogicalExpressionNode {
    if (ctx.getCurrentToken().type !== TokenType.OpeningRoundBracket) {
        return parseLogicalExpression(ctx);
    }

    const openingBracket = ctx.getCurrentTokenOrDie(
        TokenType.OpeningRoundBracket,
        'Failed to parse bracketed expression',
    );
    ctx.next();

    const spaceBeforeExpression = ctx.getCurrentTokenIfTypeAndNext(TokenType.Space);

    const expression = parseBracketedExpression(ctx);

    const spaceAfterExpression = ctx.getCurrentTokenIfTypeAndNext(TokenType.Space);

    const closingBracket = ctx.getCurrentTokenOrDie(
        TokenType.ClosingRoundBracket,
        'Failed to parse bracketed expression',
    );
    ctx.next();

    return new BracketedExpressionNode(
        openingBracket,
        spaceBeforeExpression,
        expression,
        spaceAfterExpression,
        closingBracket,
    );
}

export function parseLogicalExpression(
    ctx: ParserContext,
    precedence = 0,
): LogicalExpressionNode | CheckAttributeNode {
    let left: CheckAttributeNode | LogicalExpressionNode = parseCheckAttribute(ctx);

    if (!ctx.checkNext(TokenType.Space, 0)) {
        return left;
    }

    while (!ctx.isEnd()) {
        const spaceBeforeOperator = ctx.getNext(0);

        const operator = ctx.getNext();

        if (![TokenType.And, TokenType.Or].includes(operator.type)) {
            break;
        }

        const operatorPrecedence = getPrecedence(operator);
        if (operatorPrecedence < precedence) {
            break;
        }

        const spaceAfterOperator = ctx.getNextOrDie(
            TokenType.Space,
            'Failed to parse logical expression, expected space after operator',
            2,
        );

        ctx.next(3);

        const right = parseLogicalExpression(ctx, operatorPrecedence + 1);

        left = new LogicalExpressionNode(
            left,
            spaceBeforeOperator,
            operator,
            spaceAfterOperator,
            right,
        );
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
