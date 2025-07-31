import { useEffect, useRef, useState } from 'react';

import block from 'bem-css-modules';

import { Token } from '@src/parser';
import { SyntaxTheme } from '@src/shared/syntax-theme';

import styles from './TokenizedCodeView.module.scss';
import { tokensMap } from './tokens-map';

interface TokenizedCodeViewProps {
    tokens: Token[];
    originalCode?: string;
}

const b = block(styles, 'TokenizedCodeView');

export function TokenizedCodeView({ tokens, originalCode }: TokenizedCodeViewProps) {
    const [correctCode, setCorrectCode] = useState(false);
    const codeRef = useRef<HTMLPreElement>(null);

    const copyCode = () => {
        if (codeRef.current) {
            const textToCopy = codeRef.current.innerText;
            navigator.clipboard
                .writeText(textToCopy)
                .then(() => alert('Текст скопирован!'))
                .catch(() => alert('Ошибка при копировании'));
        }
    };

    useEffect(() => {
        if (originalCode) {
            const code = codeRef.current?.innerText;
            setCorrectCode(code === originalCode);
        }
    }, [originalCode, tokens]);

    return (
        <div className={b()}>
            <div className={b('toolbar')}>
                {originalCode && (
                    <div className={b('toolbar-item')}>{correctCode ? '✅' : '❌'}</div>
                )}
                <button
                    className={b('toolbar-item')}
                    onClick={copyCode}
                >
                    Copy
                </button>
            </div>
            <SyntaxTheme
                fontSize="1.2rem"
                ref={codeRef}
            >
                {tokens.map((token) => {
                    const Component = tokensMap[token.type];

                    return <Component>{token.text}</Component>;
                })}
            </SyntaxTheme>
        </div>
    );
}
