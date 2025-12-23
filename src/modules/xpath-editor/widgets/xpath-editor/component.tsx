import { useLayoutEffect, useRef } from 'react';

import block from 'bem-css-modules';

import { PositionalError, Token } from '@src/modules/xpath-parser';

import { TokenizedCodeView } from '../tokenized-code-view';

import styles from './component.module.scss';

const b = block(styles, 'XPathEditor');

export interface IScreenProps {
    code: string;
    tokens: Token[];
    error?: PositionalError;
    onChange?: (code: string) => void;
}

export function XPathEditorComponent({ code, tokens, error, onChange }: IScreenProps) {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const tokensRef = useRef<HTMLPreElement>(null);

    useLayoutEffect(() => {
        if (!textAreaRef.current || !tokensRef.current) {
            return;
        }

        textAreaRef.current!.style.height = `${tokensRef.current!.scrollHeight}px`;
    });

    return (
        <div className={b()}>
            <div className={b('tokens')}>
                <TokenizedCodeView
                    tokens={tokens}
                    error={error}
                    ref={tokensRef}
                />
            </div>
            <textarea
                className={b('textarea')}
                ref={textAreaRef}
                value={code}
                onChange={(e) => onChange?.(e.target.value)}
                autoFocus
                rows={15}
            />
        </div>
    );
}
