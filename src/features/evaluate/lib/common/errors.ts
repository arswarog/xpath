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
        const prefix = 'Line: ';
        const { start, end } = error.position;

        const line = source;
        const pointer = ' '.repeat(start + prefix.length) + '~'.repeat(Math.max(1, end - start));

        const message = `${error.error}\n${prefix}${line}\n${pointer}`;
        super(message);
        // @ts-expect-error Error.cause is available in modern environments but not in TypeScript definitions
        this.cause = error;
    }
}
