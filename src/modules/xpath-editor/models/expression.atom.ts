import { action, atom } from '@reatom/framework';

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
