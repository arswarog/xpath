import { useAction, useAtom } from '@reatom/npm-react';

import { changeExpressionAction, expressionAtom } from '@src/entities/expression';
import { astParsingErrorAtom, tokensAtom } from '@src/features/evaluate';

import { XPathEditorComponent } from './component.tsx';

export function XPathEditor() {
    const [code] = useAtom(expressionAtom);
    const [error] = useAtom(astParsingErrorAtom);
    const [tokens] = useAtom(tokensAtom);

    const handleChange = useAction(changeExpressionAction);

    return (
        <XPathEditorComponent
            code={code}
            tokens={tokens}
            error={error?.error}
            onChange={handleChange}
        />
    );
}
