import styles from './CalculatorUI.module.scss';
import block from 'bem-css-modules';
import { Display } from './Display.tsx';
import { IDisplayData, ButtonCode } from '../types';
import { Keyboard } from './Keyboard.tsx';

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
