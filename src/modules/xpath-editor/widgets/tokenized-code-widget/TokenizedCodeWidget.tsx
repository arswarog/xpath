import { useEffect, useRef, useState } from 'react';

import block from 'bem-css-modules';

import { Token } from '@src/modules/xpath-parser';

import { TokenizedCodeView } from '../tokenized-code-view';

import styles from './TokenizedCodeWidget.module.scss';

interface TokenizedCodeWidgetProps {
    tokens: Token[];
    originalCode?: string;
}

const b = block(styles, 'TokenizedCodeWidget');

const NON_BREAKING_SPACE_CODE_POINT = 160;

export function TokenizedCodeWidget({ tokens, originalCode }: TokenizedCodeWidgetProps) {
    const [correctCode, setCorrectCode] = useState(false);
    const [copied, setCopied] = useState(false);
    const codeRef = useRef<HTMLPreElement>(null);

    function getCode(): string {
        let result = codeRef.current?.innerText ?? '';

        if (result.codePointAt(result.length - 1) === NON_BREAKING_SPACE_CODE_POINT) {
            result = result.slice(0, -1);
        }

        return result;
    }

    const copyCode = () => {
        if (codeRef.current) {
            const textToCopy = getCode();
            navigator.clipboard
                .writeText(textToCopy)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 3000);
                })
                .catch(() => alert('Не удалось скопировать код в буфер обмена'));
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
                    {copied ? 'Copied!' : 'Copy'}
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
