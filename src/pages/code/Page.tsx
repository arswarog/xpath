import { useAtom } from '@reatom/npm-react';

import { expressionAtom } from '@src/entities/expression';
import { astAtom, astParsingErrorAtom } from '@src/features/evaluate';
import { ErrorView } from '@src/widgets/error-view';
import { TokenizedCodeWidget } from '@src/widgets/tokenized-code-widget';

export function CodePage() {
    const [expression] = useAtom(expressionAtom);
    const [ast] = useAtom(astAtom);
    const [error] = useAtom(astParsingErrorAtom);

    const tokens = ast?.getTokens() ?? [];

    return (
        <>
            {error && <ErrorView error={error} />}
            <TokenizedCodeWidget
                tokens={tokens}
                originalCode={expression}
            />
        </>
    );
}
