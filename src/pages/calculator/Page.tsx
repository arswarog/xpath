import block from 'bem-css-modules';

import { Screen } from '@src/widgets/calc-screen';
import { Keyboard } from '@src/widgets/keyboard';

import styles from './Page.module.scss';
const b = block(styles, 'CalculatorPage');

export function CalculatorPage() {
    return (
        <div className={b()}>
            <div className={b('calculator')}>
                <Screen />
                <Keyboard />
            </div>
        </div>
    );
}
