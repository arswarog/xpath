import { useEffect, useRef, useState } from 'react';

import block from 'bem-css-modules';

import { TokenizedCodeView } from '@src/features/tokenized-code-view';
import { Token } from '@src/parser';

import styles from './TokenizedCodeWidget.module.scss';

interface TokenizedCodeWidgetProps {
    tokens: Token[];
    originalCode?: string;
}

const b = block(styles, 'TokenizedCodeWidget');

export function TokenizedCodeWidget({ tokens, originalCode }: TokenizedCodeWidgetProps) {
    const [correctCode, setCorrectCode] = useState(false);
    const codeRef = useRef<HTMLPreElement>(null);

    function getCode(): string {
        let result = codeRef.current?.innerText ?? '';

        if (result.codePointAt(result.length - 1) === 160) {
            result = result.slice(0, -1);
        }

        return result;
    }

    const copyCode = () => {
        if (codeRef.current) {
            const textToCopy = getCode();
            navigator.clipboard
                .writeText(textToCopy)
                .then(() => alert('Текст скопирован!'))
                .catch(() => alert('Ошибка при копировании'));
        }
    };

    useEffect(() => {
        if (originalCode) {
            const code = getCode();
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
            <TokenizedCodeView
                tokens={tokens}
                fontSize="1.2rem"
                ref={codeRef}
            />
        </div>
    );
}
