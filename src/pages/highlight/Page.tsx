import { useAtom } from '@reatom/npm-react';

import { tokensAtom } from '@src/features/evaluate';
import { TokenizedCodeView } from '@src/widgets/tokenized-code-view';

export function HighlightPage() {
    const [tokens] = useAtom(tokensAtom);

    return <TokenizedCodeView tokens={tokens} />;
}
