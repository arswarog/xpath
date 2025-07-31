import block from 'bem-css-modules';

import { ScreenAtom } from './atom';
import styles from './component.module.scss';

const b = block(styles, 'XPathEditor');

export interface IScreenProps {
    data: ScreenAtom;
    onChange?: (code: string) => void;
}

export function XPathEditorComponent({ data, onChange }: IScreenProps) {
    const { code } = data;
    return (
        <textarea
            className={b('')}
            value={code}
            onChange={(e) => onChange?.(e.target.value)}
            autoFocus
            rows={15}
        />
    );
}
