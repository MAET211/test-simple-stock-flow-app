import { Product, PagedProducts } from '../../domain/models/Product';
import { Money } from '../../domain/value-objects/Money';
import { ProductDto, PagedResultDto } from '../http/dto/api.dto';

export class ProductMapper {
  public static toDomain(dto: ProductDto): Product {
    return {
      id: dto.id,
      name: dto.name,
      price: Money.ofDecimal(dto.price, dto.currency || 'COP'),
      stock: dto.stock,
      categoryId: dto.categoryId,
      categoryName: dto.categoryName,
      imageUrl: dto.imageUrl,
    };
  }

  public static toPagedDomain(dto: PagedResultDto<ProductDto>): PagedProducts {
    return {
      items: dto.items.map((i) => ProductMapper.toDomain(i)),
      page: dto.page,
      size: dto.size,
      total: dto.total,
      totalPages: dto.totalPages,
    };
  }
}
