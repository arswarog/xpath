import { useAtom } from '@reatom/npm-react';

import { expressionAtom } from '@src/entities/expression';
import { tokensAtom } from '@src/features/evaluate';
import { TokenizedCodeView } from '@src/widgets/tokenized-code-view';

export function HighlightPage() {
    const [tokens] = useAtom(tokensAtom);
    const [expression] = useAtom(expressionAtom);

    return (
        <TokenizedCodeView
            tokens={tokens}
            originalCode={expression}
        />
    );
}
