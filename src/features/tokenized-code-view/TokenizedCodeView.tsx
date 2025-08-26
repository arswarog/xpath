import { forwardRef } from 'react';

import { Token } from '@src/parser';
import { SyntaxTheme } from '@src/shared/syntax-theme';

import { viewToken } from './view-token.tsx';

interface TokenizedCodeViewProps {
    tokens: Token[];
    fontSize?: string;
}

export const TokenizedCodeView = forwardRef<HTMLPreElement, TokenizedCodeViewProps>(
    ({ tokens, fontSize }, ref) => {
        return (
            <SyntaxTheme
                fontSize={fontSize}
                padding="6px 12px"
                ref={ref}
            >
                {tokens.map(viewToken)}&nbsp;
            </SyntaxTheme>
        );
    },
);
