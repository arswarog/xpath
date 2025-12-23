import { Token, TokenType } from '@src/modules/xpath-parser';

interface TokensViewProps {
    tokens: Token[];
}

import block from 'bem-css-modules';

import styles from './TokensView.module.scss';

const b = block(styles, 'TokensView');

export function TokensView({ tokens }: TokensViewProps) {
    return (
        <div className={b()}>
            <table className={b('table')}>
                <thead>
                    <tr className={b('header')}>
                        <th className={b('type')}>Тип</th>
                        <th className={b('text')}>Текст</th>
                        <th className={b('position')}>Позиция</th>
                        <th className={b('position')}>Длина</th>
                    </tr>
                </thead>
                <tbody>
                    {tokens.map((token) => (
                        <tr
                            key={token.start}
                            className={b('row', { error: token.type === TokenType.UnknownSymbol })}
                        >
                            <td className={b('type')}>{TokenType[token.type]}</td>
                            <td className={b('text')}>
                                "<span className={b('text-content')}>{token.text}</span>"
                            </td>
                            <td className={b('position')}>
                                {token.start} - {token.end}
                            </td>
                            <td className={b('position')}>
                                <i>{token.end - token.start}</i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
