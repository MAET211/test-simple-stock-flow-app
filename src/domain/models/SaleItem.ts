import { Money } from '../value-objects/Money';

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: Money;
  subtotal: Money;
}
