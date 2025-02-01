import { atom } from '@reatom/framework';

import { parse } from '../calc/parser';

import { expressionAtom } from './expression.atom';

export const evaluationAtom = atom((ctx) => {
    const expression = ctx.spy(expressionAtom);
    try {
        const root = parse(expression);
        return root.evaluate();
    } catch (_) {
        return null;
    }
}, 'evaluationAtom');

export interface ResultAtom {
    result: string;
    error: boolean;
}

let lastResult: string = '';

export const resultAtom = atom((ctx) => {
    const evaluation = ctx.spy(evaluationAtom);
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
