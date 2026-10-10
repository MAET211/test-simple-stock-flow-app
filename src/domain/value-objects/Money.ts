export class Money {
  public static readonly DEFAULT_CURRENCY = 'COP';

  private constructor(
    public readonly amountCents: number,
    public readonly currency: string = Money.DEFAULT_CURRENCY
  ) {}

  public static ofCents(cents: number, currency: string = Money.DEFAULT_CURRENCY): Money {
    if (!Number.isInteger(cents) || cents < 0) {
      throw new Error('El importe en centavos debe ser un entero no negativo.');
    }
    return new Money(cents, currency);
  }

  public static ofDecimal(amount: number, currency: string = Money.DEFAULT_CURRENCY): Money {
    if (amount < 0) {
      throw new Error('El importe monetario no puede ser negativo.');
    }
    const cents = Math.round(amount * 100);
    return new Money(cents, currency);
  }

  public static zero(currency: string = Money.DEFAULT_CURRENCY): Money {
    return new Money(0, currency);
  }

  public toDecimal(): number {
    return this.amountCents / 100;
  }

  public format(): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(this.toDecimal());
  }

  public add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(`Conflicto de monedas: ${this.currency} vs ${other.currency}`);
    }
    return new Money(this.amountCents + other.amountCents, this.currency);
  }

  public multiply(factor: number): Money {
    if (!Number.isInteger(factor) || factor < 0) {
      throw new Error('El factor de multiplicación debe ser un entero positivo.');
    }
    return new Money(this.amountCents * factor, this.currency);
  }
}
