import { useAction, useAtom } from '@reatom/npm-react';

import { changeExpressionAction, displayAtom } from '../state';

import { Display } from './Display';

export function DisplayWidget() {
    const [data] = useAtom(displayAtom);

    const handleChange = useAction(changeExpressionAction);

    return (
        <Display
            data={data}
            onChange={handleChange}
        />
    );
}
