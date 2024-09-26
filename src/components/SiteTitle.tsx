import styles from './SiteTitle.module.scss';
import block from 'bem-css-modules';

const b = block(styles, 'SiteTitle');

export function SiteTitle() {
    return <h1 className={b()}>Калькулятор времени</h1>;
}
