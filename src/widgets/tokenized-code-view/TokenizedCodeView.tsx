import block from 'bem-css-modules';

import { Token } from '@src/parser';
import { SyntaxTheme } from '@src/shared/syntax-theme';

import styles from './TokenizedCodeView.module.scss';
import { tokensMap } from './tokens-map';

interface TokenizedCodeViewProps {
    tokens: Token[];
}

const b = block(styles, 'TokenizedCodeView');

export function TokenizedCodeView({ tokens }: TokenizedCodeViewProps) {
    return (
        <div className={b()}>
            <SyntaxTheme fontSize="16px">
                {tokens.map((token) => {
                    const Component = tokensMap[token.type];

                    return <Component>{token.text}</Component>;
                })}
            </SyntaxTheme>
        </div>
    );
}
