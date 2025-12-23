import block from 'bem-css-modules';
import { Outlet } from 'react-router';

import { XPathEditor } from '@src/modules/xpath-editor';

import styles from './Layout.module.scss';
const b = block(styles, 'DevToolsLayout');

export function DevToolsLayout({ stickyEditor }: { stickyEditor?: boolean }) {
    return (
        <div className={b({ stickyEditor })}>
            <div className={b('display')}>
                <XPathEditor />
            </div>
            <div className={b('page')}>
                <Outlet />
            </div>
        </div>
    );
}
