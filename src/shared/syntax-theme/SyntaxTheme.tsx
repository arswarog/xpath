import { FC, HTMLAttributes, PropsWithChildren } from 'react';

import block from 'bem-css-modules';

import { createCompositeComponent } from '@src/shared/common';

import styles from './SyntaxTheme.module.scss';

const b = block(styles, 'SyntaxTheme');

interface SyntaxThemeProps {
    fontSize?: string;
}

function SyntaxThemeComponent({ children, fontSize }: PropsWithChildren<SyntaxThemeProps>) {
    return (
        <pre
            className={b()}
            style={{ fontSize }}
        >
            {children}
        </pre>
    );
}

export const SyntaxTheme = createCompositeComponent(SyntaxThemeComponent, 'SyntaxTheme', {
    Regular: componentFactory('regular'),
    Variable: componentFactory('variable'),
    Keyword: componentFactory('keyword'),
    Number: componentFactory('number'),
    Constant: componentFactory('constant'),
    Method: componentFactory('method'),
    String: componentFactory('string'),
    Operator: componentFactory('operator'),
    Comment: componentFactory('comment'),
    Error: componentFactory('error'),
});

export type SyntaxThemeItem = FC<PropsWithChildren<HTMLAttributes<HTMLSpanElement>>>;

function componentFactory(styleName: string): SyntaxThemeItem {
    const Component: SyntaxThemeItem = ({ children, className, ...props }) => (
        <span
            {...props}
            className={b(styleName) + (className ? ` ${className}` : '')}
        >
            {children}
        </span>
    );

    Component.displayName = `SyntaxTheme.${styleName}`;

    return Component;
}
