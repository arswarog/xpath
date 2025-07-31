import { useAction, useAtom } from '@reatom/npm-react';

import { changeExpressionAction } from '@src/entities/expression';

import { screenAtom } from './atom';
import { XPathEditorComponent } from './component';

export function XPathEditor() {
    const [data] = useAtom(screenAtom);

    const handleChange = useAction(changeExpressionAction);

    return (
        <XPathEditorComponent
            data={data}
            onChange={handleChange}
        />
    );
}
