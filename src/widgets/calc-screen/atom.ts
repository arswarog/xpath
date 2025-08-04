import { atom } from '@reatom/framework';

import { expressionAtom } from '@src/entities/expression';

export interface ScreenAtom {
    code: string;
}

export const screenAtom = atom<ScreenAtom>((ctx) => {
    const code = ctx.spy(expressionAtom);

    return {
        code,
    };
});
