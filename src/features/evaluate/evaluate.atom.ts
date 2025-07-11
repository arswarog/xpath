import { atom } from '@reatom/framework';

import { expressionAtom } from '@src/entities/expression';

import { parse } from './lib';

export const astAtom = atom((ctx) => {
    const expression = ctx.spy(expressionAtom);
    try {
        return parse(expression);
    } catch (_) {
        return null;
    }
}, 'astAtom');

export const evaluateAtom = atom((ctx) => {
    const ast = ctx.spy(astAtom);
    if (!ast) {
        return null;
    }
    try {
        return ast?.evaluate();
    } catch (_) {
        return null;
    }
}, 'evaluationAtom');

let lastResult: string = '';

export const resultAtom = atom((ctx) => {
    const evaluation = ctx.spy(evaluateAtom);
    if (evaluation === null) {
        return {
            result: lastResult,
            error: true,
        };
    }

    lastResult = evaluation.value.toString();
    return {
        result: lastResult,
        error: false,
    };
}, 'resultAtom');
