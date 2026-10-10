import { describe, it, expect } from 'vitest';
import { DateRange } from '../../domain/value-objects/DateRange';

describe('DateRange Value Object', () => {
  it('creates valid date range', () => {
    const from = new Date('2026-01-01T00:00:00Z');
    const to = new Date('2026-02-01T00:00:00Z');
    const range = new DateRange(from, to);
    expect(range.from).toEqual(from);
    expect(range.to).toEqual(to);
  });

  it('throws when from is after to', () => {
    const from = new Date('2026-02-01T00:00:00Z');
    const to = new Date('2026-01-01T00:00:00Z');
    expect(() => new DateRange(from, to)).toThrow('La fecha inicial no puede ser posterior a la fecha final.');
  });
});
