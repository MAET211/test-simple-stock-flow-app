import { describe, it, expect } from 'vitest';
import { Quantity } from '../../domain/value-objects/Quantity';

describe('Quantity Value Object', () => {
  it('creates positive integer quantity', () => {
    const q = Quantity.of(5);
    expect(q.value).toBe(5);
  });

  it('throws on zero, negative or non-integer', () => {
    expect(() => Quantity.of(0)).toThrow('La cantidad debe ser un entero mayor que cero.');
    expect(() => Quantity.of(-1)).toThrow('La cantidad debe ser un entero mayor que cero.');
    expect(() => Quantity.of(1.5)).toThrow('La cantidad debe ser un entero mayor que cero.');
  });
});
