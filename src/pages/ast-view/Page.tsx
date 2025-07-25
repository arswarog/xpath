import { useAtom } from '@reatom/npm-react';
import block from 'bem-css-modules';

import { astAtom } from '@src/features/evaluate';
import { AstView } from '@src/widgets/ast-view';
import { Screen } from '@src/widgets/calc-screen';

import styles from './Page.module.scss';
const b = block(styles, 'AstViewPage');

export function AstViewPage() {
    const [ast] = useAtom(astAtom);

    return (
        <div className={b()}>
            <h1 className={b('title')}>Просмотр AST</h1>
            <div className={b('display')}>
                <Screen />
            </div>
            <div className={b('ast')}>
                {ast ? <AstView ast={ast} /> : 'Ошибка парсинга выражения'}
            </div>
        </div>
    );
}
