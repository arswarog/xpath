import block from 'bem-css-modules';

import { IDisplayData, ButtonCode } from '../types';

import styles from './CalculatorUI.module.scss';
import { Display } from './Display';
import { Keyboard } from './Keyboard';

export interface ICalculatorUIProps {
    display: IDisplayData;
    onChange?: (code: string) => void;
}

const b = block(styles, 'CalculatorUI');

export function CalculatorUI({ display, onChange }: ICalculatorUIProps) {
    const handleClick = (value: ButtonCode) => {
        console.log('Clicked:', value);
    };

    return (
        <div className={b()}>
            <Display
                data={display}
                onChange={onChange}
            />
            <Keyboard onClick={handleClick} />
        </div>
    );
}
