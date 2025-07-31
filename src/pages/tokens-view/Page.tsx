import { useAtom } from '@reatom/npm-react';

import { tokensAtom } from '@src/features/evaluate';
import { TokensView } from '@src/widgets/tokens-view';

export function TokensViewPage() {
    const [tokens] = useAtom(tokensAtom);

    return <TokensView tokens={tokens} />;
}
