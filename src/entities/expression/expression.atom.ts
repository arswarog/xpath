import { action, atom } from '@reatom/framework';

import { ButtonCode } from '@src/entities/keyboard';

import { storage } from './storage';

const defaultExpression = './/*';

export const expressionAtom = atom(
    storage.getItem('expression') ?? defaultExpression,
    'expressionAtom',
);

export const changeExpressionAction = action((ctx, value: string) => {
    storage.setItem('expression', value);
    return expressionAtom(ctx, value);
}, 'onChange');

export const pressKeyAction = action((ctx, key: string) => {
    const expression = ctx.get(expressionAtom);

    if (key === ButtonCode.Backspace) {
        const newValue = expression.slice(0, -1);

        return expressionAtom(ctx, newValue || defaultExpression);
    }
    if (key === ButtonCode.Enter) {
        return;
    }
    if (key === ButtonCode.Clear) {
        return expressionAtom(ctx, defaultExpression);
    }

    const newValue = expression === defaultExpression ? key : expression + key;

    return expressionAtom(ctx, newValue);
});
