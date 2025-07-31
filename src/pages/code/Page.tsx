import { useAtom } from '@reatom/npm-react';

import { expressionAtom } from '@src/entities/expression';
import { astAtom, astParsingErrorAtom } from '@src/features/evaluate';
import { ErrorView } from '@src/widgets/error-view';
import { TokenizedCodeView } from '@src/widgets/tokenized-code-view';

export function CodePage() {
    const [ast] = useAtom(astAtom);
    const [error] = useAtom(astParsingErrorAtom);
    const [expression] = useAtom(expressionAtom);

    const tokens = ast?.getTokens() ?? [];

    return (
        <>
            {error && <ErrorView error={error} />}
            <TokenizedCodeView
                tokens={tokens}
                originalCode={expression}
            />
        </>
    );
}
