import { SalesReport, SalesReportRow } from '../../domain/models/SalesReport';
import { Money } from '../../domain/value-objects/Money';
import { SalesReportDto, SalesReportRowDto } from '../http/dto/api.dto';

export class SalesReportMapper {
  public static toRowDomain(dto: SalesReportRowDto, currency: string = 'COP'): SalesReportRow {
    return {
      productId: dto.productId,
      productName: dto.productName,
      categoryName: dto.categoryName,
      unitsSold: dto.unitsSold,
      revenue: Money.ofDecimal(dto.revenue, currency),
    };
  }

  public static toDomain(dto: SalesReportDto): SalesReport {
    const currency = dto.currency || 'COP';
    return {
      from: new Date(dto.from),
      to: new Date(dto.to),
      salesCount: dto.salesCount,
      grandTotal: Money.ofDecimal(dto.grandTotal, currency),
      currency,
      rows: dto.rows.map((r) => SalesReportMapper.toRowDomain(r, currency)),
    };
  }
}
