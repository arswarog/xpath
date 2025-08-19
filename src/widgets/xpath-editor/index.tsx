import { useAction, useAtom } from '@reatom/npm-react';

import { changeExpressionAction, expressionAtom } from '@src/entities/expression';
import { tokensAtom } from '@src/features/evaluate';

import { XPathEditorComponent } from './component.tsx';

export function XPathEditor() {
    const [code] = useAtom(expressionAtom);
    const [tokens] = useAtom(tokensAtom);

    const handleChange = useAction(changeExpressionAction);

    return (
        <XPathEditorComponent
            code={code}
            tokens={tokens}
            onChange={handleChange}
        />
    );
}
