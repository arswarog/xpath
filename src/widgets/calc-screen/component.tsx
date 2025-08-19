import block from 'bem-css-modules';

import { ScreenAtom } from './atom';
import styles from './component.module.scss';

const b = block(styles, 'Screen');

export interface IScreenProps {
    data: ScreenAtom;
    onChange?: (code: string) => void;
}

export function ScreenComponent({ data, onChange }: IScreenProps) {
    const { code } = data;
    return (
        <div className={b()}>
            <textarea
                className={b('code')}
                value={code}
                onChange={(e) => onChange?.(e.target.value)}
                autoFocus
                rows={20}
            />
        </div>
    );
}
