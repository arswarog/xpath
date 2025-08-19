import { forwardRef } from 'react';

import { Token } from '@src/parser';
import { SyntaxTheme } from '@src/shared/syntax-theme';

import { tokensMap } from './tokens-map';

interface TokenizedCodeViewProps {
    tokens: Token[];
    fontSize?: string;
}

export const TokenizedCodeView = forwardRef<HTMLPreElement, TokenizedCodeViewProps>(
    ({ tokens, fontSize }, ref) => {
        return (
            <SyntaxTheme
                fontSize={fontSize}
                ref={ref}
            >
                {tokens.map((token, index) => {
                    const Component = tokensMap[token.type];

                    return <Component key={index}>{token.text}</Component>;
                })}
            </SyntaxTheme>
        );
    },
);
