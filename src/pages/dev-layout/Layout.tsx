import block from 'bem-css-modules';
import { Outlet } from 'react-router';

import { Navbar } from '@src/widgets/navbar';
import { XPathEditor } from '@src/widgets/xpath-editor';

import styles from './Layout.module.scss';
const b = block(styles, 'DevLayout');

export function DevLayout() {
    return (
        <div className={b()}>
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
