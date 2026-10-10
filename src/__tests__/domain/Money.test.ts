import { describe, it, expect } from 'vitest';
import { Money } from '../../domain/value-objects/Money';

describe('Money Value Object', () => {
  it('creates money from cents and formats correctly', () => {
    const m = Money.ofCents(1500000, 'COP');
    expect(m.amountCents).toBe(1500000);
    expect(m.toDecimal()).toBe(15000);
    expect(m.currency).toBe('COP');
  });

  it('creates money from decimal without float drift', () => {
    const m = Money.ofDecimal(19.99, 'COP');
    expect(m.amountCents).toBe(1999);
    expect(m.toDecimal()).toBe(19.99);
  });

  it('adds two monies of the same currency', () => {
    const m1 = Money.ofDecimal(100, 'COP');
    const m2 = Money.ofDecimal(50.5, 'COP');
    const sum = m1.add(m2);
    expect(sum.amountCents).toBe(15050);
    expect(sum.toDecimal()).toBe(150.5);
  });

  it('multiplies money by an integer quantity', () => {
    const price = Money.ofDecimal(12000, 'COP');
    const subtotal = price.multiply(3);
    expect(subtotal.amountCents).toBe(3600000);
    expect(subtotal.toDecimal()).toBe(36000);
  });

  it('throws on negative cents or decimals', () => {
    expect(() => Money.ofCents(-100)).toThrow();
    expect(() => Money.ofDecimal(-10.5)).toThrow();
  });
});
