import block from 'bem-css-modules';

import { DisplayAtom } from '../state';

import styles from './Display.module.scss';

const b = block(styles, 'Display');

export interface IDisplayProps {
    data: DisplayAtom;
    onChange?: (code: string) => void;
}

export function Display({ data, onChange }: IDisplayProps) {
    const { code, result, error } = data;
    return (
        <div className={b()}>
            <input
                className={b('code')}
                value={code}
                onChange={(e) => onChange?.(e.target.value)}
            />
            <div className={b('result', { error })}>&nbsp;{result}</div>
        </div>
    );
}
