import { forwardRef } from 'react';

import { PositionalError, Token } from '@src/parser';
import { SyntaxTheme } from '@src/shared/syntax-theme';

import { viewToken, ViewTokenFn } from './view-token';

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

function highlightError(viewToken: ViewTokenFn, error: PositionalError | undefined): ViewTokenFn {
    if (!error) {
        return viewToken;
    }

    const { start, end } = error.position;

    return (token, key) => {
        const view = viewToken(token, key);

        if (token.start >= start && token.end <= end) {
            return (
                <span
                    style={{
                        textDecorationLine: 'underline',
                        textDecorationStyle: 'wavy',
                        textDecorationColor: 'red',
                        backgroundColor: 'rgb(255 0 0 / 50%)',
                    }}
                >
                    {view}
                </span>
            );
        }

        return view;
    };
}
