import './App.css';
import block from 'bem-css-modules';

import styles from './components/CalculatorUI.module.scss';
import { DisplayWidget } from './components/Display.widget';
import { KeyboardWidget } from './components/Keyboard.widget';
const b = block(styles, 'CalculatorUI');

export function App() {
    return (
        <div className={b()}>
            <DisplayWidget />
            <KeyboardWidget />
        </div>
    );
}
