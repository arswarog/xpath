import { useAtom } from '@reatom/npm-react';

import { astAtom, astParsingErrorAtom } from '@src/features/evaluate';
import { TokenizedCodeView } from '@src/features/tokenized-code-view';
import { ErrorView } from '@src/widgets/error-view';

export function CodePage() {
    const [ast] = useAtom(astAtom);
    const [error] = useAtom(astParsingErrorAtom);

    const tokens = ast?.getTokens() ?? [];

    return (
        <>
            {error && <ErrorView error={error} />}
            <TokenizedCodeView
                tokens={tokens}
                fontSize="1.2rem"
            />
        </>
    );
}
