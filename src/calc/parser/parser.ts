import { analyzeCode, Token, TokenType } from '../lexer';
import { BinaryExpressionNode, RootNode, ValueNode } from '../nodes';

export function parse(source: string): RootNode {
    return parseTokens(analyzeCode(source), source);
}

export function parseTokens(tokens: Token[], source: string): RootNode {
    // так как дальше мы будем мутировать массив токенов, клонируем его
    tokens = [...tokens];

    const ctx = createContext(tokens);

    const root = new RootNode(parseBinaryExpression(ctx), source);

    if (!ctx.isEnd()) {
        throw new Error(`Unexpected token: "${ctx.getCurrentToken().text}"`);
    }

    return root;
}

interface Context {
    getCurrentToken(): Token;
    next(): void;
    isEnd(): boolean;
}

function createContext(tokens: Token[]): Context {
    let index = 0;
    return {
        getCurrentToken() {
            return tokens[index];
        },
        next() {
            index++;
        },
        isEnd(): boolean {
            return index >= tokens.length;
        },
    };
}

function parseBinaryExpression(ctx: Context, precedence = 0): BinaryExpressionNode | ValueNode {
    let left = parseValue(ctx);

    while (!ctx.isEnd()) {
        const operator = ctx.getCurrentToken();

        if (operator.type !== TokenType.Operation) {
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

function parseValue(ctx: Context): BinaryExpressionNode | ValueNode {
    const value = ctx.getCurrentToken();

    if (value.type === TokenType.NumericLiteral) {
        ctx.next();
        return new ValueNode(value);
    }

    throw new Error(`Expected value, got "${value.text}"`);
}

function getPrecedence(operator: Token): number {
    if (operator.type !== TokenType.Operation) {
        throw new Error(`Expected operator, got "${operator.text}"`);
    }

    switch (operator.text) {
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
            return 2;
        default:
            return 0;
    }
}
