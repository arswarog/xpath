import { forwardRef } from 'react';

import { Token } from '@src/parser';
import { SyntaxTheme, SyntaxThemeProps } from '@src/shared/syntax-theme';

import { tokensMap } from './tokens-map';

interface TokenizedCodeViewProps extends SyntaxThemeProps {
    tokens: Token[];

    onChange?: (code: string) => void;
}

export const TokenizedCodeEditor = forwardRef<HTMLPreElement, TokenizedCodeViewProps>(
    ({ tokens }, ref) => {
        return (
            <SyntaxTheme
                fontSize="1.2rem"
                ref={ref}
            >
                {tokens.map((token, index) => {
                    const Component = tokensMap[token.type];

                    return <Component key={index}>{token.text}</Component>;
                })}
                &nbsp;
            </SyntaxTheme>
        );
    },
);
