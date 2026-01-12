import { HighlightedError, PositionalError } from '../../common';
import { analyzeCode } from '../../lexer';
import { AbstractNode } from '../../nodes';
import { createContext, ParserContext } from '../context';
import { checkTokensOrder, checkUndefinedTokens } from '../utils';

export function createPartialParser<T extends AbstractNode>(parser: (ctx: ParserContext) => T) {
    return (source: string): T => {
        try {
            const node = parser(createContext(analyzeCode(source)));

            const codeTokens = node.getTokens();

            checkUndefinedTokens(codeTokens);
            checkTokensOrder(codeTokens);

            const restoredSource = codeTokens.map((token) => token.text).join('');

            if (restoredSource !== source) {
                throw new Error(
                    [
                        'Restored source is not equal to original source.',
                        `Restored: ${restoredSource}`,
                        `Original: ${source}`,
                    ].join('\n'),
                );
            }

            return node;
        } catch (e) {
            if (e instanceof PositionalError) {
                throw new HighlightedError(e, source);
            } else {
                throw e;
            }
        }
    };
}
