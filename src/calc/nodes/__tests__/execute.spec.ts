import { describe, expect, it } from 'vitest';

import { parse } from '../../parser';
import { ValueType } from '../value.type';

describe('Execute', () => {
    it('12', () => {
        // Arrange
        const root = parse('12');

        // Act
        const result = root.evaluate();

        // Assert
        expect(result).toEqual({
            type: ValueType.Number,
            value: 12,
        });
    });
    it('3+3', () => {
        // Arrange
        const root = parse('3+3');

        // Act
        const result = root.evaluate();

        // Assert
        expect(result).toEqual({
            type: ValueType.Number,
            value: 6,
        });
    });
    it('512/8', () => {
        // Arrange
        const root = parse('512/8');

        // Act
        const result = root.evaluate();

        // Assert
        expect(result).toEqual({
            type: ValueType.Number,
            value: 64,
        });
    });
    it('3+512/8', () => {
        // Arrange
        const root = parse('3+512/8');

        // Act
        const result = root.evaluate();

        // Assert
        expect(result).toEqual({
            type: ValueType.Number,
            value: 67,
        });
    });
});
