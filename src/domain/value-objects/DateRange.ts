export class DateRange {
  public constructor(
    public readonly from: Date,
    public readonly to: Date
  ) {
    if (from > to) {
      throw new Error('La fecha inicial no puede ser posterior a la fecha final.');
    }
  }

  public toIsoStrings(): { from: string; to: string } {
    return {
      from: this.from.toISOString(),
      to: this.to.toISOString(),
    };
  }

  public static today(): DateRange {
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    const to = new Date();
    to.setHours(23, 59, 59, 999);
    return new DateRange(from, to);
  }

  public static thisMonth(): DateRange {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return new DateRange(from, to);
  }
}
