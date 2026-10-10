export class Quantity {
  private constructor(public readonly value: number) {}

  public static of(value: number): Quantity {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('La cantidad debe ser un entero mayor que cero.');
    }
    return new Quantity(value);
  }
}
