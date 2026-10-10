import { Sale, PagedSales } from '../../domain/models/Sale';
import { SaleItem } from '../../domain/models/SaleItem';
import { Money } from '../../domain/value-objects/Money';
import { SaleDto, SaleItemDto, PagedResultDto } from '../http/dto/api.dto';

export class SaleMapper {
  public static toItemDomain(dto: SaleItemDto, currency: string = 'COP'): SaleItem {
    return {
      productId: dto.productId,
      productName: dto.productName,
      quantity: dto.quantity,
      unitPrice: Money.ofDecimal(dto.unitPrice, currency),
      subtotal: Money.ofDecimal(dto.subtotal, currency),
    };
  }

  public static toDomain(dto: SaleDto): Sale {
    const currency = dto.currency || 'COP';
    return {
      id: dto.id,
      soldAt: new Date(dto.soldAt),
      soldBy: dto.soldBy,
      total: Money.ofDecimal(dto.total, currency),
      currency,
      items: dto.items.map((i) => SaleMapper.toItemDomain(i, currency)),
    };
  }

  public static toPagedDomain(dto: PagedResultDto<SaleDto>): PagedSales {
    return {
      items: dto.items.map((s) => SaleMapper.toDomain(s)),
      page: dto.page,
      size: dto.size,
      total: dto.total,
      totalPages: dto.totalPages,
    };
  }
}
