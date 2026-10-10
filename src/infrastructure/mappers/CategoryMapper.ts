import { Category } from '../../domain/models/Category';
import { CategoryDto } from '../http/dto/api.dto';

export class CategoryMapper {
  public static toDomain(dto: CategoryDto): Category {
    return {
      id: dto.id,
      name: dto.name,
    };
  }
}
