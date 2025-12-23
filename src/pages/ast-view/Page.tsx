import { useAtom } from '@reatom/npm-react';

import { astAtom, astParsingErrorAtom, AstView, ErrorView } from '@src/modules/xpath-editor';

export function AstViewPage() {
    const [ast] = useAtom(astAtom);
    const [error] = useAtom(astParsingErrorAtom);

    return (
        <>
            {error && <ErrorView error={error} />}
            {ast ? <AstView ast={ast} /> : 'Ошибка парсинга выражения'}
        </>
    );
}
