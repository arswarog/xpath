import block from 'bem-css-modules';

import styles from './SiteTitle.module.scss';

const b = block(styles, 'SiteTitle');

export function SiteTitle() {
    return <h1 className={b()}>Калькулятор времени</h1>;
}
