import { Positionable } from './types';

export class PositionalError extends Error {
    constructor(
        public readonly error: string,
        public readonly position: Positionable,
    ) {
        super(`${error} at position ${position.start}`);
    }
}

export class HighlightedError extends Error {
    constructor(
        public readonly error: PositionalError,
        public readonly source: string,
    ) {
        const message = formatError(source, error.error, error.position);
        super(message);
        // @ts-expect-error Error.cause is available in modern environments but not in TypeScript definitions
        this.cause = error;
    }
}

function formatError(source: string, error: string, position: Positionable) {
    const prefix = 'Line: ';
    const { start, end } = position;
    const lines = source.split('\n');
    let currentPos = 0;
    let message = `${error}\n`;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineStart = currentPos;
        const lineEnd = currentPos + line.length;

        // Determine if the current line is affected by the error
        if (end > lineStart && start <= lineEnd) {
            const errorStart = Math.max(start, lineStart) - lineStart;
            const errorEnd = Math.min(end, lineEnd) - lineStart;
            const pointer =
                ' '.repeat(errorStart + prefix.length) +
                '~'.repeat(Math.max(1, errorEnd - errorStart));
            message += `${prefix}${line}\n${pointer}\n`;
        } else {
            message += `${prefix}${line}\n`;
        }

        currentPos = lineEnd + 1; // +1 for the newline character
    }

    return message;
}
