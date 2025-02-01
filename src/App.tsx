import './App.css';
import { reatomContext } from '@reatom/npm-react';
import block from 'bem-css-modules';

import styles from './components/CalculatorUI.module.scss';
import { DisplayWidget } from './components/Display.widget';
import { KeyboardWidget } from './components/Keyboard.widget';
import { ctx } from './state';
const b = block(styles, 'CalculatorUI');

export function App() {
    return (
        <reatomContext.Provider value={ctx}>
            <div className={b()}>
                <DisplayWidget />
                <KeyboardWidget />
            </div>
        </reatomContext.Provider>
    );
}
