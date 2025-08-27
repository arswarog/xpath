import { forwardRef, ReactNode } from 'react';

import { PositionalError, Token } from '@src/parser';
import { SyntaxTheme } from '@src/shared/syntax-theme';

import { viewToken } from './view-token.tsx';

interface TokenizedCodeViewProps {
    tokens: Token[];
    error?: PositionalError;
    fontSize?: string;
}

export const TokenizedCodeView = forwardRef<HTMLPreElement, TokenizedCodeViewProps>(
    ({ tokens, error, fontSize }, ref) => {
        return (
            <SyntaxTheme
                fontSize={fontSize}
                padding="6px 12px"
                ref={ref}
            >
                {tokens.map(highlightError(viewToken, error))}
            </SyntaxTheme>
        );
    },
);

function highlightError(
    viewToken: (token: Token, key: number | string) => ReactNode,
    error: PositionalError | undefined,
): (token: Token, key: number | string) => ReactNode {
    return (token, key) => {
        return viewToken(token, key);
    };
}
