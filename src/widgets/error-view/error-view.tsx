import { ReactNode } from 'react';

import block from 'bem-css-modules';

import { HighlightedError } from '@src/modules/xpath-parser';

import styles from './error-view.module.scss';

export interface ErrorViewProps {
    error?: HighlightedError | Error;
}

const b = block(styles, 'ErrorView');

export function ErrorView({ error }: ErrorViewProps): ReactNode {
    if (!error) {
        return null;
    }

    if (!(error instanceof HighlightedError)) {
        return (
            <div className={b()}>
                <h3>Неизвестная ошибка</h3>
                <pre>{error.message}</pre>
            </div>
        );
    }

    return (
        <div className={b()}>
            <h3>Ошибка парсинга</h3>
            <pre>{error.message}</pre>
        </div>
    );
}
