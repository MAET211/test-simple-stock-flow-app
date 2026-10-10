import { Money } from '../value-objects/Money';

export interface Product {
  id: string;
  name: string;
  price: Money;
  stock: number;
  categoryId: string;
  categoryName: string;
  imageUrl: string | null;
}

export interface PagedProducts {
  items: Product[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}
