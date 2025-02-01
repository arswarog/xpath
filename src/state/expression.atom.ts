import { action, atom } from '@reatom/framework';
export const expressionAtom = atom('0', 'expressionAtom');

export const changeExpressionAction = action(
    (ctx, value: string) => expressionAtom(ctx, value),
    'onChange',
);

export const pressKeyAction = action((ctx, key: string) => {
    const expression = ctx.get(expressionAtom);
    const newValue = expression === '0' ? key : expression + key;
    return expressionAtom(ctx, newValue);
});
