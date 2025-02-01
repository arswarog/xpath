import { action, atom } from '@reatom/framework';

import { ButtonCode } from '../types';
export const expressionAtom = atom('0', 'expressionAtom');

export const changeExpressionAction = action(
    (ctx, value: string) => expressionAtom(ctx, value),
    'onChange',
);

export const pressKeyAction = action((ctx, key: string) => {
    const expression = ctx.get(expressionAtom);

    if (key === ButtonCode.Backspace) {
        const newValue = expression.slice(0, -1);

        return expressionAtom(ctx, newValue || '0');
    }
    if (key === ButtonCode.Enter) {
        return;
    }
    if (key === ButtonCode.Clear) {
        return expressionAtom(ctx, '0');
    }

    const newValue = expression === '0' ? key : expression + key;

    return expressionAtom(ctx, newValue);
});
