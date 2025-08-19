import { useAtom } from '@reatom/npm-react';

import { astAtom, astParsingErrorAtom } from '@src/features/evaluate';
import { AstView } from '@src/widgets/ast-view';
import { ErrorView } from '@src/widgets/error-view';

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
