import { JSX, useMemo } from 'react';

import block from 'bem-css-modules';
import { invert } from 'lodash';

import { ButtonCode } from '@src/entities/keyboard';

import styles from './component.module.scss';
import { buttonsMeta, IButtonMeta, keyboardLayout } from './keyboard.layout';

const b = block(styles, 'Keyboard');

const buttonCodes = invert(ButtonCode) as Record<string, ButtonCode>;

export interface IKeyboardProps {
    onClick?: (value: ButtonCode) => void;
}

export function KeyboardComponent({ onClick }: IKeyboardProps) {
    const buttons = useMemo(() => buildButtons(buttonsMeta, keyboardLayout, onClick), [onClick]);
    const gridTemplateAreas = useMemo(() => buildGridTemplateAreas(keyboardLayout), []);

    return (
        <div
            className={b()}
            style={{ gridTemplateAreas }}
        >
            {buttons}
        </div>
    );
}

function buildButtons(
    buttonsMeta: { [key in ButtonCode]: IButtonMeta },
    layout: ButtonCode[][],
    onClick?: (btn: ButtonCode) => void,
): JSX.Element[] {
    const set = new Set<ButtonCode>(layout.flat(2));

    return Object.entries(buttonsMeta)
        .filter(([key]) => set.has(key as ButtonCode))
        .map(([key, meta]) => {
            const keyCode = key as ButtonCode;
            const btnCode = buttonCodes[key];
            return (
                <button
                    key={btnCode}
                    className={b('button', {
                        operator: meta.operator,
                        enter: meta.enter,
                    })}
                    onClick={() => onClick?.(keyCode)}
                    style={{ gridArea: btnCode }}
                >
                    {meta.text}
                </button>
            );
        });
}

function buildGridTemplateAreas(layout: ButtonCode[][]): string {
    return layout.map((row) => `"${row.map((item) => buttonCodes[item]).join(' ')}"`).join('\n');
}
