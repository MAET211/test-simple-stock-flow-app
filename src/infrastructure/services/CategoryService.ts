import { CategoryPort } from '../../application/ports/CategoryPort';
import { Category } from '../../domain/models/Category';
import { CategoryDto } from '../http/dto/api.dto';
import { httpClient } from '../http/FetchHttpClient';
import { CategoryMapper } from '../mappers/CategoryMapper';

export class CategoryService implements CategoryPort {
  public async listCategories(): Promise<Category[]> {
    const dtos = await httpClient.get<CategoryDto[]>('/api/categories');
    return dtos.map((d) => CategoryMapper.toDomain(d));
  }
}

export const categoryService = new CategoryService();
