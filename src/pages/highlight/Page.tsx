import { useAtom } from '@reatom/npm-react';

import { expressionAtom } from '@src/entities/expression';
import { tokensAtom } from '@src/features/evaluate';
import { TokenizedCodeWidget } from '@src/widgets/tokenized-code-widget';

export function HighlightPage() {
    const [tokens] = useAtom(tokensAtom);
    const [expression] = useAtom(expressionAtom);

    return (
        <TokenizedCodeWidget
            tokens={tokens}
            originalCode={expression}
        />
    );
}
