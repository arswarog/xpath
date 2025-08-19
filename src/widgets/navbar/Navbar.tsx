import block from 'bem-css-modules';
import { NavLink } from 'react-router';

import styles from './Navbar.module.scss';

const b = block(styles, 'Navbar');

export function Navbar() {
    return (
        <nav className={b()}>
            <ul className={b('list')}>
                <li className={b('item')}>
                    <NavLink to="/tokens">#tokens</NavLink>
                </li>
                <li className={b('item')}>
                    <NavLink to="/ast">#ast</NavLink>
                </li>
            </ul>
        </nav>
    );
}
