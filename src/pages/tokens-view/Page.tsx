import { useAtom } from '@reatom/npm-react';

import { tokensAtom, TokensView } from '@src/modules/xpath-editor';

export function TokensViewPage() {
    const [tokens] = useAtom(tokensAtom);

    return <TokensView tokens={tokens} />;
}
