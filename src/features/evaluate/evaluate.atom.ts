import { atom } from '@reatom/framework';

import { expressionAtom } from '@src/entities/expression';
import { analyzeCode, HighlightedError, parse, PositionalError } from '@src/modules/xpath-parser';

export const astParsingErrorAtom = atom<HighlightedError | null>(null, 'astParsingErrorAtom');

export const tokensAtom = atom((ctx) => {
    const expression = ctx.spy(expressionAtom);

    return analyzeCode(expression);
}, 'tokensAtom');

export const astAtom = atom((ctx) => {
    const expression = ctx.spy(expressionAtom);
    try {
        const ast = parse(expression);
        astParsingErrorAtom(ctx, null);
        return ast;
    } catch (error) {
        if (error instanceof HighlightedError) {
            astParsingErrorAtom(ctx, error);
        } else {
            astParsingErrorAtom(
                ctx,
                new HighlightedError(
                    new PositionalError(
                        error &&
                        typeof error === 'object' &&
                        'message' in error &&
                        typeof error.message === 'string'
                            ? error.message
                            : 'Unknown error',
                        {
                            start: 0,
                            end: expression.length,
                        },
                    ),
                    expression,
                ),
            );
            console.error(error);
        }
        return null;
    }
}, 'astAtom');
