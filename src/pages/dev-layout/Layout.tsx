import block from 'bem-css-modules';
import { Outlet } from 'react-router';

import { XPathEditor } from '@src/modules/xpath-editor';
import { Navbar } from '@src/widgets/navbar';

import styles from './Layout.module.scss';
const b = block(styles, 'DevLayout');

export function DevLayout({ stickyEditor }: { stickyEditor?: boolean }) {
    return (
        <div className={b({ stickyEditor })}>
            <h1 className={b('title')}>Парсер XPath</h1>
            <div className={b('display')}>
                <XPathEditor />
            </div>
            <Navbar />
            <div className={b('page')}>
                <Outlet />
            </div>
        </div>
    );
}
