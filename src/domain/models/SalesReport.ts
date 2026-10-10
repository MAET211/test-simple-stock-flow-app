import { Money } from '../value-objects/Money';

export interface SalesReportRow {
  productId: string;
  productName: string;
  categoryName: string;
  unitsSold: number;
  revenue: Money;
}

export interface SalesReport {
  from: Date;
  to: Date;
  salesCount: number;
  grandTotal: Money;
  currency: string;
  rows: SalesReportRow[];
}
