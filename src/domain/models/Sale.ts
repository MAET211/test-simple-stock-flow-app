import { Money } from '../value-objects/Money';
import { SaleItem } from './SaleItem';

export interface Sale {
  id: string;
  soldAt: Date;
  soldBy: string;
  total: Money;
  currency: string;
  items: SaleItem[];
}

export interface PagedSales {
  items: Sale[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}
