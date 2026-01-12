import { useAtom } from '@reatom/npm-react';

import {
    astAtom,
    astParsingErrorAtom,
    ErrorView,
    expressionAtom,
    TokenizedCodeWidget,
} from '@src/modules/xpath-editor';

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
