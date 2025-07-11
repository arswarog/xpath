import { useAction, useAtom } from '@reatom/npm-react';

import { changeExpressionAction } from '@src/entities/expression';

import { screenAtom } from './atom';
import { ScreenComponent } from './component';

export function Screen() {
    const [data] = useAtom(screenAtom);

    const handleChange = useAction(changeExpressionAction);

    return (
        <ScreenComponent
            data={data}
            onChange={handleChange}
        />
    );
}
