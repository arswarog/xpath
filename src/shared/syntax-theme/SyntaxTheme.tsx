import { FC, forwardRef, HTMLAttributes, PropsWithChildren } from 'react';

import block from 'bem-css-modules';

import { createCompositeComponent } from '@src/shared/common';

import styles from './SyntaxTheme.module.scss';

const b = block(styles, 'SyntaxTheme');

export interface SyntaxThemeProps {
    fontSize?: string;
    padding?: string;
}

const SyntaxThemeComponent = forwardRef<HTMLPreElement, PropsWithChildren<SyntaxThemeProps>>(
    ({ children, fontSize, padding }, ref) => {
        return (
            <pre
                ref={ref}
                className={b()}
                style={{ fontSize, padding }}
            >
                {children}
            </pre>
        );
    },
);

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
    HighlightedError: componentFactory('highlightedError'),
});

export type SyntaxThemeItem = FC<PropsWithChildren<HTMLAttributes<HTMLSpanElement>>>;

function componentFactory(styleName: string): SyntaxThemeItem {
    const Component: SyntaxThemeItem = ({ children, className, ...props }) => {
        return (
            <code
                {...props}
                className={b(styleName) + (className ? ` ${className}` : '')}
            >
                {children}
            </code>
        );
    };

    Component.displayName = `SyntaxTheme.${styleName}`;

    return Component;
}
