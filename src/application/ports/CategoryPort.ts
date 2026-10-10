import { Category } from '../../domain/models/Category';

export interface CategoryPort {
  listCategories(): Promise<Category[]>;
}
